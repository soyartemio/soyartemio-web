import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { marked } from "marked";
import Navbar from "@/components/ui/navbar/Navbar";
import Footer from "@/components/ui/footer/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    try {
        const post = getPostBySlug(resolvedParams.slug);
        return {
            title: post.metadata.title,
            description: post.metadata.summary,
            openGraph: {
                title: post.metadata.title,
                description: post.metadata.summary,
                type: "article",
                publishedTime: post.metadata.publishedAt,
            },
        };
    } catch {
        return {};
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    let post;
    try {
        post = getPostBySlug(resolvedParams.slug);
    } catch {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.metadata.title,
        "description": post.metadata.summary,
        "datePublished": post.metadata.publishedAt,
        "author": {
            "@type": "Person",
            "name": "Artemio",
            "url": "https://soyartemio.com"
        }
    };

    return (
        <main className="relative min-h-screen bg-[#050505]">
            <Navbar />

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-cyan/10 blur-[150px] rounded-[100%] pointer-events-none -z-10"></div>

            <article className="pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto relative z-10 w-full min-h-[80vh]">
                
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al Blog
                </Link>

                <header className="mb-14">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-md">
                        {post.metadata.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-400">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
                            {new Date(post.metadata.publishedAt).toLocaleDateString("es-ES", {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                        <span className="text-white/20">•</span>
                        <span>{post.metadata.readTime}</span>
                    </div>
                </header>

                <div className="prose prose-invert prose-lg max-w-none 
                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight 
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-brand-cyan prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white
                    prose-ul:list-disc prose-ul:text-gray-300 prose-ul:my-6
                    prose-ol:list-decimal prose-ol:text-gray-300
                    prose-li:my-2
                    prose-blockquote:border-l-4 prose-blockquote:border-brand-primary prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-200 prose-blockquote:italic
                    prose-code:text-brand-accent prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:shadow-2xl backdrop-blur-md">
                    <div dangerouslySetInnerHTML={{ __html: await marked(post.content) }} />
                </div>

                {/* Footer del Artículo - CTA */}
                <div className="mt-24 pt-12 border-t border-white/10 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">¿Listo para escalar sin SaaS obsoletos?</h3>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Agenda una sesión conmigo y evaluemos cómo una arquitectura IA In-House puede recuperar tu operatividad.
                    </p>
                    <a
                        href="https://calendly.com/soyartemio/30min"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-brand-cyan text-black font-bold text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
                    >
                        Auditoría Gratuita de Arquitectura
                    </a>
                </div>

            </article>

            <Footer />
        </main>
    );
}
