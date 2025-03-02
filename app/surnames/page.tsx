'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { commonSurnames } from './surnames.config';
import PageLayout from '../components/Layout/PageLayout';

const removeTones = (pinyin: string) => {
  return pinyin
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export default function SurnamesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurnames = commonSurnames.filter(surname =>
    surname.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    removeTones(surname.pinyin).includes(removeTones(searchTerm))
  );

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-violet-600">
          Chinese Surnames (百家姓)
        </h1>
        
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8">
          The Hundred Family Surnames are a collection of classic surnames that have been passed down 
          in China for thousands of years, carrying family inheritance and cultural codes.
        </p>

        <div className="relative mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for surname (supports Pinyin/Chinese characters)..."
            className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-rose-200/50 bg-white/90 
              focus:border-rose-500 focus:ring-0 focus:shadow-lg focus:shadow-rose-100 
              placeholder:text-rose-300/70 transition-all duration-300 outline-none
              hover:border-rose-300 text-rose-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
            text-rose-400/80 group-focus-within:text-rose-500 
            transition-colors duration-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurnames.map((surname, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="text-center">
                <p className="text-xl font-medium mb-2">{surname.pinyin}</p>
                <h2 className="text-5xl font-serif mb-4">{surname.surname}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}