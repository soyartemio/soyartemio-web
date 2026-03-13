import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src/content/blog");

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
    const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        metadata: {
            title: data.title,
            publishedAt: data.publishedAt,
            summary: data.summary,
            slug: realSlug,
            readTime: data.readTime || "5 min read",
        },
        content,
    };
}

export function getAllPosts(): BlogPostMetadata[] {
    const files = fs.readdirSync(contentDirectory);

    const posts = files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
            const post = getPostBySlug(file);
            return post.metadata;
        })
        .sort((a, b) => (new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1));

    return posts;
}
