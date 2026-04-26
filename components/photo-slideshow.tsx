"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Slide = {
  src: string
  alt: string
  caption: string
  credit: string
  href: string
}

// Copyright-cleared photographs from Wikimedia Commons. Special:FilePath is
// the stable, redirect-based URL that always resolves to the current image,
// so we don't have to hardcode hash-based upload paths.
const SLIDES: Slide[] = [
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Baltic_Way_in_Latvia_between_C%C4%93sis_and_Valmiera.jpeg?width=1000",
    alt: "Baltic Way participants standing along the road between Cēsis and Valmiera, Latvia, 23 August 1989.",
    caption: "Between Cēsis and Valmiera, Latvia",
    credit: "Laimonis Stīpnieks · CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Baltic_Way_in_Latvia_between_C%C4%93sis_and_Valmiera.jpeg",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Baltic_Way_in_Moteris_magazine.jpeg?width=1000",
    alt: "Participants of the Baltic Way holding candles and Lithuanian flags with black mourning ribbons.",
    caption: "Candles and flags, Vilnius, 1989",
    credit: "L. Vasauskas · CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Baltic_Way_in_Moteris_magazine.jpeg",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/A_segment_of_the_Baltic_Way_at_the_Green_Bridge_in_Vilnius.jpg/960px-A_segment_of_the_Baltic_Way_at_the_Green_Bridge_in_Vilnius.jpg",
    alt: "A segment of the human chain crossing the Green Bridge in Vilnius, Lithuania.",
    caption: "The Green Bridge, Vilnius",
    credit: "Wikimedia Commons · CC BY-SA",
    href: "https://commons.wikimedia.org/wiki/File:A_segment_of_the_Baltic_Way_at_the_Green_Bridge_in_Vilnius.jpg",
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Baltic_Way_(Mol%C4%97tai_Region,_Lithuania).jpg?width=1000",
    alt: "Baltic Way participants stretched along the Vilnius–Ukmergė motorway in the Molėtai Region, Lithuania.",
    caption: "Vilnius–Ukmergė motorway, Lithuania",
    credit: "Saulius Gruodis · CC BY 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Baltic_Way_(Mol%C4%97tai_Region,_Lithuania).jpg",
  },
]

export function PhotoSlideshow() {
  const [index, setIndex] = useState(0)
  const total = SLIDES.length
  const slide = SLIDES[index]

  // Auto-advance every 6 seconds; pause if the user has interacted recently.
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total)
    }, 6000)
    return () => window.clearInterval(id)
  }, [paused, total])

  function go(delta: number) {
    setPaused(true)
    setIndex((i) => (i + delta + total) % total)
  }

  function jump(i: number) {
    setPaused(true)
    setIndex(i)
  }

  return (
    <figure
      className="group relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40"
      aria-roledescription="carousel"
      aria-label="Photographs of the Baltic Way human chain, 23 August 1989"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative aspect-[4/3] w-full cursor-pointer bg-muted"
        onClick={() => go(1)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            go(1)
          } else if (e.key === "ArrowLeft") {
            e.preventDefault()
            go(-1)
          }
        }}
        aria-label="Next photograph"
      >
        {SLIDES.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Bottom gradient for caption legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />

        {/* Caption */}
        <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-left md:p-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
            23 August 1989
          </span>
          <span className="font-serif text-base leading-snug text-white md:text-lg">
            {slide.caption}
          </span>
          <a
            href={slide.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 w-fit font-mono text-[10px] uppercase tracking-widest text-white/70 hover:text-primary"
          >
            {slide.credit}
          </a>
        </figcaption>

        {/* Prev / Next controls */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            go(-1)
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/60 group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            go(1)
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/60 group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Next photograph"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Counter */}
        <div className="absolute right-3 top-3 rounded-md border border-white/15 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80 backdrop-blur">
          {index + 1} / {total}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 border-t border-border bg-card/60 px-4 py-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => jump(i)}
            aria-label={`Go to photograph ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70",
            )}
          />
        ))}
      </div>
    </figure>
  )
}
