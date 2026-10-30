import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatDate, sortedPosts, SITE_URL, type BlogPost } from "@/content/blog/posts";
import { usePageMeta } from "@/hooks/usePageMeta";

const Meta = ({ post }: { post: BlogPost }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
    <span className="flex items-center gap-1.5 !text-[14px]">
      <Calendar className="w-4 h-4" />
      <time dateTime={post.date} style={{ font: "inherit" }}>
        {formatDate(post.date)}
      </time>
    </span>
    <span className="flex items-center gap-1.5 !text-[14px]">
      <Clock className="w-4 h-4" />
      {post.readTime}
    </span>
  </div>
);

const Blog = () => {
  const posts = sortedPosts();
  const [featured, ...rest] = posts;

  usePageMeta({
    title: "Blog | MehrDrin",
    description:
      "Hintergründe zu Sozialleistungen, Förderungen und sozialer Teilhabe in Berlin. Analysen und Erklärtexte vom Team MehrDrin.",
    canonical: `${SITE_URL}/blog`,
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mb-12 md:mb-16">
          <h1 className="!text-[40px] md:!text-[60px] font-black leading-[1.05] mb-5">Blog</h1>
          <p className="!text-[19px] md:!text-[21px] text-muted-foreground leading-relaxed">
            Hintergründe zu Sozialleistungen, Förderungen und sozialer Teilhabe in Berlin.
          </p>
        </div>

        {featured && (
          <Link
            to={`/blog/${featured.slug}`}
            className="group block rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 mb-14"
          >
            <div className="grid lg:grid-cols-[1fr_1.3fr]">
              <div className="bg-[#1a2b45] text-white p-8 md:p-12 flex flex-col justify-between min-h-[220px]">
                <span className="self-start bg-white/15 px-3 py-1 rounded-full !text-[14px] font-medium">
                  Neuester Artikel
                </span>
                <div className="mt-10">
                  <div className="!text-[14px] uppercase tracking-wider text-white/60 mb-2">{featured.category}</div>
                  {featured.highlight && (
                    <>
                      <div className="!text-[64px] md:!text-[88px] font-black leading-none tabular-nums">
                        {featured.highlight.value}
                        <span className="!text-[36px] md:!text-[48px] ml-1" style={{ fontFamily: "inherit", fontWeight: 900 }}>
                          %
                        </span>
                      </div>
                      <div className="!text-[15px] text-white/75 mt-2 max-w-xs">{featured.highlight.label}</div>
                    </>
                  )}
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                <Meta post={featured} />
                <h2 className="!text-[30px] md:!text-[40px] font-bold leading-tight mt-4 mb-4 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="!text-[17px] md:!text-[18px] text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 font-semibold text-primary !text-[17px]">
                  Artikel lesen
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <section>
            <h2 className="!text-[26px] font-bold mb-8">Weitere Artikel</h2>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="inline-block bg-primary/10 text-primary px-2.5 py-0.5 rounded-full !text-[13px] font-medium mb-4">
                    {post.category}
                  </span>
                  <h3 className="!text-[22px] font-bold leading-snug mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="!text-[16px] text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                  <Meta post={post} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
