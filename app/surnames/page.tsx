'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { commonSurnames } from './surnames.config';
import PageLayout from '../components/Layout/PageLayout';
import Head from 'next/head';
import Link from 'next/link';

const removeTones = (pinyin: string) => {
  return pinyin
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export default function SurnamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSurnames, setFilteredSurnames] = useState(commonSurnames);

  // 使用useEffect优化过滤性能
  useEffect(() => {
    const filtered = commonSurnames.filter(surname =>
      surname.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      removeTones(surname.pinyin).includes(removeTones(searchTerm))
    );
    setFilteredSurnames(filtered);
  }, [searchTerm]);

  // 根据首字母分组
  const groupedSurnames = filteredSurnames.reduce((acc, surname) => {
    const firstLetter = surname.pinyin.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(surname);
    return acc;
  }, {});

  // 字母索引
  const alphabetIndex = Object.keys(groupedSurnames).sort();

  return (
    <>
      <Head>
        <title>Chinese Surnames (百家姓) - Complete List of Common Chinese Family Names</title>
        <meta name="description" content="Explore the traditional Chinese Hundred Family Surnames (百家姓) with pinyin pronunciation. Find the most common Chinese family names and their meanings." />
        <meta name="keywords" content="Chinese surnames, 百家姓, bai jia xing, Chinese family names, Chinese last names, Chinese culture, Chinese heritage" />
        <link rel="canonical" href="https://yourwebsite.com/surnames" />
        
        {/* 添加结构化数据 */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Chinese Surnames (百家姓)",
              "description": "Complete list of common Chinese family names with pinyin pronunciation",
              "url": "https://yourwebsite.com/surnames",
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": [
                  ${commonSurnames.slice(0, 10).map((surname, index) => `
                    {
                      "@type": "ListItem",
                      "position": ${index + 1},
                      "name": "${surname.surname}",
                      "url": "https://yourwebsite.com/surnames#${surname.surname}"
                    }
                  `).join(',')}
                ]
              }
            }
          `}
        </script>
      </Head>

      <PageLayout>
        <article className="max-w-6xl mx-auto">
          <header>
            <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-violet-600">
              Chinese Surnames (百家姓)
            </h1>
            
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-4">
              The Hundred Family Surnames (百家姓 - Bǎi Jiā Xìng) are a collection of classic surnames that have been passed down 
              in China for thousands of years, carrying family inheritance and cultural codes.
            </p>
            
            <p className="text-md text-gray-500 text-center max-w-3xl mx-auto mb-8">
              Our comprehensive list includes the most common Chinese family names with their proper pinyin pronunciation,
              helping you understand Chinese naming traditions.
            </p>
          </header>

          <section className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for surname (supports Pinyin/Chinese characters)..."
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-rose-200/50 bg-white/90 
                  focus:border-rose-500 focus:ring-0 focus:shadow-lg focus:shadow-rose-100 
                  placeholder:text-rose-300/70 transition-all duration-300 outline-none
                  hover:border-rose-300 text-rose-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search for Chinese surnames"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                text-rose-400/80 group-focus-within:text-rose-500 
                transition-colors duration-300" aria-hidden="true" />
            </div>
          </section>

          {/* 字母索引导航 */}
          {alphabetIndex.length > 0 && (
            <nav className="mb-6 sticky top-0 bg-white py-2 z-10 shadow-sm" aria-label="Alphabetical Index">
              <div className="flex flex-wrap justify-center gap-2">
                {alphabetIndex.map(letter => (
                  <a 
                    key={letter} 
                    href={`#section-${letter}`}
                    className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-md transition"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </nav>
          )}

          {/* 分组显示姓氏 */}
          {alphabetIndex.length > 0 ? (
            alphabetIndex.map(letter => (
              <section key={letter} id={`section-${letter}`} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b border-gray-200 pb-2">
                  {letter}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedSurnames[letter].map((surname, index) => (
                    <div
                      key={index}
                      id={surname.surname}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                    >
                      <div className="text-center">
                        <p className="text-xl font-medium mb-2">{surname.pinyin}</p>
                        <h3 className="text-5xl font-serif mb-4">{surname.surname}</h3>
                        {surname.meaning && (
                          <p className="text-sm text-gray-500">Meaning: {surname.meaning}</p>
                        )}
                        <Link href={`/?surname=${encodeURIComponent(surname.surname)}&includeSurname=true`} className="text-rose-500 hover:underline mt-2 inline-block">
                          Generate names with {surname.surname}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No surnames found matching "{searchTerm}"</p>
            </div>
          )}

          <footer className="mt-12 text-center text-gray-500 text-sm">
            <p>Explore our complete collection of {commonSurnames.length} traditional Chinese surnames.</p>
            <p className="mt-4">
              <Link href="/about-chinese-names" className="text-rose-500 hover:underline">
                Learn more about Chinese naming traditions
              </Link>
            </p>
          </footer>
        </article>
      </PageLayout>
    </>
  );
}