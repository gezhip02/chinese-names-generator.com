'use client';
import { useState } from 'react';
import { Sparkles, User2, UserRound, Loader2 } from 'lucide-react';
import type { Gender, GeneratedName } from '@/types';

export default function NameGenerator() {
  const [gender, setGender] = useState<Gender>('male');
  const [surname, setSurname] = useState<string>();
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
        body: JSON.stringify({ gender, surname }),
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
            Note: Following Chinese convention, surnames are placed before given names.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
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

            <div className="flex items-center gap-4 ml-auto">
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Surname"
                className="px-4 py-2 rounded-lg border dark:border-gray-600 
                  bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-rose-500 outline-none
                  w-32"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-rose-500 to-violet-500 
                  text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed
                  hover:from-rose-600 hover:to-violet-600 transition-colors flex items-center justify-center gap-2
                  whitespace-nowrap"
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
          <div className="grid gap-6 md:grid-cols-2">
            {generatedNames.map((name, index) => (
              <div key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg 
                  hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <h2 className="text-xl font-medium mb-2">{name.pinyin}</h2>
                  <p className="text-4xl mb-4 font-serif">{name.characters}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Meaning: <span className="font-medium">"{name.meaning}"</span>
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