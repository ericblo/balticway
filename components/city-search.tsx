"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MapPin, Search } from "lucide-react"
import { CITIES, type City } from "@/lib/cities"
import { cn } from "@/lib/utils"

type Props = {
  onSelect: (city: City) => void
  selected: City | null
}

export function CitySearch({ onSelect, selected }: Props) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Keep query in sync when a city is selected externally (e.g. on first load)
  useEffect(() => {
    if (selected) setQuery(`${selected.name}, ${selected.country}`)
  }, [selected])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CITIES.slice(0, 8)
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    ).slice(0, 8)
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function handleSelect(city: City) {
    onSelect(city)
    setQuery(`${city.name}, ${city.country}`)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) setOpen(true)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const city = results[activeIndex]
      if (city) handleSelect(city)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        htmlFor="city-search"
        className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
      >
        Start your chain
      </label>

      <div className="group relative flex items-center rounded-lg border border-border bg-card/70 backdrop-blur transition-colors focus-within:border-primary/60">
        <Search
          className="ml-4 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <input
          id="city-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={(e) => {
            setOpen(true)
            // Select all so the user can immediately type a new city
            // without having to manually clear the previously chosen one.
            e.currentTarget.select()
          }}
          onClick={(e) => {
            // Some browsers (notably mobile Safari) clear the selection on
            // click after focus; re-select on click to keep the behavior.
            e.currentTarget.select()
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a city, e.g. Tallinn, Berlin, New York..."
          className="w-full bg-transparent px-3 py-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="city-search-listbox"
          role="combobox"
        />
      </div>

      {open && results.length > 0 && (
        <ul
          id="city-search-listbox"
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-border bg-popover/95 shadow-2xl shadow-black/40 backdrop-blur"
        >
          {results.map((city, i) => {
            const isActive = i === activeIndex
            return (
              <li
                key={`${city.name}-${city.country}`}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  // mousedown fires before blur; avoid closing first
                  e.preventDefault()
                  handleSelect(city)
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60",
                )}
              >
                <MapPin
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="text-foreground">{city.name}</span>
                <span className="ml-auto font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {city.country}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
