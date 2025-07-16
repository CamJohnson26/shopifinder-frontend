import { useState, useEffect, useMemo } from 'react';
import SiteCard from './SiteCard';
import TagsToolbar from './TagsToolbar';

interface Site {
  site_name: string;
  url: string;
  ranking: number;
  tags: string[];
}

const SitesGrid = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        // Use the base URL from vite.config.ts
        const response = await fetch('/shopifinder-frontend/shopify_sites.json');
        if (!response.ok) {
          throw new Error('Failed to fetch sites data');
        }
        const data = await response.json();
        // Sort sites by ranking (lowest rank first)
        const sortedSites = [...data].sort((a, b) => a.ranking - b.ranking);
        setSites(sortedSites);
      } catch (err) {
        setError('Error loading sites. Please try again later.');
        console.error('Error fetching sites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const handleTagsSelected = (tags: string[]) => {
    setSelectedTags(tags);
  };

  // Filter sites based on selected tags
  const filteredSites = useMemo(() => {
    if (selectedTags.length === 0) {
      return sites;
    }

    return sites.filter(site => {
      // Normalize tags for case-insensitive comparison
      const siteTags = site.tags.map(tag => tag.trim().toLowerCase());
      // Check if site has all selected tags
      return selectedTags.every(tag => 
        siteTags.includes(tag.toLowerCase())
      );
    });
  }, [sites, selectedTags]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <h1 className="text-3xl font-bold mb-8 text-center pt-8">Shopify Sites Gallery</h1>

      <TagsToolbar onTagsSelected={handleTagsSelected} />

      <div className="mt-6">
        {/* Results summary */}
        <div className={`mb-4 p-3 rounded-lg ${
          selectedTags.length > 0 
            ? (filteredSites.length > 0 
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800')
            : ''
        }`}>
          {selectedTags.length > 0 ? (
            <div className="flex items-center justify-between">
              <p className={`${
                filteredSites.length > 0 
                  ? 'text-blue-700 dark:text-blue-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                Showing {filteredSites.length} of {sites.length} sites
                {` filtered by ${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''}`}
              </p>
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Showing all {sites.length} sites, sorted by ranking
            </p>
          )}
        </div>

        {/* Sites grid */}
        {filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSites.map((site, index) => (
              <SiteCard key={index} site={site} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">No sites match the selected filters</p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try selecting different tags or clearing all filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SitesGrid;
