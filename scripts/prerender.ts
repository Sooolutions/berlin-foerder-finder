/**
 * Läuft nach `vite build` und erzeugt für jeden Blogartikel eine eigene,
 * vollständig vorgerenderte HTML-Datei:
 *
 *   dist/blog/index.html                 → /blog
 *   dist/blog/<slug>/index.html          → /blog/<slug>
 *   dist/sitemap.xml
 *
 * Jede Datei enthält eigenen <title>, Meta-Description, Canonical-URL,
 * Open-Graph-Tags, strukturierte Daten (JSON-LD) und den kompletten
 * Artikeltext als HTML. Suchmaschinen und Link-Vorschauen sehen den Inhalt
 * damit ohne JavaScript. Im Browser übernimmt danach wie gewohnt React.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { blogPosts, formatDate, SITE_URL, sortedPosts, type Block, type BlogPost } from "../src/content/blog/posts";

const DIST = join(process.cwd(), "dist");
const template = readFileSync(join(DIST, "index.html"), "utf8");

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const richText = (t: string) =>
  esc(t).replace(/\[\^(\d+)\]/g, (_, n) => `<sup id="fnref-${n}"><a href="#fn-${n}">${n}</a></sup>`);

const pct = (v: number) => `${v} %`;

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
    <p><a href="/questionnaire">Welche Angebote stehen dir zu? Jetzt in 10 Fragen herausfinden.</a></p>
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

// Schlichte Lesbarkeit, solange React noch nicht geladen ist
const PRERENDER_STYLE = `<style>.prerender{max-width:720px;margin:0 auto;padding:40px 16px;font-family:Outfit,system-ui,sans-serif;line-height:1.7}.prerender h1{font-size:40px;line-height:1.1}.prerender h2{font-size:28px;margin-top:2em}.prerender table{border-collapse:collapse}.prerender th,.prerender td{padding:4px 10px;text-align:left}</style>`;

interface PageOpts {
  path: string;
  title: string;
  description: string;
  type: "website" | "article";
  body: string;
  jsonLd: object;
  extraHead?: string;
}

const render = ({ path, title, description, type, body, jsonLd, extraHead = "" }: PageOpts) => {
  const url = `${SITE_URL}${path}`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`);

  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="MehrDrin" />`,
    `<meta property="og:locale" content="de_DE" />`,
    extraHead,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
    PRERENDER_STYLE,
  ].join("\n    ");
  html = html.replace("</head>", `    ${head}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const file = join(DIST, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("prerender:", path);
};

// /blog
render({
  path: "/blog",
  title: "Blog | MehrDrin",
  description:
    "Hintergründe zu Sozialleistungen, Förderungen und sozialer Teilhabe in Berlin. Analysen und Erklärtexte vom Team MehrDrin.",
  type: "website",
  body: listHtml(),
  jsonLd: {
    "@context": "https://schema.org",
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
    extraHead: [
      `<meta property="article:published_time" content="${post.date}" />`,
      `<meta property="article:section" content="${esc(post.category)}" />`,
      `<meta name="keywords" content="${esc(post.keywords.join(", "))}" />`,
    ].join("\n    "),
    jsonLd: {
      "@context": "https://schema.org",
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
          author: { "@type": "Organization", name: "MehrDrin", url: SITE_URL },
          publisher: { "@type": "Organization", name: "MehrDrin", url: SITE_URL },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
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
const urls: { loc: string; lastmod?: string }[] = [
  { loc: "/" },
  { loc: "/questionnaire" },
  { loc: "/blog", lastmod: latest },
  ...sortedPosts().map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.date })),
  { loc: "/about" },
  { loc: "/impressum" },
  { loc: "/datenschutz" },
];
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url><loc>${SITE_URL}${u.loc === "/" ? "/" : u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
      .join("\n") +
    `\n</urlset>\n`,
);
console.log("prerender: sitemap.xml mit", urls.length, "URLs");
