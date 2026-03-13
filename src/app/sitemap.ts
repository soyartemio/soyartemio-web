import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `https://soyartemio.com/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        {
            url: 'https://soyartemio.com',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://soyartemio.com/blog',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...blogRoutes,
    ];
}
