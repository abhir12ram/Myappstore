

import React, { useState, useMemo, useEffect, useRef } from 'react';

// --- TYPE DEFINITIONS ---
type AppCategory = 'Games' | 'Productivity' | 'Social' | 'Tools';

interface App {
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

interface AppUpdate {
  id: string;
  appId: string;
  version: string;
  updateDate: string;
  updateNotes:string;
}

type Page = 'Home' | 'Categories' | 'Updates' | 'Account';

const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/izwenlwnfwspw';

// --- SVG ICON COMPONENTS ---

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled = true }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);

const CategoriesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
);

const UpdatesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3V10" /></svg>
);

const AccountIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);
const BugAntIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.182 16.182A4.5 4.5 0 0112 16.5a4.5 4.5 0 01-3.182-.818m3.182 4.455A4.5 4.5 0 0012 21a4.5 4.5 0 00-3.182-1.165M12 6.75V3.75m0 3a1.5 1.5 0 01-3 0V3.75a1.5 1.5 0 013 0zm0 0a1.5 1.5 0 003 0V3.75a1.5 1.5 0 00-3 0zm0 6a3 3 0 100 6 3 3 0 000-6zm-7.182 4.182a4.5 4.5 0 01-1.165-3.182 4.5 4.5 0 011.165-3.182m13.198 0A4.5 4.5 0 0119.5 12a4.5 4.5 0 01-1.165 3.182m-1.165-6.364A4.5 4.5 0 0016.5 9a4.5 4.5 0 00-3.182-1.165M4.818 8.818A4.5 4.5 0 007.5 9a4.5 4.5 0 003.182-1.165" /></svg>
);
const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);
const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 009 2.944c3.978 0 7.53-2.222 9-5.533a12.02 12.02 0 00-2.382-9.457z" /></svg>
);
const ArrowRightOnRectangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
);

// --- HELPER COMPONENTS ---

const Rating: React.FC<{ rating: number; className?: string }> = ({ rating, className = "w-4 h-4" }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={className + (i < Math.floor(rating) ? " text-yellow-400" : " text-gray-300")} filled={i < rating} />
        ))}
    </div>
);

const AppCard: React.FC<{ app: App; onClick: () => void }> = ({ app, onClick }) => (
    <div className="flex flex-col items-center space-y-2 cursor-pointer group" onClick={onClick}>
        <img src={app.iconUrl} alt={app.name} className="w-24 h-24 rounded-3xl object-cover shadow-sm group-hover:shadow-lg transition-shadow" />
        <div className="w-full px-1 text-center">
            <h3 className="font-semibold text-slate-800 text-sm truncate">{app.name}</h3>
            <p className="text-xs text-slate-500 truncate">{app.category}</p>
        </div>
    </div>
);

const FeaturedSlider: React.FC<{ apps: App[]; onAppClick: (app: App) => void }> = ({ apps, onAppClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === apps.length - 1 ? 0 : prevIndex + 1
        ),
      4000
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, apps.length]);

  if (!apps || apps.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg aspect-[16/8]">
      <div
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {apps.map((app) => (
          <div
            key={app.id}
            className="w-full flex-shrink-0 h-full relative cursor-pointer group"
            onClick={() => onAppClick(app)}
          >
            <img
              src={app.bannerUrl}
              alt={`${app.name} banner`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="font-bold text-lg">{app.name}</h3>
              <p className="text-sm">{app.category}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {apps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white w-4' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};


// --- AUTH & PROFILE COMPONENTS ---

const AuthPage: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email/username and password.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            // Check if user exists
            const searchRes = await fetch(`${SHEETDB_API_URL}/search?username=${encodeURIComponent(email)}`);
            const existingUsers = await searchRes.json();

            if (existingUsers.length > 0) {
                // User exists, log them in (simple login, no password check for this demo)
                onLogin(email);
            } else {
                // User doesn't exist, sign them up
                const createRes = await fetch(SHEETDB_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: [{ username: email, password }],
                    }),
                });
                if (!createRes.ok) throw new Error('Failed to create account.');
                onLogin(email);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-10rem)]">
            <div className="w-full max-w-sm text-center">
                 <h1 className="text-3xl font-bold text-slate-800 mb-2">My Account</h1>
                 <p className="text-slate-500 mb-8">Sign up or log in to continue.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Email / Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-200 border border-slate-300 rounded-lg py-3 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-200 border border-slate-300 rounded-lg py-3 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                        {isLoading ? 'Loading...' : 'Continue'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};


const ProfilePage: React.FC<{ 
    userEmail: string; 
    onLogout: () => void; 
    downloadedApps: App[]; 
    onAppClick: (app: App) => void;
    complaints: string;
    suggestions: string;
}> = ({ userEmail, onLogout, downloadedApps, onAppClick, complaints: initialComplaints, suggestions: initialSuggestions }) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [complaint, setComplaint] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const [currentComplaints, setCurrentComplaints] = useState(initialComplaints);
    const [currentSuggestions, setCurrentSuggestions] = useState(initialSuggestions);

    useEffect(() => {
        setCurrentComplaints(initialComplaints);
        setCurrentSuggestions(initialSuggestions);
    }, [initialComplaints, initialSuggestions]);

    const handleFeedbackSubmit = async (type: 'complaint' | 'suggestion', content: string) => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        setSubmitMessage('');
        try {
            const fieldName = type === 'complaint' ? 'complaints' : 'suggestion';
            const res = await fetch(`${SHEETDB_API_URL}/username/${encodeURIComponent(userEmail)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { [fieldName]: content },
                }),
            });
            if (!res.ok) throw new Error('Submission failed');
            setSubmitMessage('Your feedback has been submitted. Thank you!');
            if (type === 'complaint') {
                setComplaint('');
                setCurrentComplaints(content);
            }
            if (type === 'suggestion') {
                setSuggestion('');
                setCurrentSuggestions(content);
            }
        } catch (error) {
            setSubmitMessage('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(''), 3000);
        }
    };

    const AccordionItem: React.FC<{ title: string; id: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, id, icon, children }) => (
        <div className="border-b border-slate-200">
            <button
                onClick={() => setActiveSection(activeSection === id ? null : id)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <div className="flex items-center space-x-3">
                    {icon}
                    <span className="font-semibold text-slate-700">{title}</span>
                </div>
                <svg className={`w-5 h-5 text-slate-500 transition-transform ${activeSection === id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {activeSection === id && <div className="p-4 pt-0">{children}</div>}
        </div>
    );
    
    return (
        <div className="p-4 pb-20 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
                <p className="text-slate-500">{userEmail}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <AccordionItem title="My Downloads" id="downloads" icon={<DownloadIcon className="w-6 h-6 text-blue-500" />}>
                   {downloadedApps.length > 0 ? (
                        <div className="grid grid-cols-4 gap-x-4 gap-y-8">
                            {downloadedApps.map(app => <AppCard key={app.id} app={app} onClick={() => onAppClick(app)} />)}
                        </div>
                   ) : (
                       <p className="text-slate-500 text-center py-4">You haven't downloaded any apps yet.</p>
                   )}
                </AccordionItem>
                <AccordionItem title="Submit a Complaint" id="complaint" icon={<BugAntIcon className="w-6 h-6 text-red-500" />}>
                    {currentComplaints && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="font-semibold text-sm text-red-800">Your last complaint:</p>
                            <p className="text-slate-600 text-sm whitespace-pre-wrap">{currentComplaints}</p>
                        </div>
                    )}
                    <textarea value={complaint} onChange={e => setComplaint(e.target.value)} rows={4} placeholder={currentComplaints ? "Submit a new complaint to replace the old one." : "Please describe the issue..."} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                    <button onClick={() => handleFeedbackSubmit('complaint', complaint)} disabled={isSubmitting} className="mt-2 w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 disabled:bg-red-300">Submit</button>
                </AccordionItem>
                 <AccordionItem title="Make a Suggestion" id="suggestion" icon={<LightBulbIcon className="w-6 h-6 text-yellow-500" />}>
                    {currentSuggestions && (
                         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="font-semibold text-sm text-yellow-800">Your last suggestion:</p>
                            <p className="text-slate-600 text-sm whitespace-pre-wrap">{currentSuggestions}</p>
                        </div>
                    )}
                    <textarea value={suggestion} onChange={e => setSuggestion(e.target.value)} rows={4} placeholder={currentSuggestions ? "Submit a new suggestion to replace the old one." : "What can we improve?"} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                    <button onClick={() => handleFeedbackSubmit('suggestion', suggestion)} disabled={isSubmitting} className="mt-2 w-full bg-yellow-500 text-white font-semibold py-2 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300">Submit</button>
                </AccordionItem>
                <AccordionItem title="About Us" id="about" icon={<InformationCircleIcon className="w-6 h-6 text-slate-500" />}>
                   <p className="text-slate-600 text-sm">Welcome to the App Store Discovery, your number one source for all things apps. We're dedicated to giving you the very best of mobile applications, with a focus on quality, user experience, and innovation.</p>
                </AccordionItem>
                 <AccordionItem title="Privacy Policy" id="privacy" icon={<ShieldCheckIcon className="w-6 h-6 text-green-500" />}>
                   <p className="text-slate-600 text-sm">Your privacy is important to us. It is App Store Discovery's policy to respect your privacy regarding any information we may collect from you across our website. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
                </AccordionItem>
            </div>
             {submitMessage && <p className="text-center text-green-600 mt-4">{submitMessage}</p>}
            <button onClick={onLogout} className="w-full mt-4 flex items-center justify-center space-x-2 bg-slate-200 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors">
                <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                <span>Log Out</span>
            </button>
        </div>
    );
};


// --- PAGE COMPONENTS ---

const HomePage: React.FC<{ apps: App[]; onAppClick: (app: App) => void }> = ({ apps, onAppClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => ['All', ...new Set(apps.map(app => app.category))] as const, [apps]);
  
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apps, selectedCategory, searchQuery]);

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search for apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-200 border border-slate-300 rounded-full py-2 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Discover</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors whitespace-nowrap ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-4 gap-x-4 gap-y-8">
            {filteredApps.length > 0 ? (
                filteredApps.map((app, index) => (
                    <React.Fragment key={app.id}>
                        <AppCard app={app} onClick={() => onAppClick(app)} />
                        {(index + 1) % 8 === 0 && (
                            <div className="col-span-4 my-4">
                                <FeaturedSlider
                                    apps={filteredApps.slice(Math.max(0, index - 7), index + 1)}
                                    onAppClick={onAppClick}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))
            ) : (
                <p className="col-span-4 text-center text-slate-500 py-8">No results found.</p>
            )}
        </div>
      </div>
    </div>
  );
};

const CategoriesPage: React.FC<{ apps: App[]; onAppClick: (app: App) => void }> = ({ apps, onAppClick }) => {
  const groupedApps = useMemo(() => {
    return apps.reduce((acc, app) => {
      if (!acc[app.category]) {
        acc[app.category] = [];
      }
      acc[app.category].push(app);
      return acc;
    }, {} as Record<AppCategory, App[]>);
  }, [apps]);

  return (
    <div className="p-4 pb-20 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Categories</h1>
      {Object.entries(groupedApps).map(([category, appsInCategory]) => (
        <div key={category}>
          <h2 className="text-xl font-bold text-slate-700 mb-3">{category}</h2>
          <div className="grid grid-cols-4 gap-x-4 gap-y-8">
            {appsInCategory.map(app => <AppCard key={app.id} app={app} onClick={() => onAppClick(app)} />)}
          </div>
        </div>
      ))}
    </div>
  );
};

const UpdatesPage: React.FC<{ apps: App[]; updates: AppUpdate[]; onAppClick: (app: App) => void; }> = ({ apps, updates, onAppClick }) => {
    const updatesWithAppInfo = useMemo(() => {
        // FIX: Add a type guard to ensure `updates` is an array before calling `.map()`.
        if (!Array.isArray(updates)) {
            return [];
        }
        return updates.map(update => {
            const app = apps.find(a => a.id === update.appId);
            return { ...update, app };
        }).filter(item => item.app);
    }, [apps, updates]);

    return (
        <div className="p-4 pb-20 space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Updates</h1>
            <div className="space-y-4">
                {updatesWithAppInfo.map(({ id, app, version, updateNotes }) => (
                    <div key={id} className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-4">
                                <img src={app!.iconUrl} alt={app!.name} className="w-16 h-16 rounded-xl" />
                                <div>
                                    <h3 className="font-semibold text-slate-800">{app!.name}</h3>
                                    <p className="text-sm text-slate-500">Version {version}</p>
                                </div>
                            </div>
                            <button onClick={() => onAppClick(app!)} className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-600">
                                UPDATE
                            </button>
                        </div>
                        <p className="text-slate-700 mt-3 whitespace-pre-wrap text-sm">{updateNotes}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AppDetailsPage: React.FC<{ app: App; onBack: () => void; onDownload: (app: App) => void; }> = ({ app, onBack, onDownload }) => {
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
                    <img src={app.iconUrl} alt={app.name} className="w-24 h-24 rounded-3xl object-cover shadow-lg flex-shrink-0 border-4 border-slate-50" />
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
                            <span className="text-lg font-semibold">{app.rating.toFixed(1)}</span>
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

                <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4">
                    {app.featureImages.map((img, index) => (
                        <img key={index} src={img} alt={`Feature image ${index + 1}`} className="h-72 w-auto rounded-xl" />
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

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [updates, setUpdates] = useState<AppUpdate[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userDownloads, setUserDownloads] = useState<App[]>([]);
  const [userComplaints, setUserComplaints] = useState('');
  const [userSuggestions, setUserSuggestions] = useState('');

  useEffect(() => {
    fetch('/apps.json')
      .then(res => res.json())
      .then(setApps)
      .catch(err => console.error("Failed to load apps:", err));

    fetch('/updates.json')
      .then(res => res.json())
      .then(setUpdates)
      .catch(err => console.error("Failed to load updates:", err));
    
    const storedUser = localStorage.getItem('appStoreUser');
    if (storedUser) {
        setCurrentUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (currentUser && apps.length > 0) {
      fetch(`${SHEETDB_API_URL}/search?username=${encodeURIComponent(currentUser)}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const userData = data[0]; // Assuming username is unique
                const downloadedAppNames = userData.downloads ? userData.downloads.split(',').filter(Boolean) : [];
                const uniqueAppNames = [...new Set(downloadedAppNames)];
                const downloadedAppsFull = apps.filter(app => uniqueAppNames.includes(app.name));
                setUserDownloads(downloadedAppsFull);
                setUserComplaints(userData.complaints || '');
                setUserSuggestions(userData.suggestion || '');
            }
        })
        .catch(err => {
            console.error("Failed to fetch user data:", err)
            setUserDownloads([]);
            setUserComplaints('');
            setUserSuggestions('');
        });
    } else {
        setUserDownloads([]);
        setUserComplaints('');
        setUserSuggestions('');
    }
  }, [currentUser, apps]);
  
  const handleLogin = (email: string) => {
    localStorage.setItem('appStoreUser', email);
    setCurrentUser(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('appStoreUser');
    setCurrentUser(null);
  };

  const handleDownload = (app: App) => {
    if (!currentUser) {
        alert("Please log in to install apps.");
        setCurrentPage('Account');
        return;
    }
    
    if (userDownloads.some(d => d.id === app.id)) {
        alert(`${app.name} is already installed.`);
        return;
    }

    const newDownloadsList = [...userDownloads, app];
    const newDownloadsString = newDownloadsList.map(d => d.name).join(',');

    fetch(`${SHEETDB_API_URL}/username/${encodeURIComponent(currentUser)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: {
                'downloads': newDownloadsString,
            }
        })
    }).then(res => {
      if (!res.ok) {
        throw new Error('Failed to update downloads sheet');
      }
      return res.json()
    }).then(() => {
        alert(`${app.name} installed successfully!`);
        setUserDownloads(newDownloadsList);
    }).catch(err => {
        alert(`Failed to record installation.`);
        console.error("Failed to record download:", err)
    });
  };

  const handleAppClick = (app: App) => {
    setSelectedApp(app);
  };
  
  const handleBack = () => {
    setSelectedApp(null);
  }

  const renderPage = () => {
    if (selectedApp) {
      return <AppDetailsPage app={selectedApp} onBack={handleBack} onDownload={handleDownload} />;
    }
    switch (currentPage) {
      case 'Home':
        return <HomePage apps={apps} onAppClick={handleAppClick} />;
      case 'Categories':
        return <CategoriesPage apps={apps} onAppClick={handleAppClick} />;
      case 'Updates':
        return <UpdatesPage apps={apps} updates={updates} onAppClick={handleAppClick} />;
      case 'Account':
        return currentUser ? 
            <ProfilePage 
                userEmail={currentUser} 
                onLogout={handleLogout} 
                downloadedApps={userDownloads} 
                onAppClick={handleAppClick} 
                complaints={userComplaints}
                suggestions={userSuggestions}
            /> : 
            <AuthPage onLogin={handleLogin} />;
      default:
        return <HomePage apps={apps} onAppClick={handleAppClick} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-slate-50 min-h-screen font-sans">
      <main>
        {renderPage()}
      </main>
      {!selectedApp && <BottomNav activePage={currentPage} onNavigate={setCurrentPage} />}
    </div>
  );
};


const BottomNav: React.FC<{ activePage: Page, onNavigate: (page: Page) => void }> = ({ activePage, onNavigate }) => {
  const navItems: { page: Page; icon: React.FC<{className?: string}>; label: string }[] = [
    { page: 'Home', icon: HomeIcon, label: 'Home' },
    { page: 'Categories', icon: CategoriesIcon, label: 'Categories' },
    { page: 'Updates', icon: UpdatesIcon, label: 'Updates' },
    { page: 'Account', icon: AccountIcon, label: 'Account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-7xl mx-auto bg-white/80 backdrop-blur-sm border-t border-slate-200 shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ page, icon: Icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${activePage === page ? 'text-blue-500' : 'text-slate-500 hover:text-blue-500'}`}
            aria-label={label}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};


export default App;