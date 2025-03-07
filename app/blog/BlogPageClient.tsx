// app/blog/BlogPageClient.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import PageLayout from '../components/Layout/PageLayout';
import BlogCategories from '../components/blog/BlogCategories';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BlogPageClient({ initialPosts }) {
  // const categories = ['All', 'Culture', 'Trends', 'History', 'Famous','Naming Tips'];
  const categories = ['All', 'History', 'Famous','Naming Tips'];
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');
  
  // 如果URL中有category参数，则使用它，否则默认为'All'
  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam && categories.includes(categoryParam) ? categoryParam : 'All'
  );

  // 当URL参数变化时更新选中的类别
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else if (!categoryParam) {
      setSelectedCategory('All');
    }
  }, [categoryParam, categories]);

  // 处理类别变更，同时更新URL
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // 更新URL参数
    if (category === 'All') {
      // 如果选择"All"，则移除category参数
      router.push('/blog');
    } else {
      // 否则添加category参数
      router.push(`/blog?category=${encodeURIComponent(category)}`);
    }
  };

  const filteredPosts = selectedCategory === 'All'
    ? initialPosts
    : initialPosts.filter(post => post.category === selectedCategory);
  
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-violet-600">
          Blog
        </h1>

        <BlogCategories 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="space-y-4 md:space-y-6">
          {filteredPosts.map((post, index) => (
            <Link href={`/blog/${post.id}`} key={index}>
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100">
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-500 mb-2">
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
                <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900 group-hover:text-rose-600">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-3 md:mb-4">{post.description}</p>
                <div className="flex items-center text-rose-500 font-medium">
                  Read more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-8 md:py-10 text-gray-500">
              No posts found in this category.
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}