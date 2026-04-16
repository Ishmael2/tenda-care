import React, { useState, useEffect, useMemo } from 'react';
import { 
  Circle as LucideCircle, 
  Globe, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Activity, 
  Search, 
  Menu, 
  X,
  CreditCard,
  MapPin,
  Stethoscope,
  Scale,
  Briefcase,
  Award,
  GraduationCap,
  HeartPulse,
  Heart,
  Download,
  Plus,
  CheckCircle2,
  Info,
  Lock,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  // --- NEW ICONS FOR NAVIGATION ---
  Home,
  BookOpen,
  Microscope,
  ArrowRightLeft,
  Megaphone
} from 'lucide-react';

// --- Constants & Data ---
const PAGES = {
    HOME: 'HOME',
    RESOURCES: 'RESOURCES',
    THERAPIES: 'THERAPIES',
    RESEARCH: 'RESEARCH',
    EXCHANGE: 'EXCHANGE',
    GET_INVOLVED: 'GET_INVOLVED',
};

// Map pages to their display labels and icons
const NAV_ITEMS = [
    { id: PAGES.HOME, label: 'Home', icon: <Home className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.RESOURCES, label: 'Resources', icon: <BookOpen className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.THERAPIES, label: 'Therapies', icon: <HeartPulse className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.RESEARCH, label: 'Research', icon: <Microscope className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.EXCHANGE, label: 'Exchange', icon: <ArrowRightLeft className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.GET_INVOLVED, label: 'Get Involved', icon: <Megaphone className="w-4 h-4 mb-0.5" /> }
];

const DEVICE_TYPES = [
  "Mobility (Wheelchairs, Crutches)",
  "Visual (Braille, White Canes)",
  "Hearing (Digital Aids, Vibrating Alarms)",
  "Tech (Specialized Keyboards, Screen Readers)",
  "Daily Living (Adapted Utensils, Reach Sticks)"
];

const INITIAL_MOCK_EQUIPMENT = [
    { id: '1', type: 'donation', name: 'Standard Wheelchair', deviceType: "Mobility", condition: 'Excellent', donor: "Anon", timestamp: new Date().toISOString() },
    { id: '2', type: 'donation', name: 'Braille Keyboard', deviceType: "Visual", condition: 'Good', donor: "Elena", timestamp: new Date().toISOString() },
    { id: '3', type: 'donation', name: 'Digital Hearing Aid', deviceType: "Hearing", condition: 'New', donor: "John", timestamp: new Date().toISOString() },
    { id: '4', type: 'donation', name: 'Crutches (Pair)', deviceType: "Mobility", condition: 'Fair', donor: "Sam", timestamp: new Date().toISOString() }
];

const STATIC_CONTENT = {
    policies: [
      { title: "Constitution of Kenya (Article 54)", desc: "Guarantees the right to be treated with dignity and reasonable accommodation.", year: "2010", type: "National Law" },
      { title: "UN CRPD", desc: "Global human rights standards for inclusion and non-discrimination.", year: "2006", type: "International Treaty" },
      { title: "Persons with Disabilities Act", desc: "Primary legislative framework governing the rights of PWDs in Kenya.", year: "2003", type: "Statute" },
      { title: "KS 2952: Accessible ICT Standards", desc: "Technical standards for digital product accessibility in East Africa.", year: "2022", type: "Technical Standard" }
    ],
    articles: [
      { id: 1, author: "Dr. Elena Mwaniki", title: "The Digital Divide: Why Accessibility is Not Optional", excerpt: "As banking moves online, we must ensure 'digital-first' doesn't mean 'PWD-last'...", date: "Dec 15, 2023", category: "Tech Advocacy" },
      { id: 2, author: "Samuel Otieno", title: "Navigating Nairobi: A Wheelchair User's Manifesto", excerpt: "Universal design in public transport is a fundamental right to movement.", date: "Nov 28, 2023", category: "Urban Planning" }
    ],
    projects: [
      { id: 1, title: "Accessible Banking Initiative", status: "Active", desc: "Redesigning mobile interfaces for blind users with Tier-1 banks.", impact: "25,000+ users", tags: ["FinTech", "UX"] },
      { id: 2, title: "Rural Digital Literacy Hubs", status: "Completed", desc: "Solar-powered computer labs in remote areas for PWD learners.", impact: "800 graduates", tags: ["Education", "Infra"] }
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
    <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border-2 backdrop-blur-md ${
      type === 'success' ? 'bg-slate-900/90 text-white border-green-500' : 'bg-red-50/90 text-red-900 border-red-200'
    }`}>
      {type === 'success' ? <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" /> : <Info className="text-red-500 w-5 h-5 flex-shrink-0" />}
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-70 p-1"><X className="w-4 h-4" /></button>
    </div>
  </div>
);

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

const CurrentAffairsFeed = () => {
    const [news, setNews] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchCurrentAffairs = async () => {
        setIsRefreshing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const freshData = [
                { id: Date.now() + 1, source: "NCPWD Kenya", title: "New Digital Accessibility Grants Announced for Tech Startups", time: "10 mins ago", link: "#" },
                { id: Date.now() + 2, source: "Global A11y", title: "W3C Releases Updated WCAG 3.0 Draft for Cognitive Accessibility", time: "2 hours ago", link: "#" },
                { id: Date.now() + 3, source: "Policy Watch", title: "Nairobi County Assembly Debates New Universal Design Transport Bill", time: "5 hours ago", link: "#" }
            ];
            
            setNews(freshData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCurrentAffairs();
        const interval = setInterval(() => { fetchCurrentAffairs(); }, 900000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-950 p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] text-white shadow-xl relative overflow-hidden mb-24 border border-slate-800">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-700/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/10 pb-6 relative z-10">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px]">Live Updates</p>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">Global & Local <br/>Current Affairs</h3>
                </div>
                
                <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end">
                    <button 
                        onClick={fetchCurrentAffairs}
                        disabled={isRefreshing}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
                    >
                        <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-white ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sync News</span>
                    </button>
                    <p className="text-[9px] text-slate-500 font-bold tracking-widest mt-2 uppercase">
                        Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
            </div>

            <div className="space-y-4 relative z-10" aria-live="polite" aria-busy={isRefreshing}>
                {news.map((item) => (
                    <a key={item.id} href={item.link} className="block bg-white/5 border border-white/5 hover:border-red-500/30 p-6 rounded-2xl transition-all group hover:-translate-y-1">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 font-black text-[9px] uppercase tracking-widest rounded-md">
                                {item.source}
                            </span>
                            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">{item.time}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <h4 className="text-lg lg:text-xl font-black tracking-tight leading-snug group-hover:text-red-400 transition-colors">
                                {item.title}
                            </h4>
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

const ResourcesPage = ({ setNotif }) => {
    const [view, setView] = useState('list');
    
    if (view === 'criteria') return (
        <div className="py-24 max-w-3xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8">
            <button onClick={() => setView('list')} className="mb-8 font-black text-slate-400 hover:text-red-700 uppercase text-xs tracking-[0.2em] flex items-center transition-all">
                <X className="mr-2 w-4 h-4" /> CANCEL
            </button>
            <h2 className="text-4xl font-black text-slate-950 mb-10 tracking-tighter uppercase">Vetting Criteria</h2>
            <div className="bg-white p-8 lg:p-12 rounded-[2rem] border-2 border-slate-100 shadow-xl space-y-6 mb-12">
              {[
                { title: "Originality", desc: "Content must be unique and authored by the submitter." },
                { title: "Inclusive Lexicon", desc: "Strict adherence to person-first and respectful language." },
                { title: "Scalable Advocacy", desc: "Topics must address systemic solutions or deep personal insight." },
                { title: "Evidence", desc: "Data and policy references must be cited where applicable." }
              ].map((c, i) => (
                <div key={i} className="flex items-start group">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mr-4 group-hover:bg-red-700 group-hover:text-white transition-colors flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-black uppercase text-sm text-slate-950 mb-1">{c.title}</p>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">{c.desc}</p>
                    </div>
                </div>
              ))}
            </div>
            <button onClick={() => setView('form')} className="w-full py-5 bg-red-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-red-800 transition-all hover:scale-[1.02]">
                PROCEED TO FORM
            </button>
        </div>
    );

    if (view === 'form') return (
        <div className="py-24 max-w-3xl mx-auto px-6 animate-in fade-in">
            <h2 className="text-4xl font-black text-slate-950 mb-10 tracking-tighter uppercase text-center">ARTICLE SUBMISSION</h2>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setNotif({ msg: "Article submitted for review.", type: "success" }); setView('list'); }}>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
                <input placeholder="Full Legal Name" className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-red-500 font-bold transition-colors" required />
                <input placeholder="Proposed Article Title" className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-red-500 font-bold transition-colors" required />
                <select className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none">
                    <option>Policy & Law</option>
                    <option>Tech & Innovation</option>
                    <option>Living Narratives</option>
                </select>
                <textarea placeholder="Paste your article content here (min 500 words)..." className="w-full p-6 bg-white border border-slate-200 rounded-2xl outline-none focus:border-red-500 resize-none font-medium text-base leading-relaxed h-64" required></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-red-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-red-800 transition-all">SUBMIT TO EDITORIAL BOARD</button>
            </form>
        </div>
    );

    return (
        <div className="py-24 max-w-7xl mx-auto px-6 text-left">
            <div className="max-w-3xl mb-20">
                <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Knowledge Base</p>
                <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">Rights <br />Library</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed italic">Access definitive legislative frameworks, live policy updates, and advocate insights.</p>
            </div>
            
            <CurrentAffairsFeed />
            
            <div className="grid md:grid-cols-2 gap-8 mb-32">
                {STATIC_CONTENT.policies.map((p, i) => (
                <div key={i} className="bg-white p-8 lg:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-default">
                    <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-700 group-hover:text-white transition-all">
                        <Scale className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{p.type} • {p.year}</span>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-slate-950 leading-tight">{p.title}</h3>
                    <p className="text-slate-600 mb-8 font-medium leading-relaxed text-sm">{p.desc}</p>
                    <button className="font-black text-red-700 uppercase text-xs tracking-[0.2em] flex items-center hover:translate-x-2 transition-transform">
                        ACCESS ACT <ChevronRight className="ml-2 w-4 h-4" />
                    </button>
                </div>
                ))}
            </div>

            <div className="bg-slate-950 -mx-6 px-6 py-24 rounded-[3rem] md:rounded-[4rem] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                        <div>
                            <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-none">Advocate <br />Voices</h3>
                            <div className="w-16 h-1 bg-red-700 rounded-full"></div>
                        </div>
                        <button onClick={() => setView('criteria')} className="px-8 py-4 bg-red-700 rounded-full font-black uppercase text-xs tracking-widest hover:bg-red-800 transition-all shadow-lg hover:-translate-y-1">
                            PUBLISH ARTICLE
                        </button>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8">
                        {STATIC_CONTENT.articles.map(a => (
                        <div key={a.id} className="bg-white/5 p-8 lg:p-10 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all group flex flex-col">
                            <span className="text-red-500 font-black uppercase tracking-widest text-[10px] mb-6 block">{a.category}</span>
                            <h4 className="text-2xl lg:text-3xl font-black mb-6 leading-tight tracking-tight group-hover:text-red-500 transition-colors uppercase">{a.title}</h4>
                            <p className="text-slate-400 font-medium text-base leading-relaxed italic mb-8 flex-grow">"{a.excerpt}"</p>
                            <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                <div>
                                    <p className="font-black uppercase text-sm tracking-tighter">{a.author}</p>
                                    <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] mt-1">{a.date}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-700 group-hover:translate-x-2 transition-all">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TherapiesPage = ({ setNotif }) => {
    const [selected, setSelected] = useState(null);
    const services = [
        { id: 1, title: "Clinical Physical Therapy", desc: "Advanced neuro-rehabilitation and biomechanical strength training.", icon: <Activity />, detail: "Specialized clinical care focusing on increasing mobility and posture correction for individuals with motor disabilities.", benefits: ["Neuro-plasticity Training", "Post-Surgical Management", "Functional Mobility Gains"] },
        { id: 2, title: "Transition Life Coaching", desc: "Bridging the gap between secondary education and corporate leadership.", icon: <GraduationCap />, detail: "Intensive 1-on-1 mentorship for PWD graduates to navigate corporate hierarchies and recruitment processes.", benefits: ["Professional Branding", "Workspace Rights Training", "Leadership Etiquette"] },
        { id: 3, title: "Identity Counseling", desc: "Psychological support for identity transitions and family resilience.", icon: <HeartPulse />, detail: "Mental health services focused on processing structural exclusion and building radical self-worth.", benefits: ["Identity Reclamation", "Peer Support Networks", "Stress Resilience"] },
        { id: 4, title: "Inclusion Consulting", desc: "Full-spectrum organizational training for global enterprises.", icon: <Briefcase />, detail: "Sensitizing corporate workforces to build disability-confident ecosystems through legal and cultural shifts.", benefits: ["Hiring Bias Elimination", "Infrastructure Compliance", "Culture of Belonging"] }
    ];

    return (
        <div className="py-24 bg-slate-50 min-h-screen px-6 text-left selection:bg-slate-900 selection:text-white">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mb-20">
                    <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Wellness Ecosystem</p>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-950 tracking-tighter leading-[0.9] mb-8 uppercase">Support</h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">Closing the gap between clinical healthcare and corporate career success.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                {services.map(s => (
                    <div key={s.id} className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group flex flex-col items-start border border-white hover:border-red-50">
                        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center text-red-700 mb-8 group-hover:bg-red-700 group-hover:text-white transition-all">
                            {s.icon}
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-slate-950 leading-tight">{s.title}</h3>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed flex-grow text-base italic">"{s.desc}"</p>
                        <button onClick={() => setSelected(s)} className="px-8 py-4 bg-slate-950 text-white font-black rounded-full uppercase text-[10px] tracking-[0.2em] hover:bg-red-700 transition-all shadow-md hover:-translate-y-1">
                            VIEW PROGRAM
                        </button>
                    </div>
                ))}
                </div>
            </div>
            
            {/* Modal */}
            {selected && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden">
                        <button onClick={() => setSelected(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-700 transition-all"><X className="w-5 h-5"/></button>
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-red-700 text-white rounded-xl flex items-center justify-center shadow-lg">{selected.icon}</div>
                            <p className="font-black uppercase tracking-[0.2em] text-[10px] text-red-700">Detailed Prospectus</p>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-black mb-6 uppercase tracking-tighter text-slate-950 leading-tight">{selected.title}</h3>
                        <p className="text-base text-slate-500 mb-8 leading-relaxed font-medium">{selected.detail}</p>
                        <div className="space-y-4 mb-10">
                            {selected.benefits.map((b, i) => (
                                <div key={i} className="flex items-center font-black uppercase text-xs text-slate-950 tracking-wider">
                                    <CheckCircle2 className="text-green-500 mr-3 w-5 h-5 flex-shrink-0" /> 
                                    {b}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => { setNotif({msg: "Booking inquiry received.", type: "success"}); setSelected(null); }} className="w-full py-5 bg-red-700 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-red-800 transition-all">
                            SECURE CONSULTATION
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ResearchPage = ({ setNotif }) => {
    const [view, setView] = useState('list');
    
    if (view === 'staff') return (
        <div className="py-24 max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-black text-slate-950 mb-10 uppercase tracking-tighter text-center leading-none">STAFF PORTAL <br /><span className="text-red-700">UPLOAD</span></h2>
            <div className="bg-slate-950 p-8 lg:p-12 rounded-[2rem] text-white space-y-6 text-left shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-700/20 blur-2xl rounded-full"></div>
                <div className="flex items-center space-x-2"><Lock className="text-red-500 w-4 h-4" /><p className="font-black uppercase text-[10px] text-red-500 tracking-[0.2em]">Official Project Repository</p></div>
                <input placeholder="Official Study Name" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-base font-bold focus:border-red-500 outline-none transition-colors" />
                <textarea placeholder="Executive Summary..." className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl resize-none font-medium text-base min-h-[150px] outline-none focus:border-red-500" rows="4"></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Impact Magnitude" className="w-full p-5 bg-white/5 border border-white/10 rounded-xl font-bold text-sm" />
                    <input placeholder="Categories" className="w-full p-5 bg-white/5 border border-white/10 rounded-xl font-bold text-sm" />
                </div>
                <button onClick={() => { setNotif({msg: "Official Study Published.", type: "success"}); setView('list'); }} className="w-full py-5 bg-red-700 font-black uppercase text-xs tracking-[0.2em] rounded-full shadow-lg hover:bg-red-800 transition-all mt-4">PUBLISH TO PORTFOLIO</button>
                <button onClick={() => setView('list')} className="w-full text-white/30 hover:text-white font-bold uppercase text-[10px] tracking-widest text-center transition-colors mt-2">Discard Draft</button>
            </div>
        </div>
    );

    return (
        <div className="py-24 max-w-7xl mx-auto px-6 text-left">
            <div className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <div className="max-w-2xl text-left">
                    <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Empirical Evidence</p>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">Data <br />Assets</h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl italic font-serif">"Numbers without narratives are empty; narratives without numbers are anecdotes."</p>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
                    <div className="flex gap-3 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-none text-center px-6 py-2.5 bg-red-100 text-red-700 font-black rounded-full text-[10px] tracking-widest uppercase shadow-sm">24 ACTIVE</div>
                        <div className="flex-1 lg:flex-none text-center px-6 py-2.5 bg-slate-100 text-slate-700 font-black rounded-full text-[10px] tracking-widest uppercase shadow-sm">12 PUBLISHED</div>
                    </div>
                    <button onClick={() => setView('staff')} className="text-[10px] font-black text-slate-400 hover:text-red-700 tracking-[0.2em] uppercase transition-colors flex items-center">
                        <Lock className="w-3 h-3 mr-2" /> STAFF AUTHENTICATION
                    </button>
                </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6 mb-24">
                <div className="lg:col-span-2 bg-slate-950 rounded-[2rem] p-8 lg:p-12 text-white relative overflow-hidden group shadow-xl">
                    <Globe className="absolute -right-10 -bottom-10 w-80 h-80 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
                    <span className="text-red-500 font-black text-[10px] tracking-[0.3em] mb-6 block uppercase leading-none">2026 Core Audit</span>
                    <h3 className="text-4xl lg:text-5xl font-black mb-10 uppercase leading-tight tracking-tighter group-hover:text-red-500 transition-colors">DIGITAL ACCESSIBILITY <br />EAST AFRICA</h3>
                    <button onClick={() => setNotif({msg: "Transferring Report...", type: "success"})} className="px-8 py-4 bg-white text-slate-950 font-black rounded-full flex items-center hover:bg-red-700 hover:text-white transition-all uppercase text-xs tracking-[0.2em] shadow-lg relative z-10 w-max">
                        <Download className="mr-3 w-4 h-4" /> DOWNLOAD BRIEF
                    </button>
                </div>
                <div className="bg-red-700 rounded-[2rem] p-8 lg:p-12 text-white flex flex-col justify-between shadow-xl">
                    <div>
                        <Award className="w-12 h-12 mb-8 shadow-sm" />
                        <h3 className="text-2xl font-black uppercase leading-tight mb-4 tracking-tighter">IMPACT PORTFOLIO</h3>
                        <p className="text-red-100 font-medium leading-relaxed text-sm mb-8 opacity-90">Systemic initiatives designed to dismantle structural exclusion across Nairobi Central.</p>
                    </div>
                    <button onClick={() => setNotif({msg: "Feature coming soon.", type: "info"})} className="w-full py-4 bg-slate-950 text-white font-black rounded-full flex items-center justify-center uppercase text-xs tracking-[0.2em] hover:bg-slate-900 transition-all shadow-md">
                        <Plus className="mr-2 w-4 h-4" /> SUGGEST PROJECT
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {STATIC_CONTENT.projects.map(p => (
                <div key={p.id} className="bg-white p-8 lg:p-10 rounded-[2rem] border border-slate-100 hover:border-red-200 transition-all shadow-sm group">
                    <div className="flex justify-between items-start mb-8">
                        <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase text-slate-400 tracking-widest shadow-sm">{p.status}</span>
                        <div className="flex gap-2 flex-wrap justify-end">
                            {p.tags.map(t => <span key={t} className="text-[9px] font-black text-red-700 border border-red-100 px-2.5 py-1 rounded-md uppercase">{t}</span>)}
                        </div>
                    </div>
                    <h4 className="text-2xl lg:text-3xl font-black text-slate-950 mb-4 uppercase tracking-tighter leading-tight group-hover:text-red-700 transition-colors">{p.title}</h4>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed italic text-base opacity-80">"{p.desc}"</p>
                    <div className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Impact</p>
                        <p className="font-black text-red-700 uppercase tracking-tighter text-xl leading-none">{p.impact}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};

const ExchangePage = ({ setNotif, items, setItems }) => {
    const [view, setView] = useState('list');
    const [selectedType, setSelectedType] = useState("");
    const [search, setSearch] = useState("");
    
    const filtered = useMemo(() => items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())), [items, search]);

    if (view === 'donate_step1') return (
        <div className="py-24 max-w-4xl mx-auto px-6 animate-in fade-in">
            <p className="text-red-700 font-black tracking-widest uppercase mb-6 text-xs text-center">Step 01 / Category Selection</p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-950 mb-12 uppercase tracking-tighter leading-none text-center">CHOOSE DEVICE TYPE</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {DEVICE_TYPES.map((t, i) => (
                <button key={i} onClick={() => { setSelectedType(t); setView('donate_step2'); }} className="p-6 bg-white border border-slate-200 rounded-2xl text-left hover:border-red-700 hover:shadow-lg transition-all group flex items-center justify-between">
                    <div>
                        <span className="font-black text-slate-950 group-hover:text-red-700 text-lg uppercase tracking-tight block">{t.split('(')[0]}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 block">{t.split('(')[1]?.replace(')', '') || 'Misc'}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-red-700 group-hover:translate-x-1 transition-all" />
                </button>
                ))}
            </div>
            <div className="mt-12 flex justify-center">
                <button onClick={() => setView('list')} className="px-8 py-4 bg-slate-100 text-slate-500 font-black uppercase text-xs tracking-widest rounded-full hover:bg-slate-200 transition-colors">
                    CANCEL DONATION
                </button>
            </div>
        </div>
    );

    if (view === 'donate_step2') return (
        <div className="py-24 max-w-2xl mx-auto px-6 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-4xl font-black text-slate-950 mb-10 uppercase tracking-tighter text-center leading-none">DEVICE MANIFEST</h2>
            <div className="bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-100 shadow-xl space-y-8">
                <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Category: {selectedType}</p>
                </div>
                <form className="space-y-6" onSubmit={(e) => { 
                    e.preventDefault(); 
                    const name = e.target.elements.name.value; 
                    setItems([{id: Date.now().toString(), type: 'donation', name, deviceType: selectedType, condition: 'Good', donor: "You", timestamp: new Date().toISOString()}, ...items]); 
                    setNotif({msg: "Global inventory updated.", type: "success"}); 
                    setView('list'); 
                }}>
                    <input name="name" placeholder="Item Nomenclature (e.g. Model X)" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold focus:border-red-500 transition-all text-base" required />
                    <select className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-base appearance-none cursor-pointer focus:border-red-500">
                        <option>Condition: Mint / Boxed</option>
                        <option>Condition: Minimal Wear</option>
                        <option>Condition: Restored / Functional</option>
                    </select>
                    <textarea placeholder="Describe condition and features..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium text-base leading-relaxed h-32 focus:border-red-500" required></textarea>
                    <button type="submit" className="w-full py-5 bg-red-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-red-800 transition-all">
                        DEPLOY TO EXCHANGE
                    </button>
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
                    <p className="text-lg text-slate-500 font-medium leading-relaxed italic opacity-80 uppercase tracking-widest text-[10px]">Zero-barrier assistive technology matching</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-24">
                    <div className="bg-white p-10 rounded-[2rem] shadow-sm flex flex-col items-center text-center group border border-slate-100 hover:border-red-100 hover:-translate-y-1 transition-all">
                        <div className="w-16 h-16 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-700 group-hover:text-white transition-all">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-950 mb-4 uppercase tracking-tight leading-none">Donate Asset</h3>
                        <p className="text-slate-500 font-medium mb-8 max-w-xs leading-relaxed text-sm">Gift your pre-loved assistive tools to a community member in need.</p>
                        <button onClick={() => setView('donate_step1')} className="w-full py-4 bg-red-700 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-md hover:bg-red-800 transition-all">
                            START DONATION
                        </button>
                    </div>
                    <div className="bg-slate-950 p-10 rounded-[2rem] shadow-xl flex flex-col items-center text-center text-white group hover:-translate-y-1 transition-all">
                        <div className="w-16 h-16 bg-white/5 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tight leading-none">Acquire Tool</h3>
                        <p className="text-slate-400 font-medium mb-8 max-w-xs leading-relaxed text-sm">Browse our live inventory of verified assistive technology.</p>
                        <div className="w-full relative">
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full py-4 px-6 bg-white/10 rounded-full text-center outline-none border border-white/20 focus:border-red-500 transition-colors font-bold text-sm text-white placeholder:text-white/40" />
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
                        {filtered.length === 0 ? (
                            <p className="text-center text-slate-400 font-medium italic mt-10">No items match your search.</p>
                        ) : (
                            filtered.map(d => (
                                <div key={d.id} className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center border border-transparent hover:border-slate-200 transition-all">
                                    <div className="max-w-[65%]">
                                        <p className="font-black text-lg tracking-tight uppercase text-slate-950 mb-1 truncate">{d.name}</p>
                                        <p className="text-[9px] font-black uppercase text-red-700 tracking-widest truncate">{d.deviceType}</p>
                                    </div>
                                    <button onClick={() => setNotif({msg: `Claim request for ${d.name} logged.`, type: "success"})} className="px-6 py-3 bg-slate-950 text-white font-black text-[10px] rounded-full hover:bg-red-700 transition-all uppercase tracking-[0.2em]">CLAIM</button>
                                </div>
                            ))
                        )}
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-slate-950 p-10 rounded-[2rem] text-white text-center shadow-xl flex flex-col justify-center items-center">
                        <div className="relative mb-8">
                            <Users className="w-20 h-20 text-red-700 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.5]" />
                            <p className="text-7xl font-black leading-none tracking-tighter text-white">142</p>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-4 leading-tight">OPEN COMMUNITY REQUESTS</h3>
                        <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">Needy members awaiting allocation.</p>
                        <button onClick={() => setView('donate_step1')} className="w-full py-4 bg-white text-slate-950 font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-md hover:bg-red-700 hover:text-white transition-all">
                            HELP A NEIGHBOR
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const GetInvolvedPage = ({ setNotif }) => {
    const [view, setView] = useState('choice');
    const [role, setRole] = useState("");
    const roles = [
        { title: "Legal Counsel", sub: "Pro-bono policy review.", color: "bg-red-700" },
        { title: "Corporate Lead", sub: "Equity & DEI initiatives.", color: "bg-slate-800" },
        { title: "Tech Architect", sub: "Accessibility engineering.", color: "bg-red-950" },
        { title: "Global Lobbyist", sub: "International advocacy.", color: "bg-black" }
    ];

    if (view === 'signup') return (
        <div className="bg-slate-950 py-24 min-h-screen text-white flex items-center px-6 animate-in zoom-in-95 duration-500">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
                <div className="text-center lg:text-left">
                    <span className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Candidate Induction</span>
                    <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">JOIN AS <br /><span className="text-red-700 italic">{role}</span></h2>
                    <div className="hidden lg:block w-16 h-1 bg-red-700 rounded-full mb-8"></div>
                    <p className="text-lg text-slate-400 font-medium italic opacity-80 max-w-sm mx-auto lg:mx-0">"The only way to achieve inclusion is through collective force."</p>
                </div>
                <div className="bg-white p-8 lg:p-12 rounded-[2rem] text-slate-950 space-y-6 text-left w-full shadow-2xl">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Identity Details</label>
                        <input placeholder="Full Legal Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-red-500 transition-colors outline-none" required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Communication</label>
                        <input placeholder="Professional Email" type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-red-500 transition-colors outline-none" required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Mission Statement</label>
                        <textarea placeholder="Briefly describe your focus..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-32 focus:border-red-500 transition-colors"></textarea>
                    </div>
                    <button onClick={() => { setNotif({msg: "Induction request logged.", type: "success"}); setView('choice'); }} className="w-full py-5 bg-red-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-red-800 transition-all mt-4">
                        FINISH ENROLLMENT
                    </button>
                    <button onClick={() => setView('choice')} className="w-full text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-red-700 text-center transition-colors mt-2">Go Back</button>
                </div>
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
                    <button key={i} onClick={() => { setRole(r.title); setView('signup'); }} className={`${r.color} p-8 lg:p-10 rounded-[2rem] text-left group hover:-translate-y-2 transition-all shadow-xl flex flex-col justify-between min-h-[300px] relative border border-white/10`}>
                        <div>
                            <h3 className="text-3xl font-black mb-4 leading-tight uppercase tracking-tighter text-white">{r.title.split(' ')[0]} <br />{r.title.split(' ')[1]}</h3>
                            <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{r.sub}</p>
                        </div>
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-slate-950 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-md mt-8">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </button>
                ))}
                </div>
            </div>
        </div>
    );
};

// --- Main App ---

const App = () => {
    const [currentPage, setCurrentPage] = useState(PAGES.HOME);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notif, setNotif] = useState(null);
    const [equipmentItems, setEquipmentItems] = useState(INITIAL_MOCK_EQUIPMENT);

    useEffect(() => {
        const timer = setTimeout(() => setIsAuthReady(true), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMobileMenuOpen(false);
    }, [currentPage]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isMobileMenuOpen]);

    const renderPage = () => {
        if (!isAuthReady) return (
            <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-[3000]">
                <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-[10px] font-black tracking-widest uppercase animate-pulse">Initialising</p>
            </div>
        );
        
        switch (currentPage) {
            case PAGES.HOME: return <><HeroSection setPage={setCurrentPage} /><PillarsSection /></>;
            case PAGES.RESOURCES: return <ResourcesPage setNotif={setNotif} />;
            case PAGES.THERAPIES: return <TherapiesPage setNotif={setNotif} />;
            case PAGES.RESEARCH: return <ResearchPage setNotif={setNotif} />;
            case PAGES.EXCHANGE: return <ExchangePage setNotif={setNotif} items={equipmentItems} setItems={setEquipmentItems} />;
            case PAGES.GET_INVOLVED: return <GetInvolvedPage setNotif={setNotif} />;
            default: return <HeroSection setPage={setCurrentPage} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-slate-950 selection:bg-red-700 selection:text-white antialiased">
            {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}
            
            {/* --- TOP NAVIGATION BAR --- */}
            <header className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-100 z-[1000] h-20 flex justify-between items-center px-6">
                
                {/* Brand / Logo */}
                <button onClick={() => setCurrentPage(PAGES.HOME)} className="flex items-center space-x-3 outline-none group">
                    <div className="w-10 h-10 bg-red-700 rounded-[10px] flex items-center justify-center shadow-md group-hover:rotate-6 transition-all">
                        <LogoIcon />
                    </div>
                    <span className="text-xl font-black text-slate-950 tracking-tighter uppercase leading-none group-hover:text-red-700 transition-colors">Tenda Care</span>
                </button>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex items-center space-x-2">
                    {NAV_ITEMS.map((item) => {
                        if (item.id === PAGES.HOME) return null; // Hide Home from top bar since logo handles it
                        const isActive = currentPage === item.id;
                        return (
                            <button 
                                key={item.id} 
                                onClick={() => setCurrentPage(item.id)} 
                                className={`flex items-center space-x-1.5 px-4 py-2.5 font-black uppercase text-[10px] tracking-widest transition-all rounded-full ${
                                    isActive 
                                    ? 'bg-red-700 text-white shadow-md' 
                                    : 'bg-transparent text-slate-600 hover:bg-red-50 hover:text-red-700' 
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Desktop CTA & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setCurrentPage(PAGES.GET_INVOLVED)} 
                        className="hidden lg:flex items-center space-x-2 px-6 py-2.5 bg-slate-950 hover:bg-red-700 text-white text-[10px] font-black rounded-full transition-all uppercase tracking-widest shadow-md hover:-translate-y-0.5"
                    >
                        <span>JOIN ACTION</span> <ArrowRight className="w-3 h-3" />
                    </button>
                    
                    <button className="lg:hidden p-2 text-red-700 bg-red-50 rounded-lg border border-red-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
                    </button>
                </div>
            </header>

            {/* --- MOBILE DROPDOWN MENU --- */}
            <div className={`lg:hidden fixed top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl z-[990] transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100 py-6' : 'max-h-0 opacity-0 overflow-hidden py-0'}`}>
                <nav className="flex flex-col px-6 gap-3">
                    {NAV_ITEMS.map((item) => {
                        if (item.id === PAGES.HOME) return null; // Hide Home
                        const isActive = currentPage === item.id;
                        return (
                            <button 
                                key={item.id} 
                                onClick={() => {setCurrentPage(item.id); setIsMobileMenuOpen(false);}} 
                                className={`flex items-center space-x-3 w-full text-left px-5 py-4 font-black uppercase text-xs tracking-widest transition-all rounded-xl border-2 ${
                                    isActive 
                                    ? 'bg-red-700 border-red-700 text-white shadow-md' 
                                    : 'bg-white border-red-100 text-red-700 hover:bg-red-50 hover:border-red-300' 
                                }`}
                            >
                                <div className={`${isActive ? 'text-white' : 'text-red-700'}`}>
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => {setCurrentPage(PAGES.GET_INVOLVED); setIsMobileMenuOpen(false);}} 
                            className="w-full py-4 bg-slate-950 text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest shadow-md flex items-center justify-center space-x-2"
                        >
                            <span>JOIN ACTION</span> <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[980] lg:hidden top-20" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 w-full pt-20">
                {renderPage()}
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-950 text-white py-16 border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div className="lg:col-span-2 text-left">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center"><LogoIcon /></div>
                                <span className="text-2xl font-black tracking-tighter uppercase">Tenda Care</span>
                            </div>
                            <p className="text-slate-400 text-lg max-w-sm leading-snug font-bold italic mb-6 uppercase tracking-tight">
                                Global Advocacy. Built for Everyone.
                            </p>
                        </div>
                        <div className="text-left">
                            <h4 className="font-black uppercase tracking-widest text-red-700 mb-6 text-[10px]">Operational Nodes</h4>
                            <ul className="space-y-4 text-slate-300 font-bold text-xs">
                                <li className="hover:text-white cursor-pointer transition-colors flex items-center" onClick={() => setCurrentPage(PAGES.EXCHANGE)}><ArrowRightLeft className="w-3 h-3 mr-2 text-red-700"/> Device Exchange</li>
                                <li className="hover:text-white cursor-pointer transition-colors flex items-center" onClick={() => setCurrentPage(PAGES.RESOURCES)}><BookOpen className="w-3 h-3 mr-2 text-red-700"/> Legal Library</li>
                                <li className="hover:text-white cursor-pointer transition-colors flex items-center" onClick={() => setCurrentPage(PAGES.RESEARCH)}><Microscope className="w-3 h-3 mr-2 text-red-700"/> Empirical Data</li>
                            </ul>
                        </div>
                        <div className="text-left">
                            <h4 className="font-black uppercase tracking-widest text-red-700 mb-6 text-[10px]">Radical Action</h4>
                            <ul className="space-y-4 text-slate-300 font-bold text-xs">
                                <li className="hover:text-white cursor-pointer transition-colors flex items-center" onClick={() => setCurrentPage(PAGES.GET_INVOLVED)}><Megaphone className="w-3 h-3 mr-2 text-red-700"/> Join Force</li>
                                <li className="hover:text-white cursor-pointer transition-colors flex items-center" onClick={() => setNotif({msg: 'Access restricted to internal IPs.', type: 'info'})}><Lock className="w-3 h-3 mr-2 text-red-700"/> Staff Cloud</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 text-slate-500 font-bold text-[10px] tracking-widest uppercase flex flex-col xl:flex-row justify-between items-center gap-4 text-center xl:text-left">
                        <p>© 2026 Tenda Care International. All Rights Reserved.</p>
                        <p>Nairobi HQ • Interactive Web Application</p>
                    </div>
                </div>
            </footer>
            
            <style>{`
              .custom-scrollbar::-webkit-scrollbar { width: 4px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
              
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
              .animate-fade-in { animation: fade-in 0.4s ease-out; }
            `}</style>
        </div>
    );
};

export default App;