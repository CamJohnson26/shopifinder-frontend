import { useState } from 'react';

interface SiteCardProps {
  site: {
    site_name: string;
    url: string;
    ranking: number;
    tags: string[];
  };
}

const SiteCard = ({ site }: SiteCardProps) => {
  const [showModal, setShowModal] = useState(false);
  // Import images from the public folder for production builds
  const imageUrl = `/shopifinder-frontend/screenshots/${site.url}.png`;

  const handleClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    window.open(`https://${site.url}`, '_blank');
    setShowModal(false);
  };

  return (
    <div className="relative group">
      {/* Site Card */}
      <div 
        onClick={handleClick}
        className="cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:shadow-xl"
      >
        <img 
          src={imageUrl} 
          alt={site.site_name} 
          className="w-full site-card-image transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover overlay with site details */}
        <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
          <h3 className="text-xl font-bold mb-2">{site.site_name}</h3>
          <p className="text-sm mb-2">{site.url}</p>
          <p className="text-sm mb-2">Ranking: {site.ranking}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {site.tags.slice(0, 5).map((tag, index) => (
              <span key={index} className="text-xs bg-blue-500 bg-opacity-50 px-2 py-1 rounded">
                {tag.trim()}
              </span>
            ))}
            {site.tags.length > 5 && (
              <span className="text-xs bg-blue-500 bg-opacity-50 px-2 py-1 rounded">
                +{site.tags.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal for external site warning */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
          <div className="bg-white text-black p-6 rounded-lg max-w-md">
            <h3 className="text-xl font-bold mb-4">External Site Warning</h3>
            <p className="mb-4">
              You are about to visit an external website: <strong>{site.url}</strong>
            </p>
            <p className="mb-6">
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Continue to Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteCard;
