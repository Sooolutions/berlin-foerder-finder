/**
 * Erzeugt die Vorschaubilder (Open Graph, 1200 × 630) für Link-Vorschauen in
 * WhatsApp, Signal, Telegram, Facebook und Co.
 *
 *   npm run og
 *
 * Ergebnis: public/og/start.png, public/og/hilfe.png, public/og/blog.png und
 * je Themenseite public/og/<slug>.png. Die PNGs werden eingecheckt. Vercel
 * muss beim Build also nichts rendern. Nach einer neuen Themenseite oder einer
 * geänderten Überschrift einfach erneut ausführen und die Bilder committen.
 *
 * Schriften: feste Schnitte aus Bricolage Grotesque und Outfit (SIL Open Font
 * License) in scripts/og-fonts, umbenannt in „OG Display“ und „OG Text“, damit
 * sie eindeutig gefunden werden.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { THEMEN } from "../src/content/hilfe/themen";

const OUT = join(process.cwd(), "public", "og");
const FONTS = join(process.cwd(), "scripts", "og-fonts");

const C = {
  paper: "#f7f2ea",
  surface: "#fffdf9",
  ink: "#14162b",
  ink3: "#5b5d70",
  brand: "#2f5bea",
  brandTint: "#e8edff",
  sun: "#ffc23d",
  line: "#dbd1c1",
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Grober Zeilenumbruch über eine mittlere Zeichenbreite. Reicht für kurze Überschriften. */
const wrap = (text: string, size: number, maxWidth: number, factor: number) => {
  const maxChars = Math.floor(maxWidth / (size * factor));
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
};

/** Überschrift so groß wie möglich, höchstens drei Zeilen */
const fitHeadline = (text: string, maxWidth: number) => {
  // Große Schrift nur bis zwei Zeilen, sonst stößt die Unterzeile an die Fußzeile
  for (const [size, maxLines] of [[96, 2], [84, 2], [80, 3], [70, 3], [60, 3]]) {
    const lines = wrap(text, size, maxWidth, 0.47);
    if (lines.length <= maxLines) return { size, lines };
  }
  return { size: 54, lines: wrap(text, 54, maxWidth, 0.47) };
};

/** Gefächerter Kartenstapel rechts, wie auf der Startseite */
const cards = (labels: string[]) => {
  const colors = [
    { bg: "#fffdf9", border: "#dbd1c1", dot: C.brand },
    { bg: "#fff6dc", border: "#f3dd9c", dot: "#d99a00" },
    { bg: "#eef2ff", border: "#cdd7fb", dot: C.brand },
  ];
  const poses = [
    { x: 812, y: 300, r: -9 },
    { x: 846, y: 250, r: 5 },
    { x: 822, y: 214, r: -3 },
  ];
  // hinten zuerst zeichnen
  return [2, 1, 0]
    .map((i) => {
      const p = poses[i];
      const c = colors[i];
      const label = labels[i] ?? "";
      return `
      <g transform="translate(${p.x} ${p.y}) rotate(${p.r} 160 110)">
        <rect width="320" height="220" rx="28" fill="${c.bg}" stroke="${c.border}" stroke-width="2"/>
        <circle cx="38" cy="44" r="9" fill="${c.dot}"/>
        <rect x="32" y="150" width="190" height="12" rx="6" fill="${C.line}" opacity="0.7"/>
        <rect x="32" y="174" width="130" height="12" rx="6" fill="${C.line}" opacity="0.5"/>
        <text x="32" y="112" font-family="OG Text Bold" font-weight="700" font-size="30" fill="${C.ink}">${esc(label)}</text>
      </g>`;
    })
    .join("");
};

interface Card {
  file: string;
  kicker: string;
  headline: string;
  sub: string;
  stack: string[];
}

const svg = ({ kicker, headline, sub, stack }: Card) => {
  const left = 72;
  const textWidth = 720;
  const h = fitHeadline(headline, textWidth);
  const lineH = Math.round(h.size * 1.04);
  const top = 200;
  const headlineSvg = h.lines
    .map((l, i) => `<text x="${left}" y="${top + i * lineH}" font-family="OG Display" font-weight="800" font-size="${h.size}" letter-spacing="${-h.size * 0.035}" fill="${C.ink}">${esc(l)}</text>`)
    .join("");
  const underlineY = top + (h.lines.length - 1) * lineH + Math.round(h.size * 0.28);
  const subLines = wrap(sub, 32, textWidth, 0.45).slice(0, 2);
  const subTop = underlineY + 62;
  const subSvg = subLines
    .map((l, i) => `<text x="${left}" y="${subTop + i * 42}" font-family="OG Text" font-weight="500" font-size="32" fill="${C.ink3}">${esc(l)}</text>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glowA" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.brandTint}"/><stop offset="1" stop-color="${C.brandTint}" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowB" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.sun}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.sun}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${C.paper}"/>
  <circle cx="1080" cy="80" r="380" fill="url(#glowA)"/>
  <circle cx="120" cy="640" r="300" fill="url(#glowB)"/>

  <!-- Marke -->
  <g transform="translate(${left} 64)">
    <rect width="44" height="44" rx="12" fill="${C.ink}"/>
    <text x="22" y="31" text-anchor="middle" font-family="OG Display" font-weight="800" font-size="24" fill="${C.sun}">M</text>
    <text x="58" y="32" font-family="OG Display" font-weight="800" font-size="30" letter-spacing="-0.6" fill="${C.ink}">MehrDrin</text>
    <text x="214" y="31" font-family="OG Text" font-weight="500" font-size="22" fill="${C.ink3}">${esc(kicker)}</text>
  </g>

  ${cards(stack)}

  ${headlineSvg}
  <path d="M ${left + 4} ${underlineY} C ${left + 110} ${underlineY - 14}, ${left + 220} ${underlineY - 10}, ${left + 310} ${underlineY - 2} S ${left + 470} ${underlineY + 6}, ${left + 540} ${underlineY - 10}" fill="none" stroke="${C.sun}" stroke-width="11" stroke-linecap="round"/>
  ${subSvg}

  <!-- Fußzeile mit Vertrauenssignalen -->
  <g transform="translate(${left} 532)">
    <rect width="560" height="54" rx="27" fill="${C.ink}"/>
    <text x="28" y="35" font-family="OG Text Bold" font-weight="700" font-size="23" fill="#ffffff">kostenlos · anonym · nichts geht ans Amt</text>
  </g>
  <text x="1128" y="566" text-anchor="end" font-family="OG Text Bold" font-weight="700" font-size="24" fill="${C.brand}">mehrdrin-berlin.de</text>
</svg>`;
};

/** „Miete zu hoch? Diese Hilfen …“ → Überschrift bis zum Fragezeichen, Rest als Unterzeile */
const splitH1 = (h1: string): [string, string] => {
  const q = h1.indexOf("?");
  const c = h1.indexOf(":");
  const cut = [q, c].filter((i) => i > 0 && i < h1.length - 1).sort((a, b) => a - b)[0];
  if (cut === undefined) return [h1, "Was dir in Berlin zusteht und wo du es beantragst."];
  return h1[cut] === "?" ? [h1.slice(0, cut + 1), h1.slice(cut + 1).trim()] : [h1.slice(0, cut), h1.slice(cut + 1).trim()];
};

const STACKS: Record<string, string[]> = {
  "miete-zu-hoch": ["Wohngeld", "WBS", "Mietzuschuss"],
  "mietschulden-kuendigung": ["Soziale Wohnhilfe", "Mietschulden", "Beratung"],
  "klassenfahrt-schulsachen": ["Klassenfahrt", "Schulessen", "Nachhilfe"],
  kinderzuschlag: ["Kinderzuschlag", "Bildungspaket", "Wohngeld"],
  "wenig-geld-trotz-arbeit": ["Wohngeld", "Kinderzuschlag", "Aufstocken"],
  schulden: ["Schuldnerberatung", "kostenlos", "vertraulich"],
  "berlinpass-berlin-ticket-s": ["Berlin-Ticket S", "Ermäßigung", "berlinpass-BuT"],
  "rente-reicht-nicht": ["Grundsicherung", "Wohngeld", "Berlin-Ticket S"],
  "ausbildung-studium-geld": ["BAföG", "BAB", "Wohngeld"],
};

const jobs: Card[] = [
  {
    file: "start",
    kicker: "für Berlin",
    headline: "Steht dir Geld zu? Prüf es in 3 Minuten.",
    sub: "Wohngeld, Kinderzuschlag, Klassenfahrt und mehr.",
    stack: ["Wohngeld", "Kinderzuschlag", "Klassenfahrt"],
  },
  {
    file: "hilfe",
    kicker: "Hilfe nach Thema",
    headline: "Wobei brauchst du Hilfe?",
    sub: "Miete, Kinder, Schulden, Rente. Die passenden Hilfen in Berlin.",
    stack: ["Miete", "Kinder", "Schulden"],
  },
  {
    file: "blog",
    kicker: "Blog",
    headline: "Hintergründe zu Hilfen in Berlin",
    sub: "Analysen und Erklärtexte vom Team MehrDrin.",
    stack: ["Analyse", "Erklärt", "Berlin"],
  },
  ...THEMEN.map((t) => {
    const [headline, sub] = splitH1(t.h1);
    return { file: t.slug, kicker: "Hilfe in Berlin", headline, sub, stack: STACKS[t.slug] ?? [t.kurz, "Berlin", "Hilfe"] };
  }),
];

mkdirSync(OUT, { recursive: true });
for (const job of jobs) {
  const resvg = new Resvg(svg(job), {
    fitTo: { mode: "width", value: 1200 },
    font: {
      loadSystemFonts: false,
      fontFiles: ["BricolageGrotesque-ExtraBold.ttf", "Outfit-Medium.ttf", "Outfit-Bold.ttf"].map((f) => join(FONTS, f)),
      defaultFontFamily: "OG Text",
    },
  });
  writeFileSync(join(OUT, `${job.file}.png`), resvg.render().asPng());
  console.log("og:", `${job.file}.png`);
}
