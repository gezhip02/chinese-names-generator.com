// app/blog/page.tsx
import BlogPageClient from './BlogPageClient';
import { getSortedPostsData } from '@/lib/posts';

export default async function BlogPage() {
  const posts = await getSortedPostsData();
  return <BlogPageClient initialPosts={posts} />;
}