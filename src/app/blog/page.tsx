import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import Navbar from "@/components/ui/navbar/Navbar";
import Footer from "@/components/ui/footer/Footer";

export const metadata = {
    title: "Blog de IA y Automatización",
    description: "Insights, estrategias y arquitectura cloud para dominar la inteligencia artificial en tu empresa.",
};

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <main className="relative min-h-screen bg-[#050505]">
            <Navbar />

            {/* Header Ambient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-brand-primary/10 blur-[150px] rounded-[100%] pointer-events-none -z-10"></div>

            <section className="pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto relative z-10 w-full min-h-[80vh]">
                <div className="mb-16 md:mb-24 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-md">
                        Insights de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-primary">Estrategia GTM & IA</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Análisis profundos sobre soberanía tecnológica, agentes autónomos y reducción de costos operativos mediante IA In-House.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col h-full bg-black/40 border border-white/5 p-6 rounded-3xl hover:bg-black/60 hover:border-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
                                <article className="flex flex-col h-full">
                                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors">{post.title}</h2>
                                    <p className="text-gray-400 mb-6 flex-grow">{post.summary}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            {new Date(post.publishedAt).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-brand-primary font-bold bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
                                            {post.readTime}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-20 text-gray-500">
                            Aún no hay artículos publicados. ¡Vuelve pronto!
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
