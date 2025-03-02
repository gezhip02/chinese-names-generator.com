// app/blog/BlogPageClient.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import PageLayout from '../components/Layout/PageLayout';
import BlogCategories from '../components/blog/BlogCategories';

export default function BlogPageClient({ initialPosts }) {
  const categories = ['All', 'Culture', 'Trends', 'History', 'Famous','Naming Tips'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? initialPosts
    : initialPosts.filter(post => post.category === selectedCategory);

  // 其余 JSX 保持不变...
  
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-violet-600">
          Blog
        </h1>

        <BlogCategories 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <Link href={`/blog/${post.id}`} key={index}>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
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
                <h2 className="text-xl font-bold mb-2 group-hover:text-rose-600">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex items-center text-rose-500 font-medium">
                  Read more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No posts found in this category.
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}