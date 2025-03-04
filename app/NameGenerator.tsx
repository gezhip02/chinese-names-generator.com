'use client'; // 添加这一行

import { useState } from 'react';
import { Sparkles, User2, UserRound, Loader2 } from 'lucide-react';
import type { Gender, GeneratedName } from '@/types';
import Link from 'next/link'; // 确保导入 Link 组件

export default function NameGenerator() {
  const [gender, setGender] = useState<Gender>('male');
  const [surname, setSurname] = useState<string>('');
  const [englishName, setEnglishName] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [includeSurname, setIncludeSurname] = useState<boolean>(true);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          gender, 
          surname: includeSurname ? surname : '', 
          englishName,
          keywords,
          includeSurname
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setGeneratedNames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate names');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-violet-600 mb-4">
            Chinese Name Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Welcome to the most-spoken language in the world. Generate authentic Chinese names 
            with meaningful characters and proper pronunciation.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Note: Chinese names can be with or without surnames, just like &quot;大山&quot; (Dashan) or &quot;马云&quot; (Ma Yun).
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-6">
            {/* 性别选择 */}
            <div className="flex flex-wrap gap-4">
              {[
                { value: 'random', icon: Sparkles, label: 'Random' },
                { value: 'male', icon: User2, label: 'Male' },
                { value: 'female', icon: UserRound, label: 'Female' }
              ].map(({ value, icon: Icon, label }) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={gender === value}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="sr-only"
                  />
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${gender === value 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* 姓氏选项 */}
            <div className="flex items-center">
              <label className="inline-flex items-center mr-2">
                <input
                  type="checkbox"
                  checked={includeSurname}
                  onChange={(e) => setIncludeSurname(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Include surname</span>
              </label>
              
              <div className={`flex-1 transition-all duration-300 ${includeSurname ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'}`}>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Surname (optional)"
                  disabled={!includeSurname}
                  className="px-4 py-2 rounded-lg border dark:border-gray-600 
                    bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-rose-500 outline-none
                    w-full"
                />
              </div>
            </div>

            {/* 英文名和关键词 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="Your English name (optional)"
                className="px-4 py-2 rounded-lg border dark:border-gray-600 
                  bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-rose-500 outline-none"
              />
              
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Keywords (optional e.g. cloud, wisdom)"
                className="px-4 py-2 rounded-lg border dark:border-gray-600 
                  bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            {/* 生成按钮 */}
            <div className="flex justify-center mt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-violet-500 
                  text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed
                  hover:from-rose-600 hover:to-violet-600 transition-colors flex items-center justify-center gap-2
                  whitespace-nowrap w-full sm:w-auto text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate names'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {generatedNames.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {generatedNames.map((name, index) => (
              <div key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                  hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <h2 className="text-xl font-medium mb-2">{name.pinyin}</h2>
                  <p className="text-4xl mb-4 font-serif">{name.characters}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Meaning: <span className="font-medium">&quot;{name.meaning}&quot;</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}