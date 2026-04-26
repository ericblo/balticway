"use client"

import { useState } from "react"
import { IntroSection } from "@/components/intro-section"
import { CitySearch } from "@/components/city-search"
import { BalticMap } from "@/components/baltic-map"
import { CITIES, type City } from "@/lib/cities"

export default function Page() {
  // Default to Tallinn — the historical northern endpoint of the chain.
  const [origin, setOrigin] = useState<City | null>(
    CITIES.find((c) => c.name === "Tallinn") ?? null,
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <IntroSection />

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <CitySearch onSelect={setOrigin} selected={origin} />
          <p className="mt-3 text-xs text-muted-foreground">
            Pick any city — we&apos;ll draw a ~675km road route from there, the length of the Baltic Way.
          </p>
        </div>

        <div className="mt-10">
          <BalticMap origin={origin} />
        </div>

        <footer className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <p className="font-mono uppercase tracking-widest">
            In memory of 23 August 1989
          </p>
          <p>
            Road routing by Mapbox Directions API. Distances are approximate.
          </p>
        </footer>
      </section>
    </main>
  )
}
