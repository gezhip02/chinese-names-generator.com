import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'fil', name: 'Filipino' },
  { code: 'hi', name: 'हिंदी' },
];

export default function LanguageSelector({ 
  currentLang, 
  onLanguageChange 
}: { 
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
          hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <Globe className="w-5 h-5" />
        <span>{languages.find(lang => lang.code === currentLang)?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 
          rounded-lg shadow-lg border dark:border-gray-700 py-2 min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}