import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogSection() {
    const posts = getAllPosts().slice(0, 3); // Solo mostrar últimos 3

    if (posts.length === 0) return null;

    return (
        <section id="blog" className="relative py-24 px-4 w-full overflow-hidden bg-gradient-to-b from-[#050505] to-[#0a0a0c]">
            <div className="max-w-6xl mx-auto z-10 relative">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
                            Insights de <span className="text-brand-cyan">Estrategia</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Reflexiones sobre IA in-house, automatización y soberanía tecnológica para empresas.
                        </p>
                    </div>
                    <Link href="/blog" className="shrink-0 inline-flex items-center gap-2 text-brand-cyan font-bold hover:text-white transition-colors group">
                        Ver todos los artículos
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col h-full bg-black/40 border border-white/5 p-6 md:p-8 rounded-3xl hover:bg-black/60 hover:border-white/10 transition-all duration-300 shadow-lg backdrop-blur-sm">
                            <article className="flex flex-col h-full">
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 mb-6 flex-grow line-clamp-3 text-sm leading-relaxed">
                                    {post.summary}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        {new Date(post.publishedAt).toLocaleDateString("es-ES", {
                                            month: "short", day: "numeric", year: "numeric"
                                        })}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-cyan/20 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-cyan" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
