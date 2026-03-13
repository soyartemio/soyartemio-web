import blogData from "./blog-data.json";

export type BlogPostMetadata = {
    title: string;
    publishedAt: string;
    summary: string;
    slug: string;
    readTime?: string;
};

export type BlogPost = {
    metadata: BlogPostMetadata;
    content: string;
};

export function getPostBySlug(slug: string): BlogPost {
    const realSlug = slug.replace(/\.mdx$/, "");
    const post = blogData.find(p => p.metadata.slug === realSlug);
    
    if (!post) {
        throw new Error(`Post not found: ${slug}`);
    }

    return post as BlogPost;
}

export function getAllPosts(): BlogPostMetadata[] {
    return blogData.map((post) => post.metadata);
}
