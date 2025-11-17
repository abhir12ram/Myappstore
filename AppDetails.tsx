

import React from 'react';

// --- TYPE DEFINITIONS ---
// FIX: Exported AppCategory type to be used in other components.
export type AppCategory = 'Games' | 'Productivity' | 'Social' | 'Tools';

// FIX: Exported App interface to be used in other components.
export interface App {
  id: string;
  name: string;
  category: AppCategory;
  iconUrl: string;
  bannerUrl?: string;
  rating: number;
  downloads: string;
  description: string;
  developer: string;
  downloadUrl: string;
  websiteUrl?: string;
  featureImages: string[];
  previousVersions?: { version: string; downloadUrl: string }[];
}

// --- SVG ICON COMPONENTS ---

const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled = true }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);


// --- PAGE COMPONENT ---
const AppDetailsPage: React.FC<{ app: App; onBack: () => void; onDownload: (app: App) => void; }> = ({ app, onBack, onDownload }) => {
    // FIX: A defensive check is added to ensure `app.rating` is a valid number before calling `.toFixed()`.
    // This prevents a potential "Uncaught TypeError" if the rating data is malformed (e.g., a string or null).
    const rating = typeof app.rating === 'number' ? app.rating : 0;

    return (
        <div className="pb-20">
            <div className="relative h-48 bg-slate-300">
                {app.bannerUrl && <img src={app.bannerUrl} alt={`${app.name} banner`} className="w-full h-full object-cover" />}
                <button onClick={onBack} className="absolute top-4 left-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="p-4 space-y-4">
                 <div className="relative z-10 flex items-end space-x-4 -mt-16">
                    <img src={app.iconUrl} alt={app.name} className="w-24 h-24 rounded-full object-cover shadow-xl flex-shrink-0 border-4 border-slate-50" />
                    <div className="relative top-2 flex-1 min-w-0 pb-2">
                        <h1 className="text-2xl font-bold text-slate-800 truncate">{app.name}</h1>
                        <p className="text-slate-500 truncate">{app.developer}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button onClick={() => onDownload(app)} className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-full hover:bg-blue-600 transition-colors">
                        INSTALL
                    </button>
                    {app.websiteUrl && (
                         <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-full hover:bg-slate-300 transition-colors text-center">
                            USE ONLINE
                        </a>
                    )}
                </div>

                <div className="flex justify-around text-center border-y border-slate-200 py-3">
                    <div>
                        <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                        </div>
                        <p className="text-xs text-slate-500">Rating</p>
                    </div>
                    <div className="border-x border-slate-200 px-8">
                        <p className="text-lg font-semibold">{app.downloads}</p>
                        <p className="text-xs text-slate-500">Downloads</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{app.category}</p>
                        <p className="text-xs text-slate-500">Category</p>
                    </div>
                </div>

                <div>
                    <p className="text-slate-700">{app.description}</p>
                </div>

                {/* FIX: Ensure `featureImages` exists and is an array before mapping to prevent runtime errors. */}
                <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4">
                    {Array.isArray(app.featureImages) && app.featureImages.map((img, index) => (
                        <img key={index} src={img} alt={`Feature image ${index + 1}`} className="h-52 w-auto rounded-xl" />
                    ))}
                </div>

                {app.previousVersions && app.previousVersions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-3">Previous Versions</h2>
                    <div className="space-y-3">
                      {app.previousVersions.map((versionInfo) => (
                        <div key={versionInfo.version} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-slate-700">Version {versionInfo.version}</p>
                          </div>
                          <a href={versionInfo.downloadUrl} className="bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-slate-300">
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
};

export default AppDetailsPage;