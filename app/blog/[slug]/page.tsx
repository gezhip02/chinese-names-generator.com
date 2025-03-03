import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import PageLayout from '../../components/Layout/PageLayout';
import { getPostData } from '@/lib/posts';
import ShareButton from '../../components/blog/ShareButton';


// 修改类型定义，使其兼容 Next.js 15
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
    // 确保 params 是 awaitable 的
    const resolvedParams = params instanceof Promise ? await params : params;
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
  
    // 其余代码保持不变
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
          <article className="bg-white rounded-xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
  
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
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
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
            />
  
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium">{post.author || 'Anonymous'}</p>
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
