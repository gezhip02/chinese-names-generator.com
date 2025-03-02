// types/blog.d.ts
declare module '*.md' {
    export const metadata: {
      // title: string;
      // date: string;
      // category: string;
      // excerpt: string;
      // readTime: string;

      id: string;
      title: string;
      date: string;
      description?: string;
      category?: string;
      readTime?: string;
      author?: string;
      contentHtml?: string;
    };
  }