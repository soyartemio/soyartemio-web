import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/blog');
const outputPath = path.join(process.cwd(), 'src/lib/blog-data.json');

function generateBlogData() {
    if (!fs.existsSync(contentDirectory)) {
        console.warn(`[Blog Generator] Directory not found: ${contentDirectory}`);
        return;
    }

    const files = fs.readdirSync(contentDirectory);

    const posts = files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const fullPath = path.join(contentDirectory, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            const slug = file.replace(/\.mdx$/, '');

            return {
                metadata: {
                    title: data.title,
                    publishedAt: data.publishedAt,
                    summary: data.summary,
                    slug,
                    readTime: data.readTime || '5 min read',
                },
                content,
            };
        })
        .sort((a, b) => (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1));

    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf8');
    console.log(`[Blog Generator] Successfully generated data for ${posts.length} posts.`);
}

generateBlogData();
