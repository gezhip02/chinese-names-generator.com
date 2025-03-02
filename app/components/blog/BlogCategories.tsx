// app/components/blog/BlogCategories.tsx
export default function BlogCategories({ 
    categories, 
    selectedCategory,
    onCategoryChange 
  }: { 
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
  }) {
    return (
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap
              ${selectedCategory === category
                ? 'bg-rose-500 text-white'
                : 'bg-white hover:bg-gray-100 shadow-sm'}`}
          >
            {category}
          </button>
        ))}
      </div>
    );
  }