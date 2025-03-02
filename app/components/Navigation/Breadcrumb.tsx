'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path);
    
    const breadcrumbs = paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      const isLast = index === paths.length - 1;
      
      // Handle blog post slugs
      const formattedLabel = path.replace(/-/g, ' ');
      
      return {
        href,
        label: formattedLabel,
        isLast
      };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  if (pathname === '/') return null;

  return (
    <nav className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-2 text-sm">
          <Link 
            href="/"
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            <Home className="w-4 h-4" />
          </Link>
          
          {breadcrumbs.length > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}

          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center">
              {breadcrumb.isLast ? (
                <span className="text-gray-900 font-medium capitalize">
                  {breadcrumb.label}
                </span>
              ) : (
                <>
                  <Link
                    href={breadcrumb.href}
                    className="text-gray-500 hover:text-gray-700 capitalize"
                  >
                    {breadcrumb.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}