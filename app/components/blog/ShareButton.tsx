// app/components/blog/ShareButton.tsx
'use client';
import { Share2 } from 'lucide-react';

export default function ShareButton() {
  return (
    <button className="flex items-center gap-2 text-gray-500 hover:text-rose-500">
      <Share2 className="w-5 h-5" />
      Share
    </button>
  );
}