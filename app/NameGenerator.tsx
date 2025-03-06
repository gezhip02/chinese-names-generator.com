'use client';

import { useState } from 'react';
import { Sparkles, User2, UserRound, Loader2 } from 'lucide-react';
import type { Gender, GeneratedName } from '@/types';
import Link from 'next/link';

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
                  placeholder="Surname"
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
                placeholder="Your English name"
                className="px-4 py-2 rounded-lg border dark:border-gray-600 
                  bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-rose-500 outline-none"
              />

              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Keywords (e.g. cloud, wisdom)"
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

        {/* SEO 增强内容部分 */}
        <section className="mt-16 space-y-8 text-gray-700 dark:text-gray-300">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Chinese Name Generator - Your Gateway to Authentic Chinese Names</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Why Choose Our Chinese Name Generator?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Culturally authentic names based on traditional Chinese naming principles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Personalized names that reflect your identity and preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Beautiful Chinese characters with meaningful interpretations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Accurate pinyin pronunciations for proper Chinese speaking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Option to include or exclude traditional Chinese surnames</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Multiple name generation options: random, gender-specific, or keyword-based</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Detailed meaning explanations for each generated name</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Integration of your English name into Chinese characters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Keyword-based generation for names with specific meanings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">•</span>
                    <span>Easy-to-use interface with responsive design for all devices</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">How to Use the Chinese Name Generator</h3>

              <div className="space-y-4">
                <div>
                  <p className="font-medium">1. Select Your Preferences:</p>
                  <ul className="pl-6 space-y-1 mt-2">
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span>Choose gender (male, female, or random) for appropriate character selection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span>Decide whether to include a Chinese surname</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span>Enter your English name for phonetic adaptation (optional)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span>Provide keywords to influence the meaning of your generated name</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium">2. Generate Your Chinese Names:</p>
                  <ul className="pl-6 space-y-1 mt-2">
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span>Click the "Generate names" button to create multiple name options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span>View Chinese characters, pinyin pronunciation, and meanings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-rose-500 mr-2">•</span>
                      <span>Compare different options to find your perfect Chinese name</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">About Chinese Names</h3>
              <p className="leading-relaxed">
                Chinese names typically consist of a family name (姓, xìng) followed by a given name (名, míng).
                Family names are usually single characters, while given names can have one or two characters.
                Each character is carefully chosen for its meaning, pronunciation, and visual aesthetics.
              </p>
              <p className="leading-relaxed">
                Our name generator follows authentic Chinese naming practices by considering:
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <span className="text-rose-500 mr-2">•</span>
                  <span>Character meaning and symbolism</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-2">•</span>
                  <span>Appropriate gender associations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-2">•</span>
                  <span>Balance of character elements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-2">•</span>
                  <span>Modern usage and cultural relevance</span>
                </li>
              </ul>
            </div>

            <div className="mt-12 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Why Having a Chinese Name Matters</h3>
              <p className="leading-relaxed">

                A Chinese name is more than just a translation – it&apos;s a bridge to Chinese culture and society.
                Whether you&apos;re learning Mandarin, doing business in China, traveling, or connecting with
                Chinese friends and colleagues, having a proper Chinese name demonstrates respect and
                facilitates deeper cultural connections.
              </p>
              <p className="leading-relaxed">
                Our generator helps you create a name that:
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <span className="text-rose-500 mr-2">•</span>
                  <span>Reflects your personality and values</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-2">•</span>
                  <span>Is easy for Chinese speakers to pronounce and remember</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-2">•</span>
                  <span>Carries positive meanings and cultural significance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-2">•</span>
                  <span>Works well in both personal and professional contexts</span>
                </li>
              </ul>
            </div>

            <div className="mt-12 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Frequently Asked Questions</h3>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">How do Chinese names differ from Western names?</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Chinese names traditionally have the family name first, followed by the given name. Each character has its own meaning,
                    and names are chosen for their symbolic significance rather than just their sound. The combination of characters creates
                    a unique meaning that often expresses parents' hopes and wishes for their child.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">What makes a good Chinese name?</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    A good Chinese name should have positive meanings, be easy to pronounce, use appropriate characters, and follow cultural
                    naming conventions. The characters should complement each other in meaning and sound harmonious when spoken. For non-Chinese
                    individuals, names that reflect personal qualities or aspirations while being culturally respectful are ideal.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Can I use my Chinese name officially?</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    While your generated Chinese name might not be legally recognized in non-Chinese jurisdictions, it can be used socially,
                    professionally, and culturally when interacting with Chinese-speaking communities. Many expatriates, students, and
                    business professionals adopt Chinese names to facilitate communications and build relationships in Chinese contexts.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">How should I choose between multiple name suggestions?</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Consider the meaning, how well it represents you, and how easily it can be pronounced. You might want to ask a native
                    Chinese speaker for their opinion on your options. Look for names that resonate with your personality or values, and
                    check that the meaning aligns with qualities you identify with or aspire toward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Schema.org structured data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Chinese Name Generator",
            "description": "Generate authentic Chinese names with meaningful characters and proper pronunciation.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Personalized name generation",
              "Gender-specific options",
              "Surname integration",
              "Keyword-based name creation",
              "Name meaning explanations"
            ]
          })
        }} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do Chinese names differ from Western names?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Chinese names traditionally have the family name first, followed by the given name. Each character has its own meaning, and names are chosen for their symbolic significance rather than just their sound."
                }
              },
              {
                "@type": "Question",
                "name": "What makes a good Chinese name?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A good Chinese name should have positive meanings, be easy to pronounce, use appropriate characters, and follow cultural naming conventions. The characters should complement each other in meaning and sound harmonious when spoken."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use my Chinese name officially?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "While your generated Chinese name might not be legally recognized in non-Chinese jurisdictions, it can be used socially, professionally, and culturally when interacting with Chinese-speaking communities."
                }
              },
              {
                "@type": "Question",
                "name": "How should I choose between multiple name suggestions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Consider the meaning, how well it represents you, and how easily it can be pronounced. You might want to ask a native Chinese speaker for their opinion on your options."
                }
              }
            ]
          })
        }} />
      </div>
    </div>
  );
}