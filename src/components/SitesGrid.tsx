import { useState, useEffect } from 'react';
import SiteCard from './SiteCard';

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

  useEffect(() => {
    const fetchSites = async () => {
      try {
        // Use the base URL from vite.config.ts
        const response = await fetch('/shopifinder-frontend/shopify_sites.json');
        if (!response.ok) {
          throw new Error('Failed to fetch sites data');
        }
        const data = await response.json();
        setSites(data);
      } catch (err) {
        setError('Error loading sites. Please try again later.');
        console.error('Error fetching sites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopify Sites Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sites.map((site, index) => (
          <SiteCard key={index} site={site} />
        ))}
      </div>
    </div>
  );
};

export default SitesGrid;
