import { Sparkle } from "lucide-react";

/**
 * Endloses Laufband mit Angebotsnamen. Der Inhalt steht zweimal hintereinander
 * und wird um die Hälfte verschoben, so entsteht eine nahtlose Schleife. Beim
 * Hover hält das Band an, bei reduzierter Bewegung steht es still.
 */
const Marquee = ({ items }: { items: string[] }) => {
  if (!items.length) return <div className="h-[72px] bg-[var(--md-ink)]" />;
  const row = (hidden: boolean) => (
    <ul className="flex flex-none items-center gap-8 pe-8" aria-hidden={hidden}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex flex-none items-center gap-8 whitespace-nowrap">
          <span>{item}</span>
          <Sparkle className="h-4 w-4 flex-none fill-[var(--md-sun)] text-[var(--md-sun)]" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="md-marquee group relative overflow-hidden bg-[var(--md-ink)] py-6 text-[22px] font-bold tracking-tight text-white md:text-[26px]" style={{ fontFamily: "var(--md-font-display)" }}>
      <div className="md-marquee-track flex w-max group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-24 bg-gradient-to-r from-[var(--md-ink)] to-transparent rtl:bg-gradient-to-l" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 end-0 w-24 bg-gradient-to-l from-[var(--md-ink)] to-transparent rtl:bg-gradient-to-r" />
    </div>
  );
};

export default Marquee;
