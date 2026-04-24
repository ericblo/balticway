"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl, { type Map as MapboxMap, type Marker } from "mapbox-gl"
import { CITIES, type City, haversineKm } from "@/lib/cities"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
const TARGET_KM = 675

type Props = {
  origin: City | null
}

type RouteInfo = {
  target: City
  distanceKm: number
  geometry: GeoJSON.LineString
}

async function fetchRoute(
  a: [number, number],
  b: [number, number],
): Promise<{ distanceKm: number; geometry: GeoJSON.LineString } | null> {
  if (!MAPBOX_TOKEN) return null
  const coords = `${a[0]},${a[1]};${b[0]},${b[1]}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const route = data.routes?.[0]
    if (!route) return null
    return {
      distanceKm: route.distance / 1000,
      geometry: route.geometry as GeoJSON.LineString,
    }
  } catch {
    return null
  }
}

async function findTargetCity(origin: City): Promise<RouteInfo | null> {
  const candidates = CITIES.filter(
    (c) => c.name !== origin.name || c.country !== origin.country,
  )
    .map((c) => ({
      city: c,
      straight: haversineKm([origin.lng, origin.lat], [c.lng, c.lat]),
    }))
    .filter((x) => x.straight >= 400 && x.straight <= 680)
    .sort((a, b) => Math.abs(a.straight - 560) - Math.abs(b.straight - 560))
    .slice(0, 5)

  let best: RouteInfo | null = null
  for (const { city } of candidates) {
    const route = await fetchRoute(
      [origin.lng, origin.lat],
      [city.lng, city.lat],
    )
    if (!route) continue
    if (
      !best ||
      Math.abs(route.distanceKm - TARGET_KM) <
        Math.abs(best.distanceKm - TARGET_KM)
    ) {
      best = { target: city, ...route }
    }
    if (best && Math.abs(best.distanceKm - TARGET_KM) < 25) break
  }
  return best
}

// Simple pin element — sized exactly to the dot, so the coordinate lands on
// the visual center. No label inside: labels are rendered as React overlays.
function buildPinEl(kind: "origin" | "target"): HTMLElement {
  const isOrigin = kind === "origin"
  const el = document.createElement("div")
  el.style.cssText = `
    width: 14px;
    height: 14px;
    border-radius: 9999px;
    background: ${isOrigin ? "#f4c57a" : "#e6e9ef"};
    border: 2px solid #0f1a2e;
    box-shadow: 0 0 0 4px ${isOrigin ? "rgba(244,197,122,0.28)" : "rgba(230,233,239,0.22)"};
    cursor: pointer;
  `
  return el
}

export function BalticMap({ origin }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const markersRef = useRef<Marker[]>([])
  const [route, setRoute] = useState<RouteInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return
    if (!MAPBOX_TOKEN) {
      setError("Mapbox token is missing.")
      return
    }
    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [24.1052, 56.9496],
      zoom: 4.4,
      attributionControl: true,
    })
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    )

    map.on("load", () => {
      map.resize()
      map.addSource("chain", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      })
      map.addLayer({
        id: "chain-glow",
        type: "line",
        source: "chain",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#f4c57a",
          "line-width": 10,
          "line-opacity": 0.18,
          "line-blur": 4,
        },
      })
      map.addLayer({
        id: "chain-line",
        type: "line",
        source: "chain",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#f4c57a",
          "line-width": 3,
          "line-opacity": 0.95,
        },
      })
      setMapReady(true)
    })

    // Keep canvas perfectly in sync with the container at all times.
    const ro = new ResizeObserver(() => {
      if (!mapRef.current) return
      mapRef.current.resize()
    })
    ro.observe(mapContainer.current)
    const onWinResize = () => map.resize()
    window.addEventListener("resize", onWinResize)

    mapRef.current = map
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", onWinResize)
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || !origin) return

    let cancelled = false

    async function run() {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      const src = map!.getSource("chain") as mapboxgl.GeoJSONSource | undefined
      src?.setData({ type: "FeatureCollection", features: [] })

      const originMarker = new mapboxgl.Marker({
        element: buildPinEl("origin"),
        anchor: "center",
      })
        .setLngLat([origin!.lng, origin!.lat])
        .addTo(map!)
      markersRef.current.push(originMarker)

      map!.flyTo({
        center: [origin!.lng, origin!.lat],
        zoom: 5.2,
        duration: 1400,
        essential: true,
      })

      setLoading(true)
      setError(null)
      setRoute(null)

      const result = await findTargetCity(origin!)
      if (cancelled) return

      if (!result) {
        setLoading(false)
        setError("Could not find a city ~675km away by road.")
        return
      }

      const targetMarker = new mapboxgl.Marker({
        element: buildPinEl("target"),
        anchor: "center",
      })
        .setLngLat([result.target.lng, result.target.lat])
        .addTo(map!)
      markersRef.current.push(targetMarker)

      src?.setData({
        type: "FeatureCollection",
        features: [
          { type: "Feature", properties: {}, geometry: result.geometry },
        ],
      })

      const bounds = new mapboxgl.LngLatBounds()
      bounds.extend([origin!.lng, origin!.lat])
      bounds.extend([result.target.lng, result.target.lat])
      const isNarrow = map!.getContainer().clientWidth < 640
      map!.fitBounds(bounds, {
        padding: isNarrow
          ? { top: 60, bottom: 60, left: 40, right: 40 }
          : { top: 80, bottom: 80, left: 320, right: 80 },
        duration: 1400,
        maxZoom: 6.5,
      })

      setRoute(result)
      setLoading(false)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [origin, mapReady])

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
      {/* The map container is a plain block element with explicit height.
          No absolute positioning — this guarantees the canvas size matches
          the visible area exactly, so markers and the rendered tiles align. */}
      <div
        ref={mapContainer}
        className="h-[70vh] min-h-[420px] w-full"
        style={{ maxHeight: 720 }}
        aria-label="Map showing the Baltic Way chain from your chosen city"
      />

      {/* Stats overlay */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 md:left-6 md:top-6">
        <div className="pointer-events-auto w-56 rounded-lg border border-border bg-background/85 p-4 shadow-xl shadow-black/50 backdrop-blur-md md:w-72 md:p-5">
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            The Chain
          </div>

          <dl className="space-y-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Distance Covered
              </dt>
              <dd className="mt-1 font-serif text-3xl text-foreground">
                675
                <span className="ml-1 text-base text-muted-foreground">km</span>
              </dd>
            </div>
            <div className="h-px w-full bg-border" aria-hidden />
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                People Needed
              </dt>
              <dd className="mt-1 font-serif text-3xl text-foreground">
                2,000,000
              </dd>
            </div>
          </dl>

          {origin && (
            <div className="mt-4 border-t border-border pt-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                From
              </p>
              <p className="mt-1 truncate text-sm text-foreground">
                {origin.name}
                <span className="text-muted-foreground">, {origin.country}</span>
              </p>

              {loading && (
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  Tracing a 675km route…
                </p>
              )}

              {route && !loading && (
                <>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Reaches
                  </p>
                  <p className="mt-1 truncate text-sm text-foreground">
                    {route.target.name}
                    <span className="text-muted-foreground">
                      , {route.target.country}
                    </span>
                  </p>
                  <p className="mt-1 font-mono text-xs text-primary">
                    {route.distanceKm.toFixed(0)} km by road
                  </p>
                </>
              )}

              {error && (
                <p className="mt-3 text-xs text-destructive-foreground/80">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-3 rounded-md border border-border bg-background/80 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-6 bg-primary" /> Human chain
        </span>
      </div>

      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 p-8 text-center">
          <div className="max-w-md">
            <h3 className="font-serif text-2xl">Map preview unavailable</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Set the{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                NEXT_PUBLIC_MAPBOX_TOKEN
              </code>{" "}
              environment variable to render the interactive map.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
