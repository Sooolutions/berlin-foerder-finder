import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import BlogFigure from "@/components/blog/BlogFigure";
import { formatDate, getPostBySlug, SITE_URL } from "@/content/blog/posts";
import { usePageMeta } from "@/hooks/usePageMeta";
import NotFound from "./NotFound";

/** Fließtext mit Fußnotenmarkern [^n] als hochgestellte Links */
const RichText = ({ text }: { text: string }) => {
  const parts = text.split(/\[\^(\d+)\]/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <sup key={i} id={`fnref-${part}`} className="ml-[1px]">
            <a
              href={`#fn-${part}`}
              className="!text-[12px] font-semibold text-primary no-underline hover:underline"
              aria-label={`Fußnote ${part}`}
            >
              {part}
            </a>
          </sup>
        ) : (
          <span key={i} style={{ font: "inherit" }}>
            {part}
          </span>
        ),
      )}
    </>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  usePageMeta({
    title: post ? `${post.title} | MehrDrin Blog` : "Artikel nicht gefunden | MehrDrin",
    description: post?.description,
    canonical: post ? `${SITE_URL}/blog/${post.slug}` : undefined,
  });

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow px-4">
        <article className="mx-auto max-w-[720px] pt-10 md:pt-16 pb-20">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 !text-[15px] text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Alle Artikel
          </Link>

          <header className="mb-10">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full !text-[14px] font-medium mb-5">
              {post.category}
            </span>
            <h1 className="!text-[36px] md:!text-[52px] font-black leading-[1.08] tracking-tight mb-6">{post.title}</h1>
            <p className="!text-[19px] md:!text-[21px] text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground">
              <span className="!text-[15px]">{post.author}</span>
              <span className="flex items-center gap-1.5 !text-[15px]">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date} style={{ font: "inherit" }}>
                  {formatDate(post.date)}
                </time>
              </span>
              <span className="flex items-center gap-1.5 !text-[15px]">
                <Clock className="w-4 h-4" />
                {post.readTime} Lesezeit
              </span>
            </div>
          </header>

          <div className="text-[18px] md:text-[19px] leading-[1.75] text-foreground/90">
            {post.blocks.map((b, i) => {
              if (b.type === "h2")
                return (
                  <h2 key={i} className="!text-[26px] md:!text-[32px] font-bold leading-tight mt-14 mb-5 text-foreground">
                    {b.text}
                  </h2>
                );
              if (b.type === "figure") return <BlogFigure key={i} block={b} />;
              return (
                <p key={i} className="!text-[18px] md:!text-[19px] !leading-[1.75] mb-6">
                  <RichText text={b.text} />
                </p>
              );
            })}
          </div>

          {/* Call to action */}
          <aside className="mt-14 rounded-2xl bg-secondary p-6 md:p-8">
            <div className="!text-[22px] md:!text-[26px] font-bold leading-snug mb-2">
              Welche Angebote stehen dir zu?
            </div>
            <p className="!text-[17px] text-foreground/80 mb-5">
              Beantworte 10 kurze Fragen und sieh, welche Unterstützung es in Berlin für deine Lebenssituation gibt.
            </p>
            <Button asChild size="lg" className="rounded-full !text-[17px] px-7 py-6">
              <Link to="/questionnaire">
                Jetzt herausfinden <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </aside>

          {/* Fußnoten und Quellen */}
          <section className="mt-14 border-t border-border pt-8">
            <h2 className="!text-[20px] font-bold mb-4">Anmerkungen</h2>
            <ol className="space-y-1.5 list-decimal pl-6 marker:text-muted-foreground">
              {post.footnotes.map((fn, i) => (
                <li key={i} id={`fn-${i + 1}`} className="!text-[15px] text-muted-foreground scroll-mt-24">
                  {fn}{" "}
                  <a href={`#fnref-${i + 1}`} className="!text-[14px] text-primary hover:underline" aria-label="Zurück zum Text">
                    ↩
                  </a>
                </li>
              ))}
            </ol>

            <h2 className="!text-[20px] font-bold mt-10 mb-4">Quellen</h2>
            <ul className="space-y-3">
              {post.sources.map((s) => (
                <li key={s.text} className="!text-[15px] text-muted-foreground leading-relaxed">
                  {s.text}{" "}
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="!text-[15px] text-primary hover:underline break-all">
                      {s.url.replace("https://", "")}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
