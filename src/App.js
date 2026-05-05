import React, { useState, useEffect, useMemo } from 'react';
import { 
  Circle as LucideCircle, Globe, ShieldCheck, Users, ArrowRight, Activity, Search, Menu, X, CreditCard, MapPin, Stethoscope, Scale, Briefcase, Award, GraduationCap, HeartPulse, Heart, Download, Plus, CheckCircle2, Info, Lock, ChevronRight, RefreshCw, ExternalLink, Home, BookOpen, Microscope, ArrowRightLeft, Megaphone, Upload, Calendar, Clock, Wrench, MessageSquare, Eye, Tag, User, AlignLeft, UserCircle
} from 'lucide-react';

import Login from './components/Login'; 
import { supabase } from './supabaseClient'; 

// --- Constants & Data ---
const PAGES = { HOME: 'HOME', RESOURCES: 'RESOURCES', THERAPIES: 'THERAPIES', RESEARCH: 'RESEARCH', EXCHANGE: 'EXCHANGE', GET_INVOLVED: 'GET_INVOLVED' };

const NAV_ITEMS = [
    { id: PAGES.HOME, label: 'Home', icon: <Home className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.RESOURCES, label: 'Resources', icon: <BookOpen className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.THERAPIES, label: 'Therapies', icon: <HeartPulse className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.RESEARCH, label: 'Research', icon: <Microscope className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.EXCHANGE, label: 'Exchange', icon: <ArrowRightLeft className="w-4 h-4 mb-0.5" /> },
    { id: PAGES.GET_INVOLVED, label: 'Get Involved', icon: <Megaphone className="w-4 h-4 mb-0.5" /> }
];

const DEVICE_TYPES = ["Mobility (Wheelchairs, Crutches)", "Visual (Braille, White Canes)", "Hearing (Digital Aids, Vibrating Alarms)", "Tech (Specialized Keyboards, Screen Readers)", "Daily Living (Adapted Utensils, Reach Sticks)"];

const INITIAL_MOCK_EQUIPMENT = [
    { id: '1', type: 'donation', name: 'Standard Wheelchair', deviceType: "Mobility", condition: 'Mint / Boxed', donor: "Anonymous", timestamp: new Date().toISOString(), description: "Folding manual wheelchair with solid tires. Seat width is 18 inches. Only used indoors for two weeks.", defects: "None. Practically brand new." },
    { id: '2', type: 'donation', name: 'Braille Keyboard', deviceType: "Visual", condition: 'Minimal Wear', donor: "Elena M.", timestamp: new Date().toISOString(), description: "USB Braille keyboard compatible with Windows and Mac. All keys are tactile and responsive.", defects: "Slight scuffing on the spacebar, but 100% functional." },
];

const STATIC_CONTENT = {
    policies: [
      { title: "Constitution of Kenya (Article 54)", desc: "Guarantees the right to be treated with dignity and reasonable accommodation.", year: "2010", type: "National Law" },
      { title: "Persons with Disabilities Act", desc: "Primary legislative framework governing the rights of PWDs in Kenya.", year: "2003", type: "Statute" }
    ],
    articles: [
      { id: 1, author: "Dr. Elena Mwaniki", title: "The Digital Divide: Why Accessibility is Not Optional", excerpt: "As banking moves online, we must ensure 'digital-first' doesn't mean 'PWD-last'...", date: "Dec 15, 2023", category: "Tech Advocacy" },
    ],
    projects: [
      { id: 1, title: "Accessible Banking Initiative", status: "Active", desc: "Redesigning mobile interfaces for blind users with Tier-1 banks.", impact: "25,000+ users", tags: ["FinTech", "UX"] }
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

const CurrentAffairsFeed = () => {
    const [news, setNews] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchCurrentAffairs = async () => {
        setIsRefreshing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setNews([
                { id: Date.now() + 1, source: "NCPWD Kenya", title: "New Digital Accessibility Grants Announced for Tech Startups", time: "10 mins ago", link: "#" },
                { id: Date.now() + 2, source: "Global A11y", title: "W3C Releases Updated WCAG 3.0 Draft for Cognitive Accessibility", time: "2 hours ago", link: "#" }
            ]);
            setLastUpdated(new Date());
        } catch (error) { console.error(error); } finally { setIsRefreshing(false); }
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
                    <button onClick={fetchCurrentAffairs} disabled={isRefreshing} className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group">
                        <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-white ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sync News</span>
                    </button>
                    <p className="text-[9px] text-slate-500 font-bold tracking-widest mt-2 uppercase">Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
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
    const [view, setView] = useState('list');
    
    if (view === 'criteria') return (
        <div className="py-24 max-w-3xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8">
            <button onClick={() => setView('list')} className="mb-8 font-black text-slate-400 hover:text-red-700 uppercase text-xs tracking-[0.2em] flex items-center transition-all"><X className="mr-2 w-4 h-4" /> CANCEL</button>
            <h2 className="text-4xl font-black text-slate-950 mb-10 tracking-tighter uppercase">Vetting Criteria</h2>
            <div className="bg-white p-8 lg:p-12 rounded-[2rem] border-2 border-slate-100 shadow-xl space-y-6 mb-12">
              {[{ title: "Originality", desc: "Content must be unique and authored by the submitter." }, { title: "Inclusive Lexicon", desc: "Strict adherence to person-first and respectful language." }].map((c, i) => (
                <div key={i} className="flex items-start group">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mr-4 group-hover:bg-red-700 group-hover:text-white transition-colors flex-shrink-0"><CheckCircle2 className="w-5 h-5" /></div>
                    <div><p className="font-black uppercase text-sm text-slate-950 mb-1">{c.title}</p><p className="text-slate-500 font-medium text-sm leading-relaxed">{c.desc}</p></div>
                </div>
              ))}
            </div>
            <button onClick={() => setView('form')} className="w-full py-5 bg-red-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-red-800 transition-all">PROCEED TO FORM</button>
        </div>
    );

    if (view === 'form') return (
        <div className="py-24 max-w-3xl mx-auto px-6 animate-in fade-in">
            <h2 className="text-4xl font-black text-slate-950 mb-10 tracking-tighter uppercase text-center">ARTICLE SUBMISSION</h2>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setNotif({ msg: "Article submitted for review.", type: "success" }); setView('list'); }}>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
                <input placeholder="Full Legal Name" className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-red-500 font-bold transition-colors" required />
                <input placeholder="Proposed Article Title" className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-red-500 font-bold transition-colors" required />
                <select className="w-full p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none"><option>Policy & Law</option><option>Tech & Innovation</option></select>
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
                    <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-700 group-hover:text-white transition-all"><Scale className="w-5 h-5" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{p.type} • {p.year}</span>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-slate-950 leading-tight">{p.title}</h3>
                    <p className="text-slate-600 mb-8 font-medium leading-relaxed text-sm">{p.desc}</p>
                    <button className="font-black text-red-700 uppercase text-xs tracking-[0.2em] flex items-center hover:translate-x-2 transition-transform">ACCESS ACT <ChevronRight className="ml-2 w-4 h-4" /></button>
                </div>
                ))}
            </div>
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

const ResearchPage = ({ setNotif }) => {
    return (
        <div className="py-24 max-w-7xl mx-auto px-6 text-left min-h-screen">
            <div className="max-w-3xl mb-20">
                <p className="text-red-700 font-black tracking-widest uppercase mb-3 text-xs">Empirical Evidence</p>
                <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">Data <br />Assets</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed italic">"Numbers without narratives are empty; narratives without numbers are anecdotes."</p>
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
            </div>
        </div>
    );
};

const ExchangePage = ({ setNotif, items, setItems }) => {
    const [view, setView] = useState('list');
    const [selectedType, setSelectedType] = useState("");
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    
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
            <div className="mt-12 flex justify-center"><button onClick={() => setView('list')} className="px-8 py-4 bg-slate-100 text-slate-500 font-black uppercase text-xs tracking-widest rounded-full hover:bg-slate-200">CANCEL DONATION</button></div>
        </div>
    );

    if (view === 'donate_step2') return (
        <div className="py-24 max-w-2xl mx-auto px-6 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-4xl font-black text-slate-950 mb-10 uppercase tracking-tighter text-center leading-none">DEVICE MANIFEST</h2>
            <div className="bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-100 shadow-xl space-y-8">
                <form className="space-y-6" onSubmit={(e) => { 
                    e.preventDefault(); 
                    setItems([{id: Date.now().toString(), type: 'donation', name: e.target.elements.name.value, deviceType: selectedType, condition: e.target.elements.condition.value, description: e.target.elements.description.value, defects: e.target.elements.defects.value, donor: "You", timestamp: new Date().toISOString()}, ...items]); 
                    setNotif({msg: "Global inventory updated with your donation.", type: "success"}); 
                    setView('list'); 
                }}>
                    <input name="name" placeholder="Item Nomenclature (e.g. Model X)" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold focus:border-red-500" required />
                    <select name="condition" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" required><option value="">Select Overall Condition...</option><option value="Mint / Boxed">Mint / Boxed</option><option value="Minimal Wear">Minimal Wear</option><option value="Needs Minor Repair">Needs Minor Repair</option></select>
                    <textarea name="description" placeholder="General description of the item and features..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-28 focus:border-red-500" required></textarea>
                    <textarea name="defects" placeholder="Specify any broken parts, missing pieces..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-28 focus:border-red-500" required></textarea>
                    <button type="submit" className="w-full py-5 bg-red-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-red-800">DEPLOY TO EXCHANGE</button>
                    <button type="button" onClick={() => setView('list')} className="w-full py-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-red-700">Cancel</button>
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
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full py-4 px-6 bg-white/10 rounded-full text-center outline-none focus:border-red-500 font-bold text-sm text-white" />
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
                                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-200 items-center justify-center mr-4"><Tag className="w-4 h-4" /></div>
                                        <div><p className="font-black text-sm sm:text-lg tracking-tight uppercase text-slate-950 mb-1 truncate">{d.name}</p><p className="text-[9px] font-black uppercase text-red-700 tracking-widest truncate">{d.deviceType}</p></div>
                                    </div>
                                    <button onClick={() => setSelectedItem(d)} className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-950 text-white font-black text-[9px] sm:text-[10px] rounded-full hover:bg-red-700 uppercase tracking-[0.2em] flex items-center">
                                        <Eye className="w-3 h-3 sm:mr-2" /> <span className="hidden sm:inline">VIEW ITEM</span>
                                    </button>
                                </div>
                            ))
                        )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedItem && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-700 transition-all"><X className="w-5 h-5"/></button>
                        <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-slate-950 leading-tight mb-3 pt-4">{selectedItem.name}</h3>
                        <div className="space-y-6 mb-10 mt-6">
                            <p className="text-slate-600 font-medium text-sm leading-relaxed p-5 bg-slate-50 rounded-xl border border-slate-100">{selectedItem.description}</p>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); setNotif({msg: "Inquiry sent.", type: "success"}); setSelectedItem(null); }} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white">
                            <button type="submit" className="w-full py-4 bg-red-700 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-[10px] hover:bg-red-800">SUBMIT INQUIRY</button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

// --- UPDATED: GET INVOLVED PAGE ---
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
                        // 1. Pre-check if email already has a profile
                        const { data: existingUser } = await supabase.from('profiles').select('email').eq('email', email).maybeSingle();
                        
                        if (existingUser) {
                            throw new Error("An account with this email already exists. Please log in first to apply for a role.");
                        }

                        // 2. Generate a secure random password and Create Auth Account
                        const tempPassword = Math.random().toString(36).slice(-12) + 'Tenda1!';
                        const { data: authData, error: authError } = await supabase.auth.signUp({
                            email: email,
                            password: tempPassword,
                            options: { data: { full_name: name, role: role } }
                        });

                        if (authError) throw authError;

                        // 3. Create the Database Profile
                        const { error: dbError } = await supabase.from('profiles').insert([
                            {
                                id: authData.user?.id, 
                                email: email,
                                full_name: name,
                                role: role,
                                mission_statement: mission,
                                public_consent: consentToDisplay
                            }
                        ]);

                        // NOTE: If Row Level Security (RLS) blocks this insert, you will need to adjust your Supabase policies
                        // or handle profile creation via a Postgres Trigger on auth.users creation.
                        if (dbError) throw dbError;

                        if(consentToDisplay) { 
                            onAddSpecialist({ name, role }); 
                        }

                        setNotif({msg: "Profile created! Check your email for the secure access link.", type: "success"}); 
                        setView('choice');

                    } catch (error) {
                        console.error(error);
                        setNotif({msg: error.message, type: "error"});
                    } finally {
                        setIsSubmitting(false);
                    }
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
    
    // Global State for Dynamic Content
    const [equipmentItems, setEquipmentItems] = useState(INITIAL_MOCK_EQUIPMENT);
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
            case PAGES.EXCHANGE: return <ExchangePage setNotif={setNotif} items={equipmentItems} setItems={setEquipmentItems} />;
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