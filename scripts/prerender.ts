/**
 * Läuft nach `vite build` und erzeugt vollständig vorgerenderte HTML-Dateien
 * für alle Inhaltsseiten:
 *
 *   dist/index.html                      → /             Startseite
 *   dist/app.html                        → alle übrigen App-Routen (leere Hülle)
 *   dist/hilfe/index.html                → /hilfe        Themenübersicht
 *   dist/hilfe/<slug>/index.html         → /hilfe/<slug> Themenseiten
 *   dist/blog/index.html                 → /blog
 *   dist/blog/<slug>/index.html          → /blog/<slug>
 *   dist/sitemap.xml
 *
 * Jede Datei enthält eigenen <title>, Meta-Description, Canonical-URL,
 * Open-Graph-Tags mit Vorschaubild (public/og, erzeugt mit `npm run og`),
 * strukturierte Daten (JSON-LD) und den Seiteninhalt als HTML. Suchmaschinen,
 * KI-Suchen und Messenger-Vorschauen sehen den Inhalt damit ohne JavaScript.
 * Im Browser übernimmt danach wie gewohnt React.
 *
 * Warum app.html: Die Startseite enthält jetzt vorgerenderten Inhalt. Würde
 * der Fragebogen weiter auf index.html umgeleitet, blitzte kurz die Startseite
 * auf. vercel.json leitet deshalb alle übrigen Routen auf die leere Hülle.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { blogPosts, formatDate, SITE_URL, sortedPosts, type Block, type BlogPost } from "../src/content/blog/posts";
import { formatGeprueft, THEMEN, type Thema } from "../src/content/hilfe/themen";
import { HOME_FAQ, HOME_SUB, HOME_TITLE, HOME_TRUST } from "../src/content/home";

const DIST = join(process.cwd(), "dist");
const template = readFileSync(join(DIST, "index.html"), "utf8");

// Leere Hülle für Fragebogen, Ergebnisse und alle anderen Client-Routen
writeFileSync(join(DIST, "app.html"), template);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const richText = (t: string) =>
  esc(t).replace(/\[\^(\d+)\]/g, (_, n) => `<sup id="fnref-${n}"><a href="#fn-${n}">${n}</a></sup>`);

const pct = (v: number) => `${v} %`;

const ORG = { "@type": "Organization", name: "MehrDrin", url: SITE_URL, email: "info@mehrdrin-berlin.de" };

// ---------------------------------------------------------------- Blog

const figureHtml = (b: Extract<Block, { type: "figure" }>) => {
  const c = b.chart;
  let table = "";
  if (c.kind === "panels") {
    table =
      `<thead><tr><th></th>${c.groups.map((g) => `<th>${esc(g)}</th>`).join("")}</tr></thead><tbody>` +
      c.panels.map((p) => `<tr><th>${esc(p.label)}</th>${p.values.map((v) => `<td>${pct(v)}</td>`).join("")}</tr>`).join("") +
      "</tbody>";
  } else {
    const rows = c.kind === "shares" ? c.items.map((i) => [`${i.label} (${i.period})`, i.value]) : c.items.map((i) => [i.label, i.value]);
    table =
      `<thead><tr><th></th><th>Anteil</th></tr></thead><tbody>` +
      rows.map(([l, v]) => `<tr><th>${esc(String(l))}</th><td>${pct(Number(v))}</td></tr>`).join("") +
      "</tbody>";
  }
  return `<figure><figcaption><strong>Abbildung ${b.number}: ${esc(b.caption)}</strong><br>${esc(c.valueNote)}</figcaption><table>${table}</table><p><em>Quelle: ${esc(b.source)}</em></p></figure>`;
};

const articleHtml = (post: BlogPost) => `
<main class="prerender">
  <nav><a href="/">MehrDrin</a> › <a href="/blog">Blog</a></nav>
  <article>
    <p>${esc(post.category)} · <time datetime="${post.date}">${formatDate(post.date)}</time> · ${esc(post.readTime)} Lesezeit · ${esc(post.author)}</p>
    <h1>${esc(post.title)}</h1>
    <p><strong>${esc(post.excerpt)}</strong></p>
    ${post.blocks
      .map((b) => (b.type === "h2" ? `<h2>${esc(b.text)}</h2>` : b.type === "p" ? `<p>${richText(b.text)}</p>` : figureHtml(b)))
      .join("\n    ")}
    <p><a href="/questionnaire">Welche Angebote stehen dir zu? Jetzt in etwa 3 Minuten herausfinden.</a></p>
    <h2>Anmerkungen</h2>
    <ol>${post.footnotes.map((f, i) => `<li id="fn-${i + 1}">${esc(f)}</li>`).join("")}</ol>
    <h2>Quellen</h2>
    <ul>${post.sources.map((s) => `<li>${esc(s.text)}${s.url ? ` <a href="${esc(s.url)}">${esc(s.url)}</a>` : ""}</li>`).join("")}</ul>
  </article>
</main>`;

const listHtml = () => `
<main class="prerender">
  <h1>Blog</h1>
  <p>Hintergründe zu Sozialleistungen, Förderungen und sozialer Teilhabe in Berlin.</p>
  ${sortedPosts()
    .map(
      (p) =>
        `<article><h2><a href="/blog/${p.slug}">${esc(p.title)}</a></h2><p>${esc(p.excerpt)}</p><p><time datetime="${p.date}">${formatDate(p.date)}</time></p></article>`,
    )
    .join("\n  ")}
</main>`;

// ---------------------------------------------------------------- Start und Themen

const themenLinks = () =>
  `<ul>${THEMEN.map((t) => `<li><a href="/hilfe/${t.slug}">${esc(t.kurz)}</a></li>`).join("")}</ul>`;

const homeHtml = () => `
<main class="prerender">
  <h1>${esc(HOME_TITLE)}</h1>
  <p class="lead">${esc(HOME_SUB)}</p>
  <p><a class="cta" href="/questionnaire">Jetzt herausfinden</a></p>
  <ul class="trust">${HOME_TRUST.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  <h2>Wobei brauchst du Hilfe?</h2>
  ${themenLinks()}
  <h2>So funktioniert's</h2>
  <ol>
    <li>Ein paar kurze Fragen zu deiner Lebenssituation beantworten. Deine Antworten bleiben in deinem Browser.</li>
    <li>Passende Hilfen sehen, von Wohngeld über Familienhilfen bis zu Beratungsstellen.</li>
    <li>Direkt zur zuständigen Stelle oder zum offiziellen Antrag.</li>
  </ol>
  <h2>Häufige Fragen</h2>
  ${HOME_FAQ.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("\n  ")}
</main>`;

const themenIndexHtml = () => `
<main class="prerender">
  <nav><a href="/">MehrDrin</a> › Hilfe nach Thema</nav>
  <h1>Wobei brauchst du Hilfe?</h1>
  <p class="lead">Wähl dein Anliegen und sieh, welche Hilfen es in Berlin dafür gibt, mit Link zum offiziellen Rechner oder Antrag.</p>
  ${THEMEN.map((t) => `<article><h2><a href="/hilfe/${t.slug}">${esc(t.kurz)}</a></h2><p>${esc(t.description)}</p></article>`).join("\n  ")}
</main>`;

const themaHtml = (t: Thema) => `
<main class="prerender">
  <nav><a href="/">MehrDrin</a> › <a href="/hilfe">Hilfe nach Thema</a></nav>
  <article>
    <h1>${esc(t.h1)}</h1>
    <p class="lead">${esc(t.intro)}</p>
    <p><a class="cta" href="/questionnaire">Alle Hilfen in etwa 3 Minuten prüfen</a></p>
    <h2>Diese Hilfen kommen infrage</h2>
    ${t.hilfen
      .map(
        (h) => `<section>
      <h3>${esc(h.name)}</h3>
      <p>${esc(h.text)}</p>
      ${h.punkte ? `<ul>${h.punkte.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      ${h.wer ? `<p><strong>Für wen:</strong> ${esc(h.wer)}</p>` : ""}
      ${h.wo ? `<p><strong>Wo und wie:</strong> ${esc(h.wo)}</p>` : ""}
      ${h.links?.length ? `<ul>${h.links.map((l) => `<li><a href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>` : ""}
      ${h.siehe ? `<p><a href="/hilfe/${h.siehe}">Mehr dazu</a></p>` : ""}
    </section>`,
      )
      .join("\n    ")}
    <h2>Häufige Fragen</h2>
    ${t.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("\n    ")}
    <h2>Verwandte Themen</h2>
    <ul>${t.verwandt
      .map((s) => THEMEN.find((x) => x.slug === s))
      .filter(Boolean)
      .map((x) => `<li><a href="/hilfe/${x!.slug}">${esc(x!.kurz)}</a></li>`)
      .join("")}</ul>
    <p><small>Zuletzt geprüft im ${formatGeprueft(t.geprueft)}. Ob und in welcher Höhe du eine Leistung bekommst, entscheidet die zuständige Stelle.</small></p>
  </article>
</main>`;

const faqJsonLd = (faq: [string, string][]) => ({
  "@type": "FAQPage",
  mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

// ---------------------------------------------------------------- Rendern

// Schlichte Lesbarkeit, solange React noch nicht geladen ist
const PRERENDER_STYLE = `<style>.prerender{max-width:760px;margin:0 auto;padding:40px 18px;font-family:'Outfit Variable',Outfit,system-ui,sans-serif;line-height:1.65;color:#14162b}.prerender h1{font-size:clamp(34px,6vw,56px);line-height:1.05;letter-spacing:-.03em;margin:.4em 0}.prerender h2{font-size:26px;margin-top:2em}.prerender .lead{font-size:20px;color:#5b5d70}.prerender .cta{display:inline-block;background:#14162b;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600}.prerender a{color:#2f5bea}.prerender table{border-collapse:collapse}.prerender th,.prerender td{padding:4px 10px;text-align:left}</style>`;

interface PageOpts {
  path: string;
  title: string;
  description: string;
  type: "website" | "article";
  body: string;
  jsonLd: object;
  /** Pfad unter public/og, ohne Endung */
  image?: string;
  imageAlt?: string;
  extraHead?: string;
}

const ogImageUrl = (name: string) => {
  const file = existsSync(join(DIST, "og", `${name}.png`)) ? name : "start";
  return `${SITE_URL}/og/${file}.png`;
};

const setTag = (html: string, re: RegExp, tag: string) => (re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`));

const render = ({ path, title, description, type, body, jsonLd, image = "start", imageAlt, extraHead = "" }: PageOpts) => {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const img = ogImageUrl(image);
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  html = setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title.replace(/ \| MehrDrin.*$/, ""))}" />`);
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`);
  html = setTag(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`);
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
  html = setTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${img}" />`);
  html = setTag(html, /<meta property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${esc(imageAlt ?? title)}" />`);
  html = setTag(html, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${img}" />`);

  const head = [
    extraHead,
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...jsonLd }).replace(/</g, "\\u003c")}</script>`,
    PRERENDER_STYLE,
  ]
    .filter(Boolean)
    .join("\n    ");
  html = html.replace("</head>", `    ${head}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const file = path === "/" ? join(DIST, "index.html") : join(DIST, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("prerender:", path);
};

// /
render({
  path: "/",
  title: "Wohngeld, Kinderzuschlag und mehr: Prüf, was dir in Berlin zusteht | MehrDrin",
  description:
    "Prüf in etwa 3 Minuten, ob dir in Berlin Geld oder Hilfe zusteht, zum Beispiel Wohngeld, Kinderzuschlag oder Geld für die Klassenfahrt. Kostenlos, anonym, ohne Anmeldung. Nichts geht ans Amt.",
  type: "website",
  body: homeHtml(),
  image: "start",
  imageAlt: "MehrDrin: Steht dir in Berlin Geld zu? Prüf es in 3 Minuten.",
  jsonLd: {
    "@graph": [
      { ...ORG, description: "Kostenloser, anonymer Wegweiser zu Sozialleistungen, Förderungen und Beratung in Berlin.", areaServed: "Berlin" },
      { "@type": "WebSite", name: "MehrDrin", url: SITE_URL, inLanguage: "de-DE" },
      faqJsonLd(HOME_FAQ),
    ],
  },
});

// /hilfe
render({
  path: "/hilfe",
  title: "Hilfe nach Thema: Miete, Kinder, Schulden, Rente | MehrDrin",
  description:
    "Miete zu hoch, Geld für die Klassenfahrt, Schulden oder Rente reicht nicht? Finde nach deinem Anliegen die passenden Hilfen in Berlin und die offiziellen Rechner.",
  type: "website",
  body: themenIndexHtml(),
  image: "hilfe",
  jsonLd: {
    "@type": "CollectionPage",
    name: "Hilfe nach Thema",
    url: `${SITE_URL}/hilfe`,
    inLanguage: "de-DE",
    hasPart: THEMEN.map((t) => ({ "@type": "WebPage", name: t.h1, url: `${SITE_URL}/hilfe/${t.slug}` })),
  },
});

// /hilfe/<slug>
for (const t of THEMEN) {
  const url = `${SITE_URL}/hilfe/${t.slug}`;
  render({
    path: `/hilfe/${t.slug}`,
    title: t.title,
    description: t.description,
    type: "article",
    body: themaHtml(t),
    image: t.slug,
    imageAlt: t.h1,
    extraHead: `<meta name="keywords" content="${esc(t.keywords.join(", "))}" />`,
    jsonLd: {
      "@graph": [
        {
          "@type": "WebPage",
          name: t.h1,
          description: t.description,
          url,
          inLanguage: "de-DE",
          dateModified: t.geprueft,
          publisher: ORG,
        },
        faqJsonLd(t.faq),
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Hilfe nach Thema", item: `${SITE_URL}/hilfe` },
            { "@type": "ListItem", position: 3, name: t.kurz, item: url },
          ],
        },
      ],
    },
  });
}

// /blog
render({
  path: "/blog",
  title: "Blog | MehrDrin",
  description:
    "Hintergründe zu Sozialleistungen, Förderungen und sozialer Teilhabe in Berlin. Analysen und Erklärtexte vom Team MehrDrin.",
  type: "website",
  body: listHtml(),
  image: "blog",
  jsonLd: {
    "@type": "Blog",
    name: "MehrDrin Blog",
    url: `${SITE_URL}/blog`,
    inLanguage: "de-DE",
    blogPost: sortedPosts().map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE_URL}/blog/${p.slug}`, datePublished: p.date })),
  },
});

// /blog/<slug>
for (const post of blogPosts) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  render({
    path: `/blog/${post.slug}`,
    title: `${post.title} | MehrDrin Blog`,
    description: post.description,
    type: "article",
    body: articleHtml(post),
    image: "blog",
    extraHead: [
      `<meta property="article:published_time" content="${post.date}" />`,
      `<meta property="article:section" content="${esc(post.category)}" />`,
      `<meta name="keywords" content="${esc(post.keywords.join(", "))}" />`,
    ].join("\n    "),
    jsonLd: {
      "@graph": [
        {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          inLanguage: "de-DE",
          mainEntityOfPage: url,
          url,
          keywords: post.keywords.join(", "),
          author: ORG,
          publisher: ORG,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
          ],
        },
      ],
    },
  });
}

// sitemap.xml
const latest = sortedPosts()[0]?.date;
const latestThema = THEMEN.map((t) => t.geprueft).sort().at(-1);
const urls: { loc: string; lastmod?: string }[] = [
  { loc: "/" },
  { loc: "/questionnaire" },
  { loc: "/hilfe", lastmod: latestThema },
  ...THEMEN.map((t) => ({ loc: `/hilfe/${t.slug}`, lastmod: t.geprueft })),
  { loc: "/blog", lastmod: latest },
  ...sortedPosts().map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.date })),
  { loc: "/about" },
  { loc: "/impressum" },
  { loc: "/datenschutz" },
];
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n") +
    `\n</urlset>\n`,
);
console.log("prerender: sitemap.xml mit", urls.length, "URLs");
