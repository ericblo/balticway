export function IntroSection() {
  return (
    <header className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]" aria-hidden>
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary blur-3xl" />
        <div className="absolute top-20 right-10 h-80 w-80 rounded-full bg-primary blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-16 md:py-24">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-primary" aria-hidden />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            23 August 1989
          </p>
        </div>

        <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-balance md:text-7xl">
          The Baltic Way
        </h1>

        <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          On a late summer evening, nearly{" "}
          <span className="text-foreground">two million people</span> joined
          hands to form an unbroken human chain stretching{" "}
          <span className="text-foreground">675 kilometers</span> across
          Estonia, Latvia, and Lithuania. It was a peaceful protest against
          Soviet occupation — and a quiet, defiant act of hope. Choose a city
          below to see how far that chain would reach from your own streets.
        </p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span>
            <span className="text-primary">675</span> km
          </span>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span>
            <span className="text-primary">2,000,000</span> people
          </span>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span>
            <span className="text-primary">3</span> nations
          </span>
        </div>
      </div>
    </header>
  )
}
