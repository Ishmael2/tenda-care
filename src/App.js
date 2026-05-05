import React, { useState, useEffect, useMemo } from 'react';
import { 
  Circle as LucideCircle, Globe, ShieldCheck, Users, ArrowRight, Activity, Search, Menu, X, CreditCard, MapPin, Stethoscope, Scale, Briefcase, Award, GraduationCap, HeartPulse, Heart, Download, Plus, CheckCircle2, Info, Lock, ChevronRight, RefreshCw, ExternalLink, Home, BookOpen, Microscope, ArrowRightLeft, Megaphone, Upload, Calendar, Clock, Wrench, MessageSquare, Eye, Tag, User, AlignLeft, UserCircle, ChevronLeft, ImageIcon, FileText, Cpu, Settings, Map, Compass
} from 'lucide-react';

import Login from './components/Login'; 
import { supabase } from './supabaseClient'; 

// --- Constants & Data ---
const PAGES = { HOME: 'HOME', RESOURCES: 'RESOURCES', THERAPIES: 'THERAPIES', RESEARCH: 'RESEARCH', EXCHANGE: 'EXCHANGE', GET_INVOLVED: 'GET_INVOLVED' };

const NAV_ITEMS = [
    { id: PAGES.HOME, label: 'Home', icon: <Home className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.RESOURCES, label: 'Resources', icon: <BookOpen className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.THERAPIES, label: 'Therapies', icon: <HeartPulse className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.RESEARCH, label: 'R&D Lab', icon: <Microscope className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.EXCHANGE, label: 'Exchange', icon: <ArrowRightLeft className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.GET_INVOLVED, label: 'Get Involved', icon: <Megaphone className="w-4 h-4 mb-0.5" /> }
];

const DEVICE_TYPES = ["Mobility (Wheelchairs, Crutches)", "Visual (Braille, White Canes)", "Hearing (Digital Aids, Vibrating Alarms)", "Tech (Specialized Keyboards, Screen Readers)", "Daily Living (Adapted Utensils, Reach Sticks)"];

const STATIC_CONTENT = {
    policies: [
      { 
          title: "Constitution of Kenya (Article 54)", 
          desc: "Guarantees the right to be treated with dignity and reasonable accommodation.", 
          year: "2010", 
          type: "National Law",
          link: "https://www.klrc.go.ke/index.php/constitution-of-kenya/112-chapter-four-the-bill-of-rights/part-3-specific-application-of-rights/120-54-persons-with-disabilities"
      },
      { 
          title: "Persons with Disabilities Act", 
          desc: "Primary legislative framework governing the rights of PWDs in Kenya.", 
          year: "2025",
          type: "Statute",
          link: "https://ncpwd.go.ke/persons-with-disabilities-act-2003/"
      },
      {
          title: "UN CRPD",
          desc: "Convention on the Rights of Persons with Disabilities.",
          year: "2006",
          type: "Global Treaty",
          link: "https://www.un.org/development/desa/disabilities/convention-on-the-rights-of-persons-with-disabilities.html"
      }
    ]
};

// --- Sub-Components ---
const LogoIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white transition-transform hover:scale-110">
        <circle cx="12" cy="12" r="9" fill="currentColor" />
    </svg>
);

const Notification = ({ message, type, onClose }) => (
  <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[3000] animate-in fade-in slide-in-from-top-4 duration-500 w-full max-w-sm px-6">
    <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border-2 backdrop-blur-md ${type === 'success' ? 'bg-slate-900/90 text-white border-green-500' : 'bg-red-50/90 text-red-900 border-red-200'}`}>
      {type === 'success' ? <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" /> : <Info className="text-red-500 w-5 h-5 flex-shrink-0" />}
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-70 p-1"><X className="w-4 h-4" /></button>
    </div>
  </div>
);

const AuthModal = ({ onClose }) => (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="relative w-full max-w-[400px]">
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-red-600 text-white rounded-full transition-all" aria-label="Close modal">
                <X className="w-5 h-5"/>
            </button>
            <Login />
        </div>
    </div>
);

// ----------- PAGE COMPONENTS -----------

const HeroSection = ({ setPage }) => (
    <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32 selection:bg-red-500 selection:text-white min-h-[90vh] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full bg-red-600 blur-[140px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] rounded-full bg-red-800 blur-[140px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
            <div className="lg:w-3/5 text-center lg:text-left">
                <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest mb-8">
                    <Globe className="w-4 h-4 animate-pulse" />
                    <span>Global Disability Rights Network</span>
                </div>
                <h1 className="text-5xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase">
                    NOTHING <br />ABOUT US <br />
                    <span className="text-red-700 italic">WITHOUT US.</span>
                </h1>
                <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium">
                    Tenda Care is dedicated to amplifying the voices of PWDs worldwide. We fight for dignity, radical inclusion, and the dismantling of structural barriers.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <button onClick={() => setPage(PAGES.GET_INVOLVED)} className="w-full sm:w-auto px-10 py-5 bg-red-700 hover:bg-red-800 text-white font-black rounded-full shadow-2xl shadow-red-900/40 transition-all flex items-center justify-center uppercase tracking-widest text-xs hover:-translate-y-1">
                        JOIN THE MOVEMENT <ArrowRight className="ml-3 w-4 h-4" />
                    </button>
                    <button onClick={() => setPage(PAGES.RESOURCES)} className="w-full sm:w-auto px-10 py-5 bg-white/5 border-2 border-slate-800 hover:border-slate-600 text-white font-black rounded-full transition-all uppercase tracking-widest text-xs hover:bg-white/10">
                        LEARN OUR STRATEGY
                    </button>
                </div>
            </div>
            <div className="hidden lg:flex w-1/3 justify-center relative">
                <div className="w-80 h-80 rounded-[3rem] bg-gradient-to-br from-red-600 to-red-950 rotate-12 flex items-center justify-center shadow-[0_0_100px_rgba(185,28,28,0.2)] relative group overflow-hidden">
                    <LucideCircle className="w-48 h-48 text-white/10 absolute fill-current group-hover:scale-125 transition-transform duration-1000" />
                    <Users className="w-32 h-32 text-white relative z-10" />
                </div>
            </div>
        </div>
    </section>
);

const PillarsSection = () => {
    const pillars = [
        { id: '01', title: "Economic Independence", desc: "Building inclusive employment pathways and entrepreneurial grant systems.", icon: <CreditCard className="w-6 h-6" />, color: "from-red-600 to-red-800" },
        { id: '02', title: "Universal Access", desc: "Advocating for 100% accessibility in transit and architecture.", icon: <MapPin className="w-6 h-6" />, color: "from-slate-800 to-slate-950" },
        { id: '03', title: "Healthcare Equity", desc: "Ensuring specialized rehabilitation and therapy services.", icon: <Stethoscope className="w-6 h-6" />, color: "from-red-800 to-red-950" },
        { id: '04', title: "Policy Leadership", desc: "Empowering PWDs to take lead seats in legislative bodies.", icon: <Scale className="w-6 h-6" />, color: "from-slate-900 to-black" }
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 text-left max-w-2xl">
                    <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Mission Framework</p>
                    <h2 className="text-4xl lg:text-6xl font-black text-slate-950 mb-6 tracking-tighter uppercase leading-none">THE FOUR PILLARS <br />OF RADICAL CHANGE</h2>
                    <div className="w-24 h-2 bg-red-700 rounded-full"></div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pillars.map((p) => (
                        <div key={p.id} className="group flex flex-col h-full bg-slate-50 p-8 rounded-[2rem] border border-slate-100 transition-all hover:shadow-xl hover:border-red-100 hover:-translate-y-1">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                                {p.icon}
                            </div>
                            <span className="text-slate-200 font-black text-4xl mb-4 leading-none tracking-tighter transition-colors group-hover:text-red-100">{p.id}</span>
                            <h3 className="text-xl font-black text-slate-950 mb-4 tracking-tight uppercase leading-tight">{p.title}</h3>
                            <p className="text-slate-500 leading-relaxed flex-grow font-medium text-sm">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const LiveResearchFeed = () => {
    const [papers, setPapers] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('Africa');
    const [error, setError] = useState(null);

    const fetchPapers = async (query) => {
        setIsRefreshing(true);
        setError(null);
        
        const searchTerms = `disability inclusion ${query}`.trim().replace(/\s+/g, '+');
        const apiUrl = `https://api.openalex.org/works?search=${searchTerms}&filter=has_fulltext:true&per-page=5&sort=publication_year:desc`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch from OpenAlex");
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const formattedData = data.results.map(paper => ({
                    id: paper.id,
                    title: paper.title,
                    author: paper.authorships?.[0]?.author?.display_name || "Unknown Author",
                    year: paper.publication_year,
                    link: paper.open_access?.oa_url || paper.doi || "#",
                    isOpenAccess: paper.open_access?.is_oa
                }));
                setPapers(formattedData);
            } else {
                setPapers([]);
            }
        } catch (err) {
            console.error("API Error:", err);
            setError("Could not load live research at this time. Please try again later.");
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPapers(searchQuery);
        // eslint-disable-next-line
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPapers(searchQuery);
    };

    return (
        <div className="bg-slate-950 p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] text-white shadow-xl relative overflow-hidden mb-24 border border-slate-800">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-700/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 relative z-10 gap-6">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
                        <p className="text-green-500 font-black uppercase tracking-[0.3em] text-[10px]">Live Data: OpenAlex API</p>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">Global Empirical <br/>Research Papers</h3>
                </div>
                
                <div className="w-full md:w-auto flex flex-col items-end">
                    <form onSubmit={handleSearch} className="flex w-full md:w-80 relative mb-3">
                        <input 
                            type="text" 
                            placeholder="Search regions or topics (e.g., India, Autism)" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 pl-5 pr-12 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 text-xs font-bold outline-none focus:border-red-500 transition-colors"
                        />
                        <button type="submit" disabled={isRefreshing} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-700 hover:bg-red-800 rounded-full transition-colors disabled:opacity-50">
                            <Search className="w-3 h-3 text-white" />
                        </button>
                    </form>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {error && <p className="text-red-400 font-bold text-sm">{error}</p>}
                
                {!error && papers.length === 0 && !isRefreshing && (
                    <p className="text-slate-400 italic">No open-access papers found for this query.</p>
                )}

                {papers.map((paper) => (
                    <a key={paper.id} href={paper.link} target="_blank" rel="noopener noreferrer" className="block bg-white/5 border border-white/5 hover:border-red-500/30 p-6 rounded-2xl transition-all group hover:-translate-y-1">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 font-black text-[9px] uppercase tracking-widest rounded-md flex items-center">
                                <FileText className="w-3 h-3 mr-1" /> Open Access PDF
                            </span>
                            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Published: {paper.year}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <div>
                                <h4 className="text-lg lg:text-xl font-black tracking-tight leading-snug group-hover:text-red-400 transition-colors mb-1">{paper.title}</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Author: {paper.author}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-700 transition-all flex-shrink-0">
                                <ExternalLink className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

const CurrentAffairsFeed = () => {
    const [news, setNews] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCurrentAffairs = async (query = '') => {
        setIsRefreshing(true);
        
        let baseTopic = '("disability" OR "accessibility" OR "disabled") AND ("Africa" OR "Kenya" OR "India")';
        if (query) {
            baseTopic = `("${query}") AND ` + baseTopic;
        }

        try {
            const API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'DEMO_MODE';

            if (API_KEY !== 'DEMO_MODE') {
                const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(baseTopic)}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`);
                const data = await response.json();
                
                if (data.articles && data.articles.length > 0) {
                    const formattedNews = data.articles.slice(0, 5).map(article => ({
                        id: article.url,
                        source: article.source.name || "Global News",
                        title: article.title,
                        time: new Date(article.publishedAt).toLocaleDateString(),
                        link: article.url
                    }));
                    setNews(formattedNews);
                    setLastUpdated(new Date());
                    setIsRefreshing(false);
                    return; 
                }
            }
            
            throw new Error("Using fallback simulator");

        } catch (error) {
            console.warn("Using simulated news data. Please add REACT_APP_NEWS_API_KEY to your .env file for live data.");
            
            setTimeout(() => {
                const mockDatabase = [
                    { id: 1, source: "NCPWD Kenya", title: `New ${query || 'Digital'} Accessibility Grants Announced for Tech Startups in Nairobi`, time: "10 mins ago", link: "#", tags: ['digital', 'tech', 'software', 'nairobi'] },
                    { id: 2, source: "Global A11y India", title: `W3C Releases Updated WCAG 3.0 Draft for ${query || 'Cognitive'} Accessibility Standards`, time: "2 hours ago", link: "#", tags: ['cognitive', 'web', 'autism', 'adhd', 'learning'] },
                    { id: 3, source: "Policy Watch", title: `New Universal Design Transport Bill Passed in New Delhi for ${query || 'Wheelchair'} Users`, time: "5 hours ago", link: "#", tags: ['wheelchair', 'mobility', 'transport', 'physical', 'india'] },
                    { id: 4, source: "Africa Tech", title: `Startups in Rwanda Pioneer AI Translation for ${query || 'Sign Language'}`, time: "1 day ago", link: "#", tags: ['deaf', 'sign language', 'hearing', 'mute', 'rwanda'] },
                    { id: 5, source: "Health Digest", title: `Breakthrough in Affordable Prosthetics Developed by South African Engineers`, time: "2 days ago", link: "#", tags: ['prosthetic', 'amputee', 'mobility', 'south africa'] }
                ];
                
                let filtered = mockDatabase;
                if (query) {
                    filtered = mockDatabase.filter(n => 
                        n.title.toLowerCase().includes(query.toLowerCase()) || 
                        n.tags.some(t => t.includes(query.toLowerCase()))
                    );
                } else {
                    filtered = mockDatabase.slice(0, 3);
                }
                    
                setNews(filtered.length > 0 ? filtered : [{ id: 99, source: "System Alert", title: `No recent news found specifically for '${query}' in our African/Indian scope. Please try a broader term.`, time: "Just now", link: "#" }]);
                setLastUpdated(new Date());
                setIsRefreshing(false);
            }, 800);
        }
    };

    useEffect(() => {
        fetchCurrentAffairs();
        // eslint-disable-next-line
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCurrentAffairs(searchQuery);
    };

    return (
        <div className="bg-slate-950 p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] text-white shadow-xl relative overflow-hidden mb-24 border border-slate-800">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-700/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 relative z-10 gap-6">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></div>
                        <p className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px]">Live Updates: Africa & India Scope</p>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">Global & Local <br/>Current Affairs</h3>
                </div>
                
                <div className="w-full md:w-auto flex flex-col items-end">
                    <form onSubmit={handleSearch} className="flex w-full md:w-72 relative mb-3">
                        <input 
                            type="text" 
                            placeholder="Filter by disability (e.g., Deaf, Autism)" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 pl-5 pr-12 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 text-xs font-bold outline-none focus:border-red-500 transition-colors"
                        />
                        <button type="submit" disabled={isRefreshing} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-700 hover:bg-red-800 rounded-full transition-colors disabled:opacity-50">
                            <Search className="w-3 h-3 text-white" />
                        </button>
                    </form>
                    
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
                            Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <button onClick={() => fetchCurrentAffairs(searchQuery)} disabled={isRefreshing} className="flex items-center space-x-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group">
                            <RefreshCw className={`w-3 h-3 text-slate-400 group-hover:text-white ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Sync</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {news.map((item) => (
                    <a key={item.id} href={item.link} className="block bg-white/5 border border-white/5 hover:border-red-500/30 p-6 rounded-2xl transition-all group hover:-translate-y-1">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 font-black text-[9px] uppercase tracking-widest rounded-md">{item.source}</span>
                            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">{item.time}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <h4 className="text-lg lg:text-xl font-black tracking-tight leading-snug group-hover:text-red-400 transition-colors">{item.title}</h4>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-700 transition-all flex-shrink-0"><ExternalLink className="w-4 h-4 text-white" /></div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

const ResourcesPage = ({ setNotif }) => {
    return (
        <div className="py-24 max-w-7xl mx-auto px-6 text-left">
            <div className="max-w-3xl mb-20">
                <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Knowledge Base</p>
                <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">Rights <br />Library</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed italic">Access definitive legislative frameworks, live empirical data, and global open-access research.</p>
            </div>
            
            <LiveResearchFeed />
            
            <div className="mb-10 border-b border-slate-100 pb-4 mt-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Statutory Frameworks & Treaties</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-32">
                {STATIC_CONTENT.policies.map((p, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                    <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-700 group-hover:text-white transition-all"><Scale className="w-5 h-5" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{p.type} • {p.year}</span>
                    <h3 className="text-xl font-black mb-4 uppercase tracking-tight text-slate-950 leading-tight">{p.title}</h3>
                    <p className="text-slate-600 mb-8 font-medium leading-relaxed text-sm flex-grow">{p.desc}</p>
                    
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="font-black text-red-700 uppercase text-xs tracking-[0.2em] flex items-center hover:translate-x-2 transition-transform w-max">
                        ACCESS ACT <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                </div>
                ))}
            </div>

            <div className="mb-10 border-b border-slate-100 pb-4 mt-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Latest News & Grants</h3>
            </div>

            <CurrentAffairsFeed />
        </div>
    );
};

const TherapiesPage = ({ setNotif, dynamicSpecialists }) => {
    const [selected, setSelected] = useState(null);
    const [isBooking, setIsBooking] = useState(false);

    const services = [
        { 
            id: 1, title: "Clinical Physical Therapy", 
            targetRole: "Clinical Physical Therapist", 
            desc: "Advanced neuro-rehabilitation and biomechanical strength training.", icon: <Activity />, 
            detail: "Specialized clinical care focusing on increasing mobility and posture correction for individuals with motor disabilities.", 
            benefits: ["Neuro-plasticity Training", "Post-Surgical Management", "Functional Mobility Gains"],
            baseTherapists: [{ name: "Dr. Amina Abdi", role: "Lead Neuro-Physiotherapist" }]
        },
        { 
            id: 2, title: "Transition Life Coaching", 
            targetRole: "Transition Coach", 
            desc: "Bridging the gap between secondary education and corporate leadership.", icon: <GraduationCap />, 
            detail: "Intensive 1-on-1 mentorship for PWD graduates to navigate corporate hierarchies and recruitment processes.", 
            benefits: ["Professional Branding", "Workspace Rights Training", "Leadership Etiquette"],
            baseTherapists: [{ name: "Sarah Wanjiku", role: "Corporate Transition Coach" }]
        },
        { 
            id: 3, title: "Identity Counseling", 
            targetRole: "Identity Counselor", 
            desc: "Psychological support for identity transitions and family resilience.", icon: <HeartPulse />, 
            detail: "Mental health services focused on processing structural exclusion and building radical self-worth.", 
            benefits: ["Identity Reclamation", "Peer Support Networks", "Stress Resilience"],
            baseTherapists: [{ name: "Dr. Peter Omondi", role: "Clinical Psychologist" }]
        },
        { 
            id: 4, title: "Inclusion Consulting", 
            targetRole: "Inclusion Consultant", 
            desc: "Full-spectrum organizational training for global enterprises.", icon: <Briefcase />, 
            detail: "Sensitizing corporate workforces to build disability-confident ecosystems through legal and cultural shifts.", 
            benefits: ["Hiring Bias Elimination", "Infrastructure Compliance", "Culture of Belonging"],
            baseTherapists: [{ name: "David Njuguna", role: "Accessibility Auditor" }]
        }
    ];

    const hydratedServices = services.map(service => {
        const communityVols = dynamicSpecialists
            .filter(spec => spec.role === service.targetRole)
            .map(spec => ({ name: spec.name, role: `${spec.role} (Community Vol.)` }));
        return { ...service, therapists: [...service.baseTherapists, ...communityVols] };
    });

    return (
        <div className="py-24 bg-slate-50 min-h-screen px-6 text-left selection:bg-slate-900 selection:text-white">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mb-20">
                    <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Wellness Ecosystem</p>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-950 tracking-tighter leading-[0.9] mb-8 uppercase">Support</h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">Closing the gap between clinical healthcare and corporate career success.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                {hydratedServices.map(s => (
                    <button key={s.id} onClick={() => setSelected(s)} className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group flex flex-col items-start border border-white hover:border-red-50 text-left outline-none">
                        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center text-red-700 mb-8 group-hover:bg-red-700 group-hover:text-white transition-all">{s.icon}</div>
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-slate-950 leading-tight">{s.title}</h3>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed flex-grow text-base italic">"{s.desc}"</p>
                        <div className="mt-auto px-8 py-4 bg-slate-950 text-white font-black rounded-full uppercase text-[10px] tracking-[0.2em] group-hover:bg-red-700 transition-all shadow-md group-hover:-translate-y-1">VIEW PROGRAM</div>
                    </button>
                ))}
                </div>
            </div>
            
            {selected && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => {setSelected(null); setIsBooking(false);}} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-700 transition-all"><X className="w-5 h-5"/></button>
                        
                        <h3 className="text-3xl lg:text-4xl font-black mb-6 uppercase tracking-tighter text-slate-950 leading-tight pt-8">{selected.title}</h3>
                        
                        {!isBooking ? (
                            <>
                                <p className="text-base text-slate-500 mb-8 leading-relaxed font-medium">{selected.detail}</p>
                                <div className="mt-8 mb-10 border-t border-slate-100 pt-8">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 mb-4 flex items-center">
                                        <Users className="w-4 h-4 mr-2 text-red-700"/> Available Specialists
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selected.therapists.map((t, i) => (
                                            <div key={i} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mr-3 text-slate-500 flex-shrink-0"><User className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="font-black text-sm text-slate-950 leading-tight">{t.name}</p>
                                                    <p className="text-[9px] font-bold text-red-700 uppercase tracking-widest mt-1">{t.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setIsBooking(true)} className="w-full py-5 bg-red-700 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-red-800 transition-all">BOOK SESSION</button>
                            </>
                        ) : (
                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setNotif({msg: "Booking confirmed.", type: "success"}); setSelected(null); setIsBooking(false); }}>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Patient Details</label>
                                    <input placeholder="Full Legal Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-red-500 outline-none" required />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsBooking(false)} className="px-6 py-5 bg-slate-100 text-slate-500 font-black rounded-full uppercase tracking-[0.2em] text-xs hover:bg-slate-200">BACK</button>
                                    <button type="submit" className="flex-1 py-5 bg-red-700 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-red-800">CONFIRM BOOKING</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- UPDATED R&D LAB PAGE ---
const ResearchPage = ({ setNotif }) => {
    const [showRepairBooking, setShowRepairBooking] = useState(false);
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    
    const REPAIR_CENTERS = [
        { name: "Tenda Care Base Lab", location: "Nairobi Central", focus: "Full-scale hardware & PCB assessment, custom wheelchair modifications.", icon: <Settings className="w-5 h-5"/>, isBase: true },
        { name: "Kenyatta National Hospital Rehab", location: "Upper Hill, Nairobi", focus: "Orthopedic assessments and mechanical mobility device repairs.", icon: <Wrench className="w-5 h-5"/>, isBase: false },
        { name: "NCPWD Innovation Hub", location: "Westlands, Nairobi", focus: "Hearing aid calibration, digital braille servicing, and software updates.", icon: <Activity className="w-5 h-5"/>, isBase: false }
    ];

    const RD_PROJECTS = [
        { title: "Embedded GPS Tracker Systems", stage: "Prototyping", desc: "Developing STM32-based firmware and custom PCB trackers for mobility devices to ensure user safety and fleet tracking for community hardware.", tags: ["Hardware", "PCB Design"] },
        { title: "Spatial Mapping for Inclusive Housing", stage: "Field Research", desc: "Surveying the Nairobi Metropolitan Region to establish a database of affordable housing sites that meet global accessibility standards.", tags: ["Urban Planning", "Data"] },
        { title: "Tenda-Care Ecosystem Sync", stage: "Beta Testing", desc: "Building real-time database architecture to sync physical device diagnostics directly to our web platform.", tags: ["Software", "React / Node"] },
        { title: "Open-Source Haptic Glove", stage: "Research (WIP)", desc: "Empowering visually impaired users with force feedback and obstacle detection via low-cost, localize haptic devices.", tags: ["Wearables", "Arduino"] },
    ];

    const RESEARCHERS = [
        { name: "Ishmael Mwangi", role: "Lead Solutions Architect", focus: "Software/hardware integration, PCB prototyping, and bridging inclusive urban development with embedded tech." },
        { name: "Obed Tum", role: "M and E Specialist", focus: "Developing metrics, data collection systems, and impact evaluation frameworks to track the efficacy and reach of Tenda Care programs." },
        { name: "Tom Joe", role: "Senior Researcher", focus: "Leading advanced studies into assistive technology adoption, localization strategies for PWD equipment, and user-centric design principles." },
        { name: "Diana Thanya", role: "Lead Training Officer", focus: "Designing and executing comprehensive training curricula for caregivers, staff, and PWDs on assistive device usage, soft skills, and rights advocacy." }
    ];

    const nextProject = () => {
        setCurrentProjectIndex(prev => (prev + 1) % RD_PROJECTS.length);
    };

    const prevProject = () => {
        setCurrentProjectIndex(prev => (prev - 1 + RD_PROJECTS.length) % RD_PROJECTS.length);
    };

    const currentProject = RD_PROJECTS[currentProjectIndex];

    return (
        <div className="py-24 max-w-7xl mx-auto px-6 text-left min-h-screen">
            <div className="max-w-3xl mb-16">
                <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Innovation & Assessment</p>
                <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">R&D <br />Lab</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed italic">"Pioneering localized hardware solutions and inclusive research from our Nairobi base."</p>
            </div>

            {/* Repair & Assessment Centers */}
            <div className="mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
                    <div className="flex items-center">
                        <Map className="w-6 h-6 text-red-700 mr-3" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Repair Services</h3>
                    </div>
                    
                    <button 
                        onClick={() => setShowRepairBooking(true)}
                        className="flex items-center px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-black rounded-full text-xs uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Book Lab Repair
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {REPAIR_CENTERS.map((center, idx) => (
                        <div 
                            key={idx} 
                            className={`p-8 rounded-[2rem] border transition-all ${center.isBase ? 'bg-slate-950 text-white shadow-xl border-slate-800' : 'bg-slate-50 text-slate-950 border-slate-200'}`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${center.isBase ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700'}`}>
                                    {center.icon}
                                </div>
                                {center.isBase && <span className="px-3 py-1 bg-red-500/20 text-red-400 font-black text-[9px] uppercase tracking-widest rounded-full flex items-center"><Compass className="w-3 h-3 mr-1"/> HQ</span>}
                            </div>
                            <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{center.name}</h4>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center ${center.isBase ? 'text-slate-400' : 'text-slate-500'}`}><MapPin className="w-3 h-3 mr-1"/> {center.location}</p>
                            <p className={`text-sm font-medium leading-relaxed ${center.isBase ? 'text-slate-300' : 'text-slate-600'}`}>{center.focus}</p>
                            
                            {center.isBase && (
                                <button 
                                    onClick={() => setShowRepairBooking(true)}
                                    className="mt-6 w-full py-4 bg-white/10 hover:bg-red-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center border border-white/20"
                                >
                                    <Settings className="w-3 h-3 mr-2" /> INITIATE BOOKING
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Tech Development - SLIDESHOW VERSION */}
            <div className="mb-20">
                <div className="flex items-center mb-8 border-b border-slate-100 pb-4">
                    <Cpu className="w-6 h-6 text-red-700 mr-3" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Active Technology Prototyping and Research</h3>
                </div>
                
                <div className="relative group">
                    <div className="bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-100 shadow-sm transition-all group-hover:shadow-xl flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="flex-1 w-full flex flex-col">
                            <div className="flex justify-between items-start mb-6 w-full">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 font-black text-[9px] uppercase tracking-widest rounded-md">{currentProject.stage}</span>
                            </div>
                            <h4 className="text-2xl font-black mb-6 uppercase tracking-tight text-slate-950 leading-tight group-hover:text-red-700 transition-colors">{currentProject.title}</h4>
                            <p className="text-slate-600 font-medium text-base leading-relaxed mb-8 flex-grow">{currentProject.desc}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {currentProject.tags.map(tag => <span key={tag} className="text-[10px] font-black text-red-700 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 uppercase">{tag}</span>)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevProject} 
                        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all focus:outline-none"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextProject} 
                        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all focus:outline-none"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Indicators */}
                    <div className="flex justify-center space-x-2 mt-8">
                        {RD_PROJECTS.map((_, index) => (
                            <button 
                                key={index} 
                                onClick={() => setCurrentProjectIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${currentProjectIndex === index ? 'bg-red-700' : 'bg-slate-200 hover:bg-slate-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Lead Researchers - UPDATED PERSONNEL */}
            <div className="bg-slate-950 rounded-[3rem] p-10 lg:p-16 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-700/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="flex items-center mb-10 border-b border-white/10 pb-6 relative z-10">
                    <Users className="w-8 h-8 text-red-500 mr-4" />
                    <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter">Core Research Personnel</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {RESEARCHERS.map((person, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-slate-700">
                                <User className="w-10 h-10 text-slate-500" />
                            </div>
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-1">{person.name}</h4>
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-6">{person.role}</p>
                            <p className="text-slate-300 font-medium text-sm leading-relaxed border-t border-white/10 pt-4 flex-grow">
                                <span className="font-bold text-white block mb-1">Focus Area:</span>
                                {person.focus}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* REPAIR BOOKING MODAL */}
            {showRepairBooking && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => setShowRepairBooking(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-700 transition-all z-10"><X className="w-5 h-5"/></button>
                        
                        <div className="flex items-center space-x-3 mb-6 pt-4">
                            <div className="w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-lg"><Wrench className="w-6 h-6" /></div>
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-slate-950 leading-none">Book Lab Repair</h3>
                                <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest mt-1">Tenda Care Base Lab • Nairobi Central</p>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={(e) => { 
                            e.preventDefault(); 
                            setNotif({msg: "Repair booking confirmed. Bring your equipment to the Base Lab at the scheduled time.", type: "success"}); 
                            setShowRepairBooking(false); 
                        }}>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Equipment Type</label>
                                <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-red-500 outline-none appearance-none cursor-pointer">
                                    <option value="">Select Equipment...</option>
                                    <option value="wheelchair">Manual/Electric Wheelchair</option>
                                    <option value="pcb">Custom PCB / Tracking Hardware</option>
                                    <option value="hearing">Digital Hearing Aid</option>
                                    <option value="visual">Braille / Visual Tech</option>
                                    <option value="other">Other Assistive Device</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Describe the Defect / Issue</label>
                                <textarea placeholder="What exactly needs repair or assessment? (e.g., motor replacement, firmware flash, wheel alignment)" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-24 focus:border-red-500 transition-colors"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Drop-off Date</label>
                                    <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-red-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center"><Clock className="w-3 h-3 mr-1"/> Preferred Time</label>
                                    <input type="time" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-red-500 outline-none" required />
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setShowRepairBooking(false)} className="px-6 py-5 bg-slate-100 text-slate-500 font-black rounded-full uppercase tracking-[0.2em] text-xs hover:bg-slate-200">CANCEL</button>
                                <button type="submit" className="flex-1 py-5 bg-slate-950 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-slate-800">CONFIRM DROP-OFF</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ExchangePage = ({ setNotif, items, setItems }) => {
    const [view, setView] = useState('list');
    const [selectedType, setSelectedType] = useState("");
    const [search, setSearch] = useState("");
    
    // DB Items State
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    
    // Upload State
    const [imageFiles, setImageFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const filtered = useMemo(() => items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())), [items, search]);

    useEffect(() => {
        const fetchEquipment = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('equipment')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error("Error fetching equipment:", error);
            } else {
                setItems(data || []);
            }
        };
        fetchEquipment();
    }, [setItems]);

    const nextSlide = () => setCurrentSlideIndex(prev => (selectedItem?.image_urls && prev === selectedItem.image_urls.length - 1) ? 0 : prev + 1);
    const prevSlide = () => setCurrentSlideIndex(prev => (selectedItem?.image_urls && prev === 0) ? selectedItem.image_urls.length - 1 : prev - 1);

    if (view === 'donate_step1') return (
        <div className="py-24 max-w-4xl mx-auto px-6 animate-in fade-in">
            <p className="text-red-700 font-black tracking-widest uppercase mb-6 text-xs text-center">Step 01 / Category Selection</p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-950 mb-12 uppercase tracking-tighter leading-none text-center">CHOOSE DEVICE TYPE</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {DEVICE_TYPES.map((t, i) => (
                <button key={i} onClick={() => { setSelectedType(t); setView('donate_step2'); setImageFiles([]); }} className="p-6 bg-white border border-slate-200 rounded-2xl text-left hover:border-red-700 hover:shadow-lg transition-all group flex items-center justify-between">
                    <div>
                        <span className="font-black text-slate-950 group-hover:text-red-700 text-lg uppercase tracking-tight block">{t.split('(')[0]}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 block">{t.split('(')[1]?.replace(')', '') || 'Misc'}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-red-700 group-hover:translate-x-1 transition-all" />
                </button>
                ))}
            </div>
            <div className="mt-12 flex justify-center"><button onClick={() => setView('list')} className="px-8 py-4 bg-slate-100 text-slate-500 font-black uppercase text-xs tracking-widest rounded-full hover:bg-slate-200">CANCEL DONATION</button></div>
        </div>
    );

    if (view === 'donate_step2') return (
        <div className="py-24 max-w-2xl mx-auto px-6 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-4xl font-black text-slate-950 mb-10 uppercase tracking-tighter text-center leading-none">DEVICE MANIFEST</h2>
            <div className="bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-100 shadow-xl space-y-8">
                <form className="space-y-6" onSubmit={async (e) => { 
                    e.preventDefault(); 
                    setIsSubmitting(true);
                    
                    const name = e.target.elements.name.value; 
                    const condition = e.target.elements.condition.value;
                    const description = e.target.elements.description.value;
                    const defects = e.target.elements.defects.value;

                    try {
                        let uploadedUrls = [];
                        
                        if (imageFiles.length > 0) {
                            for (const file of imageFiles) {
                                const fileExt = file.name.split('.').pop();
                                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                                
                                const { error: uploadErr } = await supabase.storage
                                    .from('equipment-image') 
                                    .upload(fileName, file);
                                
                                if (uploadErr) {
                                    console.error("Storage upload error:", uploadErr);
                                    throw new Error("Failed to upload image. Check your storage bucket policies.");
                                }
                                
                                const { data: { publicUrl } } = supabase.storage
                                    .from('equipment-image')
                                    .getPublicUrl(fileName);
                                    
                                uploadedUrls.push(publicUrl);
                            }
                        }

                        let donorName = "Anonymous";
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session?.user) {
                            const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).maybeSingle();
                            if (profile && profile.full_name) donorName = profile.full_name;
                        }

                        const newRecord = {
                            name,
                            device_type: selectedType,
                            condition,
                            description,
                            defects,
                            donor: donorName,
                            image_urls: uploadedUrls
                        };

                        const { data: insertedData, error: dbError } = await supabase
                            .from('equipment')
                            .insert([newRecord])
                            .select(); 

                        if (dbError) throw dbError;

                        if (insertedData) {
                            setItems([insertedData[0], ...items]);
                        }
                        
                        setNotif({msg: "Device successfully added to the global exchange!", type: "success"}); 
                        setView('list'); 
                        setImageFiles([]);

                    } catch (err) {
                        setNotif({msg: err.message, type: "error"});
                    } finally {
                        setIsSubmitting(false);
                    }
                }}>
                    <input name="name" placeholder="Item Nomenclature (e.g. Model X)" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold focus:border-red-500" required />
                    <select name="condition" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" required>
                        <option value="">Select Overall Condition...</option>
                        <option value="Mint / Boxed">Mint / Boxed</option>
                        <option value="Minimal Wear">Minimal Wear</option>
                        <option value="Needs Minor Repair">Needs Minor Repair</option>
                    </select>
                    
                    <div className="w-full">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Visual Proof (Multiple allowed)</label>
                        <label className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer bg-slate-50 group">
                            <Upload className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-sm">Upload Device Photos</span>
                            <span className="text-xs text-slate-400 mt-1">JPEG, PNG up to 5MB</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                multiple
                                className="hidden" 
                                onChange={(e) => {
                                    if(e.target.files) {
                                        setImageFiles(Array.from(e.target.files));
                                    }
                                }} 
                            />
                        </label>
                        {imageFiles.length > 0 && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm font-bold flex-wrap gap-2">
                                <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0" />
                                {imageFiles.length} photo(s) selected
                            </div>
                        )}
                    </div>

                    <textarea name="description" placeholder="General description of the item and features..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-28 focus:border-red-500" required></textarea>
                    <textarea name="defects" placeholder="Specify any broken parts, missing pieces..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-28 focus:border-red-500" required></textarea>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-red-700 hover:bg-red-800 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg flex items-center justify-center">
                        {isSubmitting ? "UPLOADING TO CLOUD..." : "DEPLOY TO EXCHANGE"}
                    </button>
                    <button type="button" disabled={isSubmitting} onClick={() => setView('list')} className="w-full py-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-red-700">Cancel</button>
                </form>
            </div>
        </div>
    );

    return (
        <section className="py-24 bg-slate-50 px-6 min-h-screen text-left">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mb-20">
                    <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Community Logistics</p>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">The <br />Exchange</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-24">
                    <button onClick={() => setView('donate_step1')} className="bg-white p-10 rounded-[2rem] shadow-sm flex flex-col items-center text-center group border border-slate-100 hover:border-red-100 hover:-translate-y-1 transition-all outline-none w-full">
                        <div className="w-20 h-20 bg-red-50 text-red-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-700 group-hover:text-white transition-all shadow-sm"><Heart className="w-8 h-8" /></div>
                        <h3 className="text-3xl font-black text-slate-950 mb-4 uppercase tracking-tight leading-none">Donate Asset</h3>
                        <p className="text-slate-500 font-medium mb-8 max-w-xs leading-relaxed text-sm">Gift your pre-loved assistive tools to a community member in need.</p>
                    </button>
                    <div className="bg-slate-950 p-10 rounded-[2rem] shadow-xl flex flex-col items-center text-center text-white group hover:-translate-y-1 transition-all">
                        <div className="w-20 h-20 bg-white/5 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm"><Search className="w-8 h-8" /></div>
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tight leading-none">Acquire Tool</h3>
                        <div className="w-full relative mt-auto">
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search live inventory..." className="w-full py-4 px-6 bg-white/10 rounded-full text-center outline-none focus:border-red-500 font-bold text-sm text-white" />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-white p-8 lg:p-10 rounded-[2rem] h-[600px] flex flex-col shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none text-slate-950">Live Stock</h3>
                            <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-widest uppercase">{filtered.length} Items</span>
                        </div>
                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                        {filtered.length === 0 ? (<p className="text-center text-slate-400 font-medium italic mt-10">No items match your search.</p>) : (
                            filtered.map(d => (
                                <div key={d.id} className="p-4 sm:p-6 bg-slate-50 rounded-2xl flex justify-between items-center border border-transparent hover:border-slate-200 transition-all group">
                                    <div className="flex items-center max-w-[65%]">
                                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-200 items-center justify-center mr-4 overflow-hidden">
                                            {d.image_urls && d.image_urls.length > 0 ? (
                                                <img src={d.image_urls[0]} alt="thumbnail" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-4 h-4 text-slate-400" />
                                            )}
                                        </div>
                                        <div><p className="font-black text-sm sm:text-lg tracking-tight uppercase text-slate-950 mb-1 truncate">{d.name}</p><p className="text-[9px] font-black uppercase text-red-700 tracking-widest truncate">{d.device_type}</p></div>
                                    </div>
                                    <button onClick={() => { setSelectedItem(d); setCurrentSlideIndex(0); }} className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-950 text-white font-black text-[9px] sm:text-[10px] rounded-full hover:bg-red-700 uppercase tracking-[0.2em] flex items-center">
                                        <Eye className="w-3 h-3 sm:mr-2" /> <span className="hidden sm:inline">VIEW ITEM</span>
                                    </button>
                                </div>
                            ))
                        )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ITEM DETAILS MODAL & SLIDESHOW */}
            {selectedItem && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-700 transition-all z-10"><X className="w-5 h-5"/></button>
                        
                        <div className="mb-6 border-b border-slate-100 pb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-700 bg-red-50 px-3 py-1.5 rounded-md inline-flex items-center mb-4">
                                <Tag className="w-3 h-3 mr-1.5" /> {selectedItem.device_type}
                            </span>
                            <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-slate-950 leading-tight mb-3">{selectedItem.name}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Condition: <span className="text-slate-700 ml-1">{selectedItem.condition}</span>
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                    <User className="w-3 h-3 mr-1.5" /> Donor: <span className="text-slate-700 ml-1">{selectedItem.donor}</span>
                                </p>
                            </div>
                        </div>

                        {selectedItem.image_urls && selectedItem.image_urls.length > 0 && (
                            <div className="relative w-full h-64 sm:h-80 bg-slate-100 rounded-xl mb-6 overflow-hidden flex items-center justify-center group">
                                <img src={selectedItem.image_urls[currentSlideIndex]} alt={`Device view ${currentSlideIndex + 1}`} className="object-contain w-full h-full" />
                                {selectedItem.image_urls.length > 1 && (
                                    <>
                                        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-5 h-5 text-slate-900" /></button>
                                        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5 text-slate-900" /></button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
                                            {selectedItem.image_urls.map((_, idx) => (
                                                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentSlideIndex ? 'bg-red-700 w-3' : 'bg-slate-300'}`} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="space-y-6 mb-10">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 mb-2 flex items-center"><AlignLeft className="w-3 h-3 mr-2 text-slate-400" /> Description</h4>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed p-5 bg-slate-50 rounded-xl border border-slate-100">{selectedItem.description}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 mb-2 flex items-center"><Wrench className="w-3 h-3 mr-2 text-red-700"/> Known Defects / Issues</h4>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed p-5 bg-red-50 rounded-xl border border-red-100">{selectedItem.defects}</p>
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); setNotif({msg: "Inquiry sent securely to the donor.", type: "success"}); setSelectedItem(null); }} className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-white">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4 flex items-center"><MessageSquare className="w-4 h-4 mr-2 text-red-500"/> Secure Inquire & Claim</h4>
                            <textarea placeholder="Write a brief message to the donor explaining your need..." required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none resize-none font-medium text-sm h-24 focus:border-red-500 transition-colors mb-4 placeholder:text-white/30"></textarea>
                            <button type="submit" className="w-full py-4 sm:py-5 bg-red-700 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-[10px] hover:bg-red-800 transition-all flex items-center justify-center">SUBMIT INQUIRY <ArrowRight className="w-3 h-3 ml-2" /></button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

const GetInvolvedPage = ({ setNotif, onAddSpecialist }) => {
    const [view, setView] = useState('choice');
    const [role, setRole] = useState("");
    const [consentToDisplay, setConsentToDisplay] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const roles = [
        { title: "Clinical Physical Therapist", sub: "Rehabilitation support.", color: "bg-red-700" },
        { title: "Transition Coach", sub: "Career & life mentoring.", color: "bg-slate-800" },
        { title: "Identity Counselor", sub: "Mental health guidance.", color: "bg-red-950" },
        { title: "Inclusion Consultant", sub: "Corporate audits.", color: "bg-black" }
    ];

    if (view === 'signup') return (
        <div className="bg-slate-950 py-24 min-h-screen text-white flex items-center px-6 animate-in zoom-in-95 duration-500">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
                <div className="text-center lg:text-left">
                    <span className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Candidate Induction</span>
                    <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">JOIN AS <br /><span className="text-red-700 italic">{role}</span></h2>
                </div>
                
                <form className="bg-white p-8 lg:p-12 rounded-[2rem] text-slate-950 space-y-6 text-left w-full shadow-2xl" onSubmit={async (e) => { 
                    e.preventDefault(); 
                    setIsSubmitting(true);
                    
                    const name = e.target.elements.fullName.value; 
                    const email = e.target.elements.email.value;
                    const mission = e.target.elements.mission.value;

                    try {
                        const { data: existingUser } = await supabase.from('profiles').select('email').eq('email', email).maybeSingle();
                        if (existingUser) throw new Error("An account with this email already exists. Please log in first.");

                        const tempPassword = Math.random().toString(36).slice(-12) + 'Tenda1!';
                        const { data: authData, error: authError } = await supabase.auth.signUp({
                            email: email, password: tempPassword, options: { data: { full_name: name, role: role } }
                        });

                        if (authError) throw authError;

                        if (!authData.user || !authData.user.id) {
                            throw new Error("This email is already registered in the authentication system. Please switch to Log In to continue.");
                        }

                        const { error: dbError } = await supabase.from('profiles').insert([{
                            id: authData.user?.id, email: email, full_name: name, role: role, mission_statement: mission, public_consent: consentToDisplay
                        }]);

                        if (dbError) throw dbError;

                        if(consentToDisplay) onAddSpecialist({ name, role }); 
                        setNotif({msg: "Profile created! Check your email for the secure access link.", type: "success"}); 
                        setView('choice');

                    } catch (error) { setNotif({msg: error.message, type: "error"}); } finally { setIsSubmitting(false); }
                }}>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Identity Details</label>
                        <input name="fullName" placeholder="Full Legal Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-red-500 outline-none" required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Communication</label>
                        <input name="email" type="email" placeholder="Professional Email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-red-500 outline-none" required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Mission Statement</label>
                        <textarea name="mission" placeholder="Briefly describe your focus..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-32 focus:border-red-500" required></textarea>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-3 cursor-pointer" onClick={() => setConsentToDisplay(!consentToDisplay)}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 flex-shrink-0 transition-colors ${consentToDisplay ? 'bg-red-700 border-red-700 text-white' : 'bg-white border-slate-300'}`}>{consentToDisplay && <CheckCircle2 className="w-4 h-4" />}</div>
                        <div><p className="font-bold text-sm text-slate-950 leading-tight">Public Directory Consent</p><p className="text-xs text-slate-500 mt-1">I consent to having my name listed publicly.</p></div>
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-red-700 hover:bg-red-800 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg flex items-center justify-center">
                        {isSubmitting ? "PROCESSING..." : "SEND APPLICATION"}
                    </button>
                    <button type="button" onClick={() => setView('choice')} disabled={isSubmitting} className="w-full py-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-red-700">Cancel & Go Back</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="bg-red-700 py-24 min-h-screen text-white text-center flex items-center relative overflow-hidden">
            <Globe className="absolute -right-40 -top-40 w-[600px] h-[600px] text-white/5 rotate-12" />
            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <h2 className="text-6xl lg:text-[10rem] font-black mb-12 tracking-tighter uppercase leading-[0.8]">JOIN THE <br />FORCE</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {roles.map((r, i) => (
                    <button key={i} onClick={() => { setRole(r.title); setView('signup'); setConsentToDisplay(false); }} className={`${r.color} p-8 lg:p-10 rounded-[2rem] text-left group hover:-translate-y-2 transition-all shadow-xl flex flex-col justify-between min-h-[300px] relative border border-white/10`}>
                        <div><h3 className="text-3xl font-black mb-4 leading-tight uppercase tracking-tighter text-white">{r.title}</h3><p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{r.sub}</p></div>
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-slate-950 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-md mt-8"><ArrowRight className="w-6 h-6" /></div>
                    </button>
                ))}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    const [currentPage, setCurrentPage] = useState(PAGES.HOME);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notif, setNotif] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    // Global State
    const [dynamicSpecialists, setDynamicSpecialists] = useState([]);

    useEffect(() => {
        if (supabase) {
            supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setIsLoggedIn(!!session);
                if (session) setShowAuthModal(false);
            });
            return () => subscription?.unsubscribe();
        }
    }, []);

    useEffect(() => { setTimeout(() => setIsAuthReady(true), 800); }, []);
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }, [currentPage]);

    const renderPage = () => {
        if (!isAuthReady) return <div className="fixed inset-0 bg-slate-950 flex justify-center items-center"><div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div></div>;
        switch (currentPage) {
            case PAGES.THERAPIES: return <TherapiesPage setNotif={setNotif} dynamicSpecialists={dynamicSpecialists} />;
            case PAGES.GET_INVOLVED: return <GetInvolvedPage setNotif={setNotif} onAddSpecialist={(spec) => setDynamicSpecialists([...dynamicSpecialists, spec])} />;
            case PAGES.RESOURCES: return <ResourcesPage setNotif={setNotif} />;
            case PAGES.RESEARCH: return <ResearchPage setNotif={setNotif} />;
            case PAGES.EXCHANGE: return <ExchangePage setNotif={setNotif} />;
            case PAGES.HOME: return <><HeroSection setPage={setCurrentPage} /><PillarsSection /></>;
            default: return <HeroSection setPage={setCurrentPage} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-slate-950 antialiased">
            {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}
            
            <header className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-100 z-[1000] h-20 flex justify-between items-center px-6">
                <button onClick={() => setCurrentPage(PAGES.HOME)} className="flex items-center space-x-3 outline-none group">
                    <div className="w-10 h-10 bg-red-700 rounded-[10px] flex items-center justify-center shadow-md group-hover:rotate-6 transition-all"><LogoIcon /></div>
                    <span className="text-xl font-black tracking-tighter uppercase leading-none group-hover:text-red-700 transition-colors">Tenda Care</span>
                </button>
                <nav className="hidden lg:flex items-center space-x-2">
                    {NAV_ITEMS.map((item) => {
                        if (item.id === PAGES.HOME) return null; 
                        return (
                            <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`flex items-center space-x-1.5 px-4 py-2.5 font-black uppercase text-[10px] tracking-widest transition-all rounded-full ${currentPage === item.id ? 'bg-red-700 text-white shadow-md' : 'text-slate-600 hover:bg-red-50 hover:text-red-700'}`}>
                                {item.icon}<span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <button onClick={() => setShowAuthModal(true)} className="hidden lg:flex items-center space-x-2 px-5 py-2.5 text-slate-600 hover:text-red-700 font-black text-[10px] uppercase tracking-widest transition-colors"><UserCircle className="w-4 h-4" /> <span>Sign In</span></button>
                    ) : (
                        <button onClick={async () => { if(supabase) await supabase.auth.signOut(); setIsLoggedIn(false); setNotif({msg: "Logged out.", type: "info"}); }} className="hidden lg:flex items-center space-x-2 px-5 py-2.5 text-red-700 font-black text-[10px] uppercase tracking-widest transition-colors"><UserCircle className="w-4 h-4" /> <span>Logout</span></button>
                    )}
                    <button onClick={() => setCurrentPage(PAGES.GET_INVOLVED)} className="hidden lg:flex items-center space-x-2 px-6 py-2.5 bg-slate-950 hover:bg-red-700 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md"><span>JOIN ACTION</span> <ArrowRight className="w-3 h-3" /></button>
                </div>
            </header>

            <main className="flex-1 w-full pt-20">{renderPage()}</main>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    );
};

export default App;