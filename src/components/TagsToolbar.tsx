import { useState, useEffect, ChangeEvent } from 'react';

interface Tag {
  tag: string;
  count: number;
}

interface TagsToolbarProps {
  onTagsSelected: (selectedTags: string[]) => void;
}

const TagsToolbar = ({ onTagsSelected }: TagsToolbarProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/shopifinder-frontend/tags_summary.json');
        if (!response.ok) {
          throw new Error('Failed to fetch tags data');
        }
        const data = await response.json();
        setTags(data);
      } catch (err) {
        setError('Error loading tags. Please try again later.');
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleTagClick = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);
    onTagsSelected(newSelectedTags);
  };

  const filteredTags = tags.filter(tag => 
    tag.tag.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 shadow">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 shadow text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow p-2 group">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search tags..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Tag count and clear button */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''} available
          {selectedTags.length > 0 && `, ${selectedTags.length} selected`}
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={() => {
              setSelectedTags([]);
              onTagsSelected([]);
            }}
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Tags container with scrollbar */}
      <div className="flex flex-wrap gap-2 max-h-24 group-hover:max-h-48 transition-all duration-300 overflow-y-auto p-1 border border-gray-200 dark:border-gray-700 rounded-lg">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <button
              key={tag.tag}
              onClick={() => handleTagClick(tag.tag)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                selectedTags.includes(tag.tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tag.tag} ({tag.count})
            </button>
          ))
        ) : (
          <div className="w-full text-center py-4 text-gray-500 dark:text-gray-400">
            No tags match your search
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsToolbar;
