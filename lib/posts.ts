
// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

interface PostData {
  id: string;
  title: string;
  date: string;
  description?: string;
  contentHtml?: string;

  category?: string;
  readTime?: string;
  author?: string;

  [key: string]: any;

}

const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * 获取所有博客文章数据并排序
 * @returns 
 */
export function getSortedPostsData(): PostData[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory does not exist:', postsDirectory);
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName): PostData => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        id,
        title: matterResult.data.title || '',
        date: matterResult.data.date || '',
        description: matterResult.data.description || '',
        ...matterResult.data,
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory does not exist:', postsDirectory);
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => ({
      params: {
        slug: fileName.replace(/\.md$/, '')
      }
    }));
}


export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // 使用 remark 处理 markdown
  const processedContent = await remark()
    .use(html, { sanitize: false }) // 添加 sanitize: false 选项
    .process(matterResult.content);
  
  const contentHtml = processedContent.toString();
  
  // console.log('Processed content:', contentHtml); // 调试日志

  return {
    id: slug,
    contentHtml,
    title: matterResult.data.title || '',
    date: matterResult.data.date || '',
    description: matterResult.data.description || '',
    ...matterResult.data,
  };
}