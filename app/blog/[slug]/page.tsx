import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import PageLayout from '../../components/Layout/PageLayout';
import { getPostData } from '@/lib/posts';
import ShareButton from '../../components/blog/ShareButton';

// 修改类型定义，在 Next.js 15 中 params 必须是 Promise 类型
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    // 确保 params 是 awaitable 的
    const resolvedParams = await params;
    const { slug } = resolvedParams;
  
    if (!slug) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid slug</h1>
            <Link href="/blog" className="text-rose-500 hover:underline">
              Return to blog
            </Link>
          </div>
        </div>
      );
    }
  
    const post = await getPostData(slug);
  
    if (!post) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link href="/blog" className="text-rose-500 hover:underline">
              Return to blog
            </Link>
          </div>
        </div>
      );
    }
  
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto">
          <article className="bg-white rounded-xl p-4 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{post.title}</h1>
  
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-500 mb-6 md:mb-8">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime || '5 min read'}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {post.category}
              </span>
            </div>
  
            <div
              className="prose prose-sm md:prose-lg max-w-none prose-headings:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
            />
  
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">Writer</p>
                  </div>
                </div>
  
                {/* <ShareButton /> */}
              </div>
            </div>
            
          </article>
        </div>
      </PageLayout>
    );
  }
