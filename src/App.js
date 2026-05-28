import React, { useState, useEffect, useMemo } from 'react';
import { 
  Circle as LucideCircle, Globe, Users, ArrowRight, Activity, Search, X, CreditCard, MapPin, Stethoscope, Scale, Briefcase, GraduationCap, HeartPulse, Heart, Plus, CheckCircle2, Info, ChevronRight, RefreshCw, ExternalLink, Home, BookOpen, Microscope, ArrowRightLeft, Megaphone, Upload, Calendar, Clock, Wrench, MessageSquare, Eye, Tag, User, AlignLeft, UserCircle, ChevronLeft, ImageIcon, FileText, Cpu, Settings, Map, Compass, Menu, ClipboardList, FileSearch, Target, Lightbulb, Phone, Mail, Handshake, BookOpenCheck, Award, Book, Library, Building2, PhoneCall, AlertTriangle
} from 'lucide-react';

import Login from './components/Login'; 
import { supabase } from './supabaseClient'; 

// --- Constants & Data ---
const PAGES = { HOME: 'HOME', RESOURCES: 'RESOURCES', THERAPIES: 'THERAPIES', RESEARCH: 'RESEARCH', EXCHANGE: 'EXCHANGE', GET_INVOLVED: 'GET_INVOLVED' };

const NAV_ITEMS = [
    { id: PAGES.HOME, label: 'Home', icon: <Home className="w-5 h-5 lg:w-4 lg:h-4 mb-0.5" /> },
    { id: PAGES.RESOURCES, label: 'Resources', icon: <BookOpen className="w-5 h-5 lg:w-4 lg:h-4 mb-0.5" /> },
    { id: PAGES.THERAPIES, label: 'Therapies', icon: <HeartPulse className="w-5 h-5 lg:w-4 lg:h-4 mb-0.5" /> },
    { id: PAGES.RESEARCH, label: 'Research Services', icon: <Microscope className="w-5 h-5 lg:w-4 lg:h-4 mb-0.5" /> },
    { id: PAGES.EXCHANGE, label: 'Exchange', icon: <ArrowRightLeft className="w-5 h-5 lg:w-4 lg:h-4 mb-0.5" /> },
    { id: PAGES.GET_INVOLVED, label: 'Get Involved', icon: <Megaphone className="w-5 h-5 lg:w-4 lg:h-4 mb-0.5" /> }
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
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-blue-600 text-white rounded-full transition-all" aria-label="Close modal">
                <X className="w-5 h-5"/>
            </button>
            <Login />
        </div>
    </div>
);

// ----------- PAGE COMPONENTS -----------

const HeroSection = ({ navigate }) => (
    <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32 selection:bg-blue-500 selection:text-white min-h-[90vh] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full bg-blue-600 blur-[140px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] rounded-full bg-blue-800 blur-[140px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
            <div className="lg:w-3/5 text-center lg:text-left">
                <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
                    <Globe className="w-4 h-4 animate-pulse" />
                    <span>Global Disability Rights Network</span>
                </div>
                <h1 className="text-5xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase">
                    NOTHING <br />ABOUT US <br />
                    <span className="text-blue-400 italic">WITHOUT US.</span>
                </h1>
                
                <div className="mb-12">
                    <p className="text-lg lg:text-xl text-white font-bold mb-3 leading-relaxed">
                        Tenda Care is a disability advocacy and innovation hub serving people with lived experience of disability, their caretakers, and allies across Africa.
                    </p>
                    <p className="text-base lg:text-lg text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                        Whether you are navigating daily challenges or caring for a loved one, we are here. We design localized assistive technologies, conduct evidence-based research, provide specialized therapies, and champion inclusive policies.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <button onClick={() => navigate(PAGES.GET_INVOLVED)} className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full shadow-2xl shadow-blue-900/40 transition-all flex items-center justify-center uppercase tracking-widest text-xs hover:-translate-y-1">
                        JOIN THE MOVEMENT <ArrowRight className="ml-3 w-4 h-4" />
                    </button>
                    <button onClick={() => navigate(PAGES.RESOURCES)} className="w-full sm:w-auto px-10 py-5 bg-white/5 border-2 border-slate-800 hover:border-slate-600 text-white font-black rounded-full transition-all uppercase tracking-widest text-xs hover:bg-white/10">
                        LEARN OUR STRATEGY
                    </button>
                </div>
            </div>
            <div className="hidden lg:flex w-1/3 justify-center relative">
                <div className="w-80 h-80 rounded-[3rem] bg-gradient-to-br from-blue-600 to-blue-950 rotate-12 flex items-center justify-center shadow-[0_0_100px_rgba(37,99,235,0.2)] relative group overflow-hidden">
                    <LucideCircle className="w-48 h-48 text-white/10 absolute fill-current group-hover:scale-125 transition-transform duration-1000" />
                    <Users className="w-32 h-32 text-white relative z-10" />
                </div>
            </div>
        </div>
    </section>
);

const AboutSection = ({ navigate }) => {
    return (
        <section className="py-24 bg-slate-50 relative border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <div>
                        <p className="text-blue-600 font-black tracking-widest uppercase mb-3 text-xs">About Tenda Care</p>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-950 mb-10 tracking-tighter uppercase leading-none">Identity & <br />Purpose</h2>
                        
                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0"><Target className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-950 mb-2 uppercase">Our Mission</h4>
                                    <p className="text-slate-600 font-medium leading-relaxed">To engineer equitable ecosystems where people with lived experience of disability and their caretakers have the tools, rights, and opportunities to thrive independently through localized technology and policy advocacy.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mr-4 flex-shrink-0"><Lightbulb className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-950 mb-2 uppercase">Our Vision</h4>
                                    <p className="text-slate-600 font-medium leading-relaxed">A universally accessible world designed with, and for, everyone—where disability is never a barrier to full societal participation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 lg:p-10 rounded-[2rem] shadow-xl border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-950 mb-8 uppercase tracking-tighter border-b border-slate-100 pb-4">Contact & Location</h3>
                        <div className="space-y-6">
                            <div className="flex items-center text-slate-600 font-medium">
                                <MapPin className="w-5 h-5 mr-4 text-blue-600" />
                                <span><strong>Tenda Care Base Lab</strong><br/>Nairobi Central, Nairobi County, Kenya</span>
                            </div>
                            <div className="flex items-center text-slate-600 font-medium">
                                <Mail className="w-5 h-5 mr-4 text-blue-600" />
                                <span>hello@tendacare.org</span>
                            </div>
                            <div className="flex items-center text-slate-600 font-medium">
                                <Phone className="w-5 h-5 mr-4 text-blue-600" />
                                <span>+254 (0) 700 000 000</span>
                            </div>
                            <div className="flex items-center text-slate-600 font-medium pt-4 border-t border-slate-100">
                                <Users className="w-5 h-5 mr-4 text-blue-600" />
                                <span>View our <strong className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(PAGES.GET_INVOLVED)}>Core Research Team</strong> on the Get Involved page.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Partners Ribbon */}
                <div className="pt-10 border-t border-slate-200">
                    <div className="flex items-center justify-center mb-8">
                        <Handshake className="w-5 h-5 text-slate-400 mr-3" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Co-Designing with Global Partners</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="text-xl font-black text-slate-800 uppercase tracking-tighter">NCPWD Kenya</div>
                        <div className="text-xl font-black text-slate-800 uppercase tracking-tighter">Global A11y</div>
                        <div className="text-xl font-black text-slate-800 uppercase tracking-tighter">OpenAlex</div>
                        <div className="text-xl font-black text-slate-800 uppercase tracking-tighter">UN CRPD</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const PillarsSection = () => {
    const [activePillar, setActivePillar] = useState(0);

    const pillars = [
        { 
            id: '01', title: "Economic Independence", icon: <CreditCard className="w-6 h-6" />, color: "bg-blue-600",
            desc: "Building inclusive employment pathways and entrepreneurial grant systems to ensure financial autonomy for PWDs.",
            activities: ["Micro-grant disbursements for PWD-led businesses.", "Vocational tech training and certification.", "Corporate placement drives and inclusive hiring audits."],
            achievements: "Seed-funded 45 PWD-led startups in the Nairobi metropolitan area in 2025."
        },
        { 
            id: '02', title: "Universal Access", icon: <MapPin className="w-6 h-6" />, color: "bg-slate-800",
            desc: "Advocating for 100% accessibility in transit, digital spaces, and architecture.",
            examples: "What this means in practice: Installing gentle ramps instead of stairs, laying tactile paving on sidewalks for the visually impaired, coding screen-reader optimized websites, and implementing auditory signals at pedestrian crosswalks.",
            activities: ["Architectural accessibility audits for public/private spaces.", "Lobbying for universally designed public transport."],
            achievements: "Successfully retrofitted 12 public county buildings in Nairobi with universal design standards."
        },
        { 
            id: '03', title: "Healthcare Equity", icon: <Stethoscope className="w-6 h-6" />, color: "bg-blue-800",
            desc: "Ensuring specialized rehabilitation, clinical assessments, and therapy services are accessible and localized.",
            activities: ["Subsidized clinical physical therapy sessions.", "Mental health and identity support groups for PWDs and families.", "Local manufacturing of affordable prosthetic devices."],
            achievements: "Provided free clinical assessments and therapy sessions to over 2,000 community members."
        },
        { 
            id: '04', title: "Policy Leadership", icon: <Scale className="w-6 h-6" />, color: "bg-slate-900",
            desc: "Empowering PWDs to take lead seats in legislative bodies and decision-making tables.",
            activities: ["Civic education and advocacy training.", "Drafting policy briefs based on ground data.", "Providing legal aid for discrimination cases."],
            achievements: "Co-drafted key inclusive amendments for the 2025 Persons with Disabilities Act."
        },
        { 
            id: '05', title: "Collaborative Research", icon: <BookOpenCheck className="w-6 h-6" />, color: "bg-blue-950",
            desc: "Using rigorous qualitative and quantitative research to inform policy and co-create inclusive, sustainable solutions.",
            activities: ["Conducting participatory co-design workshops with stakeholders.", "Community-led quantitative data collection.", "Monitoring and evaluating impact to ensure local ownership of solutions."],
            achievements: "Published 3 open-access empirical papers mapping spatial accessibility and established a community data registry."
        }
    ];

    const current = pillars[activePillar];

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 text-left max-w-2xl">
                    <p className="text-blue-600 font-black tracking-widest uppercase mb-3 text-xs">Mission Framework</p>
                    <h2 className="text-4xl lg:text-6xl font-black text-slate-950 mb-6 tracking-tighter uppercase leading-none">THE FIVE PILLARS <br />OF RADICAL CHANGE</h2>
                    <div className="w-24 h-2 bg-blue-600 rounded-full"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side: Tabs */}
                    <div className="w-full lg:w-1/3 flex flex-col space-y-3">
                        {pillars.map((p, index) => (
                            <button 
                                key={p.id}
                                onClick={() => setActivePillar(index)}
                                className={`flex items-center text-left p-5 rounded-2xl transition-all border ${activePillar === index ? 'bg-slate-950 text-white border-slate-900 shadow-xl scale-105 z-10' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-white'}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${activePillar === index ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {p.icon}
                                </div>
                                <div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${activePillar === index ? 'text-blue-400' : 'text-slate-400'}`}>Pillar {p.id}</span>
                                    <h3 className="font-black tracking-tight text-lg leading-none">{p.title}</h3>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right Side: Content Display */}
                    <div className="w-full lg:w-2/3 bg-slate-50 p-8 lg:p-12 rounded-[3rem] border border-slate-100 relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-3xl lg:text-4xl font-black text-slate-950 mb-6 uppercase tracking-tighter leading-tight">{current.title}</h3>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8 pb-8 border-b border-slate-200">{current.desc}</p>
                            
                            {current.examples && (
                                <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start">
                                    <Info className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-bold text-blue-900 leading-relaxed">{current.examples}</p>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center"><Activity className="w-3 h-3 mr-2" /> Core Activities</h4>
                                    <ul className="space-y-4">
                                        {current.activities.map((act, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 mr-3 flex-shrink-0"></div>
                                                <span className="text-sm font-medium text-slate-600 leading-relaxed">{act}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center"><Award className="w-3 h-3 mr-2" /> Achievements</h4>
                                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                        <p className="text-sm font-bold text-slate-800 leading-relaxed">{current.achievements}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CoreTeamSection = () => {
    const RESEARCHERS = [
        { name: "Ishmael Mwangi", role: "Lead Solutions Architect", focus: "Software/hardware integration, PCB prototyping, and bridging inclusive urban development with embedded tech." },
        { name: "Obed Tum", role: "M and E Specialist", focus: "Developing metrics, data collection systems, and impact evaluation frameworks to track the efficacy and reach of Tenda Care programs." },
        { name: "Tom Joe", role: "Senior Researcher", focus: "Leading advanced studies into assistive technology adoption, localization strategies for equipment, and user-centric design principles." },
        { name: "Diana Thanya", role: "Lead Training Officer", focus: "Designing and executing comprehensive training curricula for caregivers, staff, and advocates on assistive device usage, soft skills, and rights advocacy." }
    ];

    return (
        <div className="bg-slate-950 py-24 text-white relative overflow-hidden border-t-8 border-blue-600">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex items-center mb-16 border-b border-white/10 pb-6">
                    <Users className="w-8 h-8 text-blue-500 mr-4" />
                    <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">Core Research Personnel</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {RESEARCHERS.map((person, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors flex flex-col items-center text-center shadow-2xl">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-slate-700">
                                <User className="w-10 h-10 text-slate-500" />
                            </div>
                            <h4 className="text-2xl font-black uppercase tracking-tight mb-1">{person.name}</h4>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">{person.role}</p>
                            <p className="text-slate-300 font-medium text-sm leading-relaxed border-t border-white/10 pt-4 flex-grow">
                                <span className="font-bold text-white block mb-1">Focus Area:</span>
                                {person.focus}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EmergencyContacts = () => {
    const contacts = [
        { title: "National Emergency / Police", number: "999 / 112 / 911", desc: "General emergency response and police dispatch." },
        { title: "Kenya Red Cross Ambulance", number: "1199", desc: "For critical medical emergencies and ambulance services." },
        { title: "Gender-Based Violence Hotline", number: "1195", desc: "Toll-free. Safe support for victims of abuse or violence." },
        { title: "NCPWD Kenya Support", number: "0800 700 300", desc: "National Council for Persons with Disabilities toll-free line." }
    ];

    return (
        <div className="bg-red-50 border border-red-200 rounded-[2rem] p-8 lg:p-12 mb-20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center space-x-3 mb-8 border-b border-red-200 pb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 animate-pulse" />
                <h3 className="text-2xl lg:text-3xl font-black text-red-900 uppercase tracking-tighter">Emergency Contacts (Kenya)</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
                {contacts.map((contact, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-red-100 flex items-start shadow-sm">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-4 flex-shrink-0">
                            <PhoneCall className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-950 uppercase tracking-tight mb-1">{contact.title}</h4>
                            <p className="text-2xl font-black text-red-600 mb-2">{contact.number}</p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{contact.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LiveBooksFeed = () => {
    const [books, setBooks] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('disability rights');
    const [error, setError] = useState(null);

    const fetchBooks = async (query) => {
        setIsRefreshing(true);
        setError(null);
        
        const searchTerms = encodeURIComponent(query);
        const apiUrl = `https://openlibrary.org/search.json?q=${searchTerms}&limit=4`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch from Open Library");
            
            const data = await response.json();
            
            if (data.docs && data.docs.length > 0) {
                const formattedData = data.docs.map(book => ({
                    id: book.key,
                    title: book.title,
                    author: book.author_name ? book.author_name[0] : "Unknown Author",
                    year: book.first_publish_year || "N/A",
                    cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
                    link: `https://openlibrary.org${book.key}`
                }));
                setBooks(formattedData);
            } else {
                setBooks([]);
            }
        } catch (err) {
            console.error("API Error:", err);
            setError("Could not load live book library at this time.");
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBooks(searchQuery);
        // eslint-disable-next-line
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks(searchQuery);
    };

    return (
        <div className="bg-slate-50 p-8 lg:p-12 rounded-[2rem] border border-slate-200 mb-20 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 pb-6 gap-6">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
                        <p className="text-green-600 font-black uppercase tracking-[0.3em] text-[10px]">Live Data: Open Library API</p>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-slate-950 flex items-center">
                        <Library className="w-8 h-8 mr-3 text-blue-600"/> Resource Library
                    </h3>
                </div>
                
                <form onSubmit={handleSearch} className="flex w-full md:w-80 relative">
                    <input 
                        type="text" 
                        placeholder="Search books (e.g., Autism, Inclusion)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3 pl-5 pr-12 bg-white border border-slate-300 rounded-full text-slate-950 text-xs font-bold outline-none focus:border-blue-600 transition-colors shadow-sm"
                    />
                    <button type="submit" disabled={isRefreshing} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50">
                        <Search className="w-3 h-3 text-white" />
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
                {!error && books.length === 0 && !isRefreshing && (
                    <p className="text-slate-500 italic">No books found for this query.</p>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {books.map((book) => (
                        <a key={book.id} href={book.link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-white border border-slate-100 hover:border-blue-300 p-4 rounded-2xl transition-all group hover:shadow-md">
                            <div className="w-16 h-24 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden mr-4">
                                {book.cover ? (
                                    <img src={book.cover} alt="cover" className="w-full h-full object-cover" />
                                ) : (
                                    <Book className="w-6 h-6 text-slate-300" />
                                )}
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-sm font-black tracking-tight leading-snug group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">{book.title}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">By: {book.author}</p>
                                <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Pub: {book.year}</span>
                            </div>
                            <div className="ml-2 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-all flex-shrink-0">
                                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SupportOrganizationsDir = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Hardcoded highly relevant directory data to ensure high-quality, safe results
    const directory = [
        { name: "Kenya Society for the Blind (KSB)", scope: "National", focus: "Visual Impairment", contact: "info@ksb.or.ke" },
        { name: "Autism Society of Kenya (ASK)", scope: "National", focus: "Autism Spectrum", contact: "autismkenya@gmail.com" },
        { name: "Association for the Physically Disabled of Kenya (APDK)", scope: "National", focus: "Physical/Mobility", contact: "info@apdk.org" },
        { name: "Global Disability Innovation Hub (GDI Hub)", scope: "Global", focus: "Assistive Tech & Innovation", contact: "hello@disabilityinnovation.com" },
        { name: "CBM Global Disability Inclusion", scope: "Global", focus: "Community Based Rehabilitation", contact: "contact@cbm-global.org" },
        { name: "Kenya National Association of the Deaf (KNAD)", scope: "National", focus: "Hearing Impairment", contact: "info@knad.org" },
    ];

    const filtered = directory.filter(org => 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        org.focus.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
                <div className="flex items-center">
                    <Building2 className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Support Organizations Directory</h3>
                </div>
                <div className="w-full sm:w-64 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Filter by focus or name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-full text-slate-950 text-xs font-bold outline-none focus:border-blue-600 transition-colors"
                    />
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((org, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded w-max mb-3 ${org.scope === 'Global' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {org.scope}
                        </span>
                        <h4 className="text-lg font-black uppercase tracking-tight text-slate-950 mb-1 leading-tight">{org.name}</h4>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-4 flex-grow">{org.focus}</p>
                        <div className="pt-4 border-t border-slate-100 flex items-center text-sm font-medium text-slate-500">
                            <Mail className="w-4 h-4 mr-2" /> {org.contact}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <p className="text-slate-500 italic col-span-full">No organizations match your search filter.</p>}
            </div>
        </div>
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
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            
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
                            className="w-full py-3 pl-5 pr-12 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 text-xs font-bold outline-none focus:border-blue-500 transition-colors"
                        />
                        <button type="submit" disabled={isRefreshing} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50">
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
                    <a key={paper.id} href={paper.link} target="_blank" rel="noopener noreferrer" className="block bg-white/5 border border-white/5 hover:border-blue-500/30 p-6 rounded-2xl transition-all group hover:-translate-y-1">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 font-black text-[9px] uppercase tracking-widest rounded-md flex items-center">
                                <FileText className="w-3 h-3 mr-1" /> Open Access PDF
                            </span>
                            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Published: {paper.year}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <div>
                                <h4 className="text-lg lg:text-xl font-black tracking-tight leading-snug group-hover:text-blue-400 transition-colors mb-1">{paper.title}</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Author: {paper.author}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all flex-shrink-0">
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
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 relative z-10 gap-6">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
                        <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]">Live Updates: Africa & India Scope</p>
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
                            className="w-full py-3 pl-5 pr-12 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 text-xs font-bold outline-none focus:border-blue-500 transition-colors"
                        />
                        <button type="submit" disabled={isRefreshing} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50">
                            <Search className="w-3 h-3 text-white" />
                        </button>
                    </form>
                    
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
                            Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <button onClick={() => fetchCurrentAffairs(searchQuery)} disabled={isRefreshing} className="flex items-center space-x-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group">
                            <RefreshCw className={`w-3 h-3 text-slate-400 group-hover:text-white ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Sync</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {news.map((item) => (
                    <a key={item.id} href={item.link} className="block bg-white/5 border border-white/5 hover:border-blue-500/30 p-6 rounded-2xl transition-all group hover:-translate-y-1">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-black text-[9px] uppercase tracking-widest rounded-md">{item.source}</span>
                            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">{item.time}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <h4 className="text-lg lg:text-xl font-black tracking-tight leading-snug group-hover:text-blue-400 transition-colors">{item.title}</h4>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all flex-shrink-0"><ExternalLink className="w-4 h-4 text-white" /></div>
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
            <div className="max-w-3xl mb-16">
                <p className="text-blue-600 font-black tracking-widest uppercase mb-3 text-xs">Knowledge Base</p>
                <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">Rights & <br />Resources</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed italic">Access emergency contacts, support directories, live book libraries, and statutory frameworks.</p>
            </div>

            <EmergencyContacts />
            <SupportOrganizationsDir />
            <LiveBooksFeed />
            <LiveResearchFeed />
            
            <div className="mb-10 border-b border-slate-100 pb-4 mt-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Statutory Frameworks & Treaties</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-32">
                {STATIC_CONTENT.policies.map((p, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all"><Scale className="w-5 h-5" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{p.type} • {p.year}</span>
                    <h3 className="text-xl font-black mb-4 uppercase tracking-tight text-slate-950 leading-tight">{p.title}</h3>
                    <p className="text-slate-600 mb-8 font-medium leading-relaxed text-sm flex-grow">{p.desc}</p>
                    
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="font-black text-blue-600 uppercase text-xs tracking-[0.2em] flex items-center hover:translate-x-2 transition-transform w-max">
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

    const pwdServices = [
        { 
            id: 101, title: "Occupational Therapy (OT)", category: "PWD Support",
            targetRole: "Occupational Therapist", icon: <Activity />, 
            desc: "Helps individuals perform daily life activities independently.", 
            detail: "A specialized therapy focusing on enabling independent living and daily functioning.", 
            supports: ["Sensory regulation", "Fine motor skills", "Hand coordination", "Feeding skills", "Dressing and grooming", "Classroom participation", "Adaptive equipment use"],
            commonlyNeededFor: ["Autism", "ADHD", "Cerebral palsy", "Down syndrome", "Stroke recovery", "Developmental delays"],
            baseTherapists: [{ name: "Dr. Amina Abdi", role: "Lead Occupational Therapist" }]
        },
        { 
            id: 102, title: "Physical Therapy", category: "PWD Support",
            targetRole: "Physical Therapist", icon: <Activity />, 
            desc: "Improves movement, posture, strength, balance, and mobility.", 
            detail: "Specialized clinical care focusing on increasing mobility, strength, and posture correction.", 
            supports: ["Walking training", "Muscle strengthening", "Joint mobility", "Posture correction", "Pain management", "Wheelchair positioning"],
            commonlyNeededFor: ["Cerebral palsy", "Spinal cord injuries", "Amputees", "Muscular disorders", "Stroke patients"],
            baseTherapists: [{ name: "Dr. Peter Omondi", role: "Lead Physiotherapist" }]
        },
        { 
            id: 103, title: "Speech & Language Therapy", category: "PWD Support",
            targetRole: "Speech Pathologist", icon: <MessageSquare />, 
            desc: "Supports communication and swallowing abilities.", 
            detail: "Therapy designed to address challenges with language development, articulation, and safe swallowing.", 
            supports: ["Speech clarity", "Language development", "Non-verbal communication", "AAC devices", "Social communication", "Feeding/swallowing therapy"],
            commonlyNeededFor: ["Autism", "Hearing impairment", "Stroke recovery", "Developmental disorders", "Intellectual disabilities"],
            baseTherapists: [{ name: "Sarah Wanjiku", role: "Speech-Language Pathologist" }]
        },
        { 
            id: 104, title: "Behavioral Therapy", category: "PWD Support",
            targetRole: "Behavioral Therapist", icon: <HeartPulse />, 
            desc: "Improves behavior, emotional regulation, and learning patterns.", 
            detail: "A structured approach to understanding and improving behavioral responses and emotional control.", 
            supports: ["Attention improvement", "Emotional control", "Routine building", "Positive behavior reinforcement", "Social interaction"],
            commonlyNeededFor: ["Autism", "ADHD", "Behavioral disorders", "Anxiety-related conditions"],
            baseTherapists: [{ name: "David Njuguna", role: "Behavioral Specialist" }]
        },
        { 
            id: 105, title: "Sensory Integration Therapy", category: "PWD Support",
            targetRole: "Sensory Specialist", icon: <Eye />, 
            desc: "Helps individuals process sensory information properly.", 
            detail: "Therapy designed to help the brain better process and respond to sensory information.", 
            supports: ["Sound sensitivity", "Touch sensitivity", "Balance and movement", "Focus and self-regulation"],
            commonlyNeededFor: ["Autism", "ADHD", "Sensory Processing Disorder"],
            baseTherapists: [{ name: "Dr. Elena Mwaniki", role: "Sensory Integration Therapist" }]
        },
        { 
            id: 106, title: "Psychotherapy / Counseling", category: "PWD Support",
            targetRole: "Clinical Psychologist", icon: <Heart />, 
            desc: "Supports emotional and mental wellbeing.", 
            detail: "Mental health services focused on processing structural exclusion, trauma, and building radical self-worth.", 
            supports: ["Anxiety management", "Depression support", "Trauma support", "Family counseling", "Self-esteem building"],
            commonlyNeededFor: ["PWDs experiencing emotional distress", "Families and caregivers"],
            baseTherapists: [{ name: "Dr. Peter Omondi", role: "Clinical Psychologist" }]
        },
        { 
            id: 107, title: "Special Needs Education Support", category: "PWD Support",
            targetRole: "Special Education Expert", icon: <BookOpen />, 
            desc: "Supports learning adaptation and educational inclusion.", 
            detail: "Tailored educational strategies to ensure inclusive, effective learning environments.", 
            supports: ["Individualized learning plans", "Assistive learning methods", "Functional academics", "Classroom adaptation"],
            commonlyNeededFor: ["Intellectual disabilities", "Autism", "Learning disabilities", "ADHD"],
            baseTherapists: [{ name: "Diana Thanya", role: "Lead Training Officer" }]
        },
        { 
            id: 108, title: "Assistive Technology Training", category: "PWD Support",
            targetRole: "Assistive Tech Specialist", icon: <Cpu />, 
            desc: "Training on tools that improve independence and mobility.", 
            detail: "Hands-on guidance for utilizing hardware and software. This area strongly connects with Rehabilitation Engineering, Inclusive STEM, Prosthetics development, and Adaptive devices.", 
            supports: ["Wheelchair usage", "Prosthetics", "Hearing aids", "Screen readers", "Communication devices", "Smart assistive systems"],
            commonlyNeededFor: ["All PWDs requiring tech adaptation"],
            baseTherapists: [{ name: "Ishmael Mwangi", role: "Lead Solutions Architect" }]
        },
        { 
            id: 109, title: "Vocational Therapy / Life Skills", category: "PWD Support",
            targetRole: "Vocational Coach", icon: <Briefcase />, 
            desc: "Prepares PWDs for independent living and employment.", 
            detail: "Bridging the gap between secondary education and corporate leadership or independent entrepreneurship.", 
            supports: ["Job readiness", "Financial literacy", "Communication skills", "Technical skills", "Entrepreneurship"],
            commonlyNeededFor: ["Adults and transitioning youth"],
            baseTherapists: [{ name: "Tom Joe", role: "Vocational Coach" }]
        }
    ];

    const caregiverServices = [
        { 
            id: 201, title: "Caregiver Mental Health Support", category: "Caregiver Support",
            targetRole: "Counselor", icon: <HeartPulse />, 
            desc: "Counseling to manage the emotional demands of caregiving.", 
            detail: "Caregivers require structured support because caregiving can lead to burnout, emotional stress, and financial strain. We provide safe spaces for emotional processing.", 
            supports: ["Burnout prevention", "Stress management", "Emotional fatigue recovery", "Anxiety and depression counseling"],
            baseTherapists: [{ name: "Dr. Peter Omondi", role: "Clinical Psychologist" }]
        },
        { 
            id: 202, title: "Parent / Caregiver Training", category: "Caregiver Support",
            targetRole: "Training Officer", icon: <GraduationCap />, 
            desc: "Teaching caregivers how to support therapy goals at home.", 
            detail: "Empowering families with the skills needed to reinforce clinical therapies within the home environment safely.", 
            supports: ["Behavior management", "Communication strategies", "Sensory regulation techniques", "Daily routine structuring", "Feeding support"],
            baseTherapists: [{ name: "Diana Thanya", role: "Lead Training Officer" }]
        },
        { 
            id: 203, title: "Respite Care Services", category: "Caregiver Support",
            targetRole: "Respite Coordinator", icon: <Clock />, 
            desc: "Temporary caregiving support to allow caregivers to rest.", 
            detail: "Long-term caregiving without breaks causes exhaustion. We coordinate safe, temporary care so primary caretakers can recharge.", 
            supports: ["Temporary supervision", "Emergency coverage", "Weekend care coordination"],
            baseTherapists: [{ name: "Sarah Wanjiku", role: "Respite Coordinator" }]
        },
        { 
            id: 204, title: "Caregiver Support Groups", category: "Caregiver Support",
            targetRole: "Group Facilitator", icon: <Users />, 
            desc: "Peer learning and emotional support networks.", 
            detail: "Facilitated community groups that bring caretakers together to share knowledge and reduce isolation.", 
            supports: ["Shared experiences", "Reduced isolation", "Practical caregiving tips", "Community building"],
            baseTherapists: [{ name: "David Njuguna", role: "Community Facilitator" }]
        },
        { 
            id: 205, title: "Financial & Social Support Services", category: "Caregiver Support",
            targetRole: "Social Worker", icon: <CreditCard />, 
            desc: "Navigating grants, insurance, and government assistance.", 
            detail: "Expert guidance to help families access the financial and social frameworks designed to support them.", 
            supports: ["Disability funding guidance", "Insurance support", "Government assistance navigation", "Employment flexibility advocacy"],
            baseTherapists: [{ name: "Tom Joe", role: "Social Services Navigator" }]
        }
    ];

    const hydrateService = (service) => {
        const communityVols = dynamicSpecialists
            .filter(spec => spec.role === service.targetRole)
            .map(spec => ({ name: spec.name, role: `${spec.role} (Community Vol.)` }));
        return { ...service, therapists: [...service.baseTherapists, ...communityVols] };
    };

    return (
        <div className="py-24 bg-slate-50 min-h-screen px-6 text-left selection:bg-slate-900 selection:text-white">
            <div className="max-w-7xl mx-auto">
                
                <div className="max-w-3xl mb-20">
                    <p className="text-blue-600 font-black tracking-widest uppercase mb-3 text-xs">Wellness Ecosystem</p>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-950 tracking-tighter leading-[0.9] mb-8 uppercase">Support</h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">Closing the gap between clinical healthcare, caregiver resilience, and corporate career success.</p>
                </div>

                {/* Section 1: PWD Therapies */}
                <div className="mb-24">
                    <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-slate-950 mb-8 border-b border-slate-200 pb-4">Therapies for Lived Experience</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pwdServices.map(s => {
                        const hydrated = hydrateService(s);
                        return (
                        <button key={s.id} onClick={() => setSelected(hydrated)} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group flex flex-col items-start border border-slate-100 hover:border-blue-200 text-left outline-none h-full">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">{s.icon}</div>
                            <h3 className="text-xl font-black mb-3 uppercase tracking-tight text-slate-950 leading-tight group-hover:text-blue-600 transition-colors">{s.title}</h3>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed flex-grow text-sm">{s.desc}</p>
                            <div className="mt-auto pt-4 border-t border-slate-100 w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                                View Details <ArrowRight className="w-3 h-3" />
                            </div>
                        </button>
                    )})}
                    </div>
                </div>

                {/* Section 2: Caregiver Ecosystem */}
                <div>
                    <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-slate-950 mb-8 border-b border-slate-200 pb-4">Caregiver & Caretaker Ecosystem</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {caregiverServices.map(s => {
                        const hydrated = hydrateService(s);
                        return (
                        <button key={s.id} onClick={() => setSelected(hydrated)} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group flex flex-col items-start border border-slate-100 hover:border-blue-200 text-left outline-none h-full">
                            <div className="w-14 h-14 bg-slate-950 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-blue-600 transition-all">{s.icon}</div>
                            <h3 className="text-xl font-black mb-3 uppercase tracking-tight text-slate-950 leading-tight group-hover:text-blue-600 transition-colors">{s.title}</h3>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed flex-grow text-sm">{s.desc}</p>
                            <div className="mt-auto pt-4 border-t border-slate-100 w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                                View Details <ArrowRight className="w-3 h-3" />
                            </div>
                        </button>
                    )})}
                    </div>
                </div>
            </div>
            
            {/* THERAPY BOOKING MODAL */}
            {selected && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => {setSelected(null); setIsBooking(false);}} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all"><X className="w-5 h-5"/></button>
                        
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-black text-[9px] uppercase tracking-widest rounded-md mb-4 mt-2">{selected.category}</span>
                        <h3 className="text-3xl lg:text-4xl font-black mb-6 uppercase tracking-tighter text-slate-950 leading-tight">{selected.title}</h3>
                        
                        {!isBooking ? (
                            <>
                                <p className="text-base text-slate-600 mb-8 leading-relaxed font-medium">{selected.detail}</p>
                                
                                <div className="mb-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center">
                                        <Activity className="w-3 h-3 mr-2 text-blue-600"/> Core Support Areas
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selected.supports?.map((s, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-xs font-bold">{s}</span>
                                        ))}
                                    </div>
                                </div>

                                {selected.commonlyNeededFor && (
                                    <div className="mb-8">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center">
                                            <Target className="w-3 h-3 mr-2 text-blue-600"/> Commonly Needed For
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selected.commonlyNeededFor.map((c, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-bold">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 mb-10 border-t border-slate-100 pt-8">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 mb-4 flex items-center">
                                        <Users className="w-4 h-4 mr-2 text-blue-600"/> Available Specialists
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selected.therapists.map((t, i) => (
                                            <div key={i} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mr-3 text-slate-500 flex-shrink-0"><User className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="font-black text-sm text-slate-950 leading-tight">{t.name}</p>
                                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">{t.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setIsBooking(true)} className="w-full py-5 bg-blue-600 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all">BOOK SESSION</button>
                            </>
                        ) : (
                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setNotif({msg: "Booking confirmed.", type: "success"}); setSelected(null); setIsBooking(false); }}>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Patient / Caretaker Details</label>
                                    <input placeholder="Full Legal Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 outline-none" required />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsBooking(false)} className="px-6 py-5 bg-slate-100 text-slate-500 font-black rounded-full uppercase tracking-[0.2em] text-xs hover:bg-slate-200">BACK</button>
                                    <button type="submit" className="flex-1 py-5 bg-blue-600 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-blue-700">CONFIRM BOOKING</button>
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
    const [showRepairBooking, setShowRepairBooking] = useState(false);
    const [showResearchBooking, setShowResearchBooking] = useState(false);
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

    // Form File States
    const [repairImages, setRepairImages] = useState([]);
    const [researchDocs, setResearchDocs] = useState([]);
    
    // Modal state for viewing a specific research service detail
    const [selectedResearchService, setSelectedResearchService] = useState(null);
    
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

    const RESEARCH_SERVICES = [
        { 
            id: 1,
            title: "Study Design & Principal Investigation", 
            shortDesc: "End-to-end research conceptualization, methodology design, and overall project leadership.",
            fullDesc: "We assist in developing comprehensive research concepts and objectives tailored to your goals. This includes designing robust methodologies, ensuring ethical compliance, supervising the research team, and leading the final reporting and dissemination phases. Suitable for organizations needing full-scale project leadership.",
            suitable: "Foundational structuring, grant proposals, full-scale execution." 
        },
        { 
            id: 2,
            title: "Co-Investigation & Technical Supervision", 
            shortDesc: "Methodology development, technical expertise, and quality review.",
            fullDesc: "Our experts integrate into your existing team to support technical and operational activities. We assist in methodology development, supervise field activities, provide domain-specific technical expertise (e.g., engineering, health, social sciences), and ensure high data quality throughout the lifecycle.",
            suitable: "Collaborative academic research, specialized technical studies." 
        },
        { 
            id: 3,
            title: "Project Coordination & Logistics", 
            shortDesc: "Organizing schedules, tracking timelines, and managing field movement.",
            fullDesc: "Seamless execution relies on flawless logistics. We handle the daily operations, organize schedules, coordinate communication among team members, track deliverables, manage field movements, and handle local procurement and documentation so you can focus on the science.",
            suitable: "Multi-site studies, complex fieldwork, large-scale surveys." 
        },
        {
            id: 4,
            title: "Field Supervision & Quality Assurance",
            shortDesc: "Direct oversight of data collection teams to ensure protocol adherence.",
            fullDesc: "Our experienced field supervisors oversee enumerators on the ground. They ensure strict adherence to research protocols, verify completed forms, conduct spot checks, and resolve field challenges in real-time to guarantee data integrity.",
            suitable: "Large survey deployments, rigorous quantitative studies."
        },
        {
            id: 5,
            title: "Enumeration & Data Collection",
            shortDesc: "Conducting interviews, surveys, and obtaining informed consent.",
            fullDesc: "We provide highly trained data collectors fluent in local languages and cultural nuances. They are skilled in conducting sensitive interviews, administering surveys, using digital data collection tools (ODK, REDCap, KoboToolbox), and maintaining strict ethical and confidentiality standards.",
            suitable: "Community surveys, qualitative interviews, baseline evaluations."
        },
        {
            id: 6,
            title: "Data Management & Security",
            shortDesc: "Database design, secure storage, and consistency monitoring.",
            fullDesc: "Protecting your data is paramount. We handle the design of digital databases, manage data entry systems, clean and store data securely, monitor for completeness and consistency, and ensure regular, encrypted backups.",
            suitable: "Longitudinal studies, sensitive health data, large datasets."
        },
        {
            id: 7,
            title: "Statistical Analysis & Reporting",
            shortDesc: "Quantitative/qualitative analysis and results interpretation.",
            fullDesc: "Our statisticians and data scientists transform raw data into actionable insights. We develop sampling strategies, conduct complex analyses using software like SPSS, R, Python, Stata, or NVivo, and generate clear tables, charts, and comprehensive reports.",
            suitable: "Impact evaluations, academic publications, policy briefs."
        },
        {
            id: 8,
            title: "Ethics, Compliance & IRB Support",
            shortDesc: "Navigating institutional review boards and participant protection.",
            fullDesc: "We guide your project through complex ethical landscapes. Our compliance officers ensure informed consent procedures are rigorous, participant protection is prioritized, and all local and international Institutional Review Board (IRB) requirements are met.",
            suitable: "Medical research, vulnerable populations, cross-border studies."
        },
        {
            id: 9,
            title: "Community Liaison & Engagement",
            shortDesc: "Coordinating community entry and local communication.",
            fullDesc: "Successful field research requires community trust. We act as the bridge between researchers and local communities, schools, hospitals, and governments. We manage stakeholder engagement, coordinate smooth community entry, and support participant mobilization.",
            suitable: "Community-based participatory research, public health interventions."
        }
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
                <p className="text-blue-600 font-black tracking-widest uppercase mb-3 text-xs">Innovation & Assessment</p>
                <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">Research <br />Services</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed italic">"Pioneering localized hardware solutions and inclusive research from our Nairobi base."</p>
            </div>

            {/* 1. FIELD RESEARCH & ACADEMIC SUPPORT (Now prominent at the top) */}
            <div className="mb-32">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
                    <div className="flex items-center">
                        <ClipboardList className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Field Research & Academic Support</h3>
                    </div>
                    
                    <button 
                        onClick={() => setShowResearchBooking(true)}
                        className="flex items-center px-6 py-3 bg-slate-950 hover:bg-blue-600 text-white font-black rounded-full text-xs uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <FileSearch className="w-4 h-4 mr-2" /> Book Research Services
                    </button>
                </div>
                
                <div className="mb-10 text-slate-600 leading-relaxed font-medium">
                    <p className="mb-4">Conducting rigorous, ethical research requires specialized knowledge, appropriate methodologies, and sensitive community entry. While our roots are in disability inclusion, our expertise supports broader developmental, health, and social impact studies. We provide end-to-end logistical and technical support for independent researchers, academic institutions, and NGOs.</p>
                    <p>Whether you need guidance on data collection protocols, trained enumerators fluent in local contexts, or advanced statistical analysis, our personnel are equipped to integrate seamlessly into your study. Select a service area below to learn more about how we can support your project.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RESEARCH_SERVICES.map((role) => (
                        <button 
                            key={role.id} 
                            onClick={() => setSelectedResearchService(role)}
                            className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-300 hover:shadow-lg transition-all text-left group flex flex-col h-full"
                        >
                            <h4 className="text-sm font-black mb-3 uppercase tracking-tight text-slate-950 group-hover:text-blue-600 transition-colors">{role.title}</h4>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-grow">{role.shortDesc}</p>
                            <div className="mt-auto pt-4 border-t border-slate-200 w-full flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">Suitable For:</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">{role.suitable.split(',')[0]}...</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Active Tech Development - SLIDESHOW VERSION */}
            <div className="mb-32">
                <div className="flex items-center mb-8 border-b border-slate-100 pb-4">
                    <Cpu className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Active Technology Prototyping and Research</h3>
                </div>
                
                <div className="relative group">
                    <div className="bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-100 shadow-sm transition-all group-hover:shadow-xl flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="flex-1 w-full flex flex-col">
                            <div className="flex justify-between items-start mb-6 w-full">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 font-black text-[9px] uppercase tracking-widest rounded-md">{currentProject.stage}</span>
                            </div>
                            <h4 className="text-2xl font-black mb-6 uppercase tracking-tight text-slate-950 leading-tight group-hover:text-blue-600 transition-colors">{currentProject.title}</h4>
                            <p className="text-slate-600 font-medium text-base leading-relaxed mb-8 flex-grow">{currentProject.desc}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {currentProject.tags.map(tag => <span key={tag} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 uppercase">{tag}</span>)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevProject} 
                        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 hover:bg-blue-600 transition-all focus:outline-none"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextProject} 
                        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 hover:bg-blue-600 transition-all focus:outline-none"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Indicators */}
                    <div className="flex justify-center space-x-2 mt-8">
                        {RD_PROJECTS.map((_, index) => (
                            <button 
                                key={index} 
                                onClick={() => setCurrentProjectIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${currentProjectIndex === index ? 'bg-blue-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Repair & Assessment Centers */}
            <div className="mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-slate-100 pb-4 gap-4">
                    <div className="flex items-center">
                        <Map className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">Repair Services</h3>
                    </div>
                    
                    <button 
                        onClick={() => setShowRepairBooking(true)}
                        className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full text-xs uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all"
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
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${center.isBase ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                    {center.icon}
                                </div>
                                {center.isBase && <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-black text-[9px] uppercase tracking-widest rounded-full flex items-center"><Compass className="w-3 h-3 mr-1"/> HQ</span>}
                            </div>
                            <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{center.name}</h4>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center ${center.isBase ? 'text-slate-400' : 'text-slate-500'}`}><MapPin className="w-3 h-3 mr-1"/> {center.location}</p>
                            <p className={`text-sm font-medium leading-relaxed ${center.isBase ? 'text-slate-300' : 'text-slate-600'}`}>{center.focus}</p>
                            
                            {center.isBase && (
                                <button 
                                    onClick={() => setShowRepairBooking(true)}
                                    className="mt-6 w-full py-4 bg-white/10 hover:bg-blue-600 text-white font-black rounded-full uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center border border-white/20"
                                >
                                    <Settings className="w-3 h-3 mr-2" /> INITIATE BOOKING
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL: SPECIFIC RESEARCH SERVICE DETAILS */}
            {selectedResearchService && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => setSelectedResearchService(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all z-10"><X className="w-5 h-5"/></button>
                        
                        <div className="mb-8 border-b border-slate-100 pb-6 pt-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md inline-flex items-center mb-4">
                                Research Service
                            </span>
                            <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-slate-950 leading-tight mb-4">{selectedResearchService.title}</h3>
                        </div>

                        <div className="space-y-8 mb-10">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center"><FileText className="w-4 h-4 mr-2" /> Service Overview</h4>
                                <p className="text-slate-700 font-medium text-base leading-relaxed">{selectedResearchService.fullDesc}</p>
                            </div>
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center"><Target className="w-4 h-4 mr-2 text-blue-600"/> Best Suited For</h4>
                                <p className="text-slate-700 font-bold text-sm leading-relaxed">{selectedResearchService.suitable}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 border-t border-slate-100 pt-6">
                            <button onClick={() => setSelectedResearchService(null)} className="px-6 py-5 bg-slate-100 text-slate-500 font-black rounded-full uppercase tracking-[0.2em] text-xs hover:bg-slate-200">BACK</button>
                            <button 
                                onClick={() => {
                                    setSelectedResearchService(null);
                                    setShowResearchBooking(true);
                                }} 
                                className="flex-1 py-5 bg-blue-600 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-blue-700 flex items-center justify-center"
                            >
                                REQUEST THIS SERVICE <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: REPAIR BOOKING */}
            {showRepairBooking && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => { setShowRepairBooking(false); setRepairImages([]); }} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all z-10"><X className="w-5 h-5"/></button>
                        
                        <div className="flex items-center space-x-3 mb-6 pt-4">
                            <div className="w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-lg"><Wrench className="w-6 h-6" /></div>
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-slate-950 leading-none">Book Lab Repair</h3>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Tenda Care Base Lab • Nairobi Central</p>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={(e) => { 
                            e.preventDefault(); 
                            setNotif({msg: "Repair booking confirmed. Bring your equipment to the Base Lab at the scheduled time.", type: "success"}); 
                            setShowRepairBooking(false); 
                            setRepairImages([]);
                        }}>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Equipment Type</label>
                                <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer">
                                    <option value="">Select Equipment...</option>
                                    <option value="wheelchair">Manual/Electric Wheelchair</option>
                                    <option value="pcb">Custom PCB / Tracking Hardware</option>
                                    <option value="hearing">Digital Hearing Aid</option>
                                    <option value="visual">Braille / Visual Tech</option>
                                    <option value="other">Other Assistive Device</option>
                                </select>
                            </div>
                            
                            {/* REPAIR IMAGE UPLOAD */}
                            <div className="w-full">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Visual Proof of Defect</label>
                                <label className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer bg-slate-50 group">
                                    <Upload className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-sm">Upload Photos</span>
                                    <span className="text-xs text-slate-400 mt-1">JPEG, PNG up to 5MB</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple
                                        className="hidden" 
                                        onChange={(e) => {
                                            if(e.target.files) {
                                                setRepairImages(Array.from(e.target.files));
                                            }
                                        }} 
                                    />
                                </label>
                                {repairImages.length > 0 && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm font-bold flex-wrap gap-2">
                                        <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0" />
                                        {repairImages.length} photo(s) selected
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Describe the Defect / Issue</label>
                                <textarea placeholder="What exactly needs repair or assessment? (e.g., motor replacement, firmware flash, wheel alignment)" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-24 focus:border-blue-500 transition-colors"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Drop-off Date</label>
                                    <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center"><Clock className="w-3 h-3 mr-1"/> Preferred Time</label>
                                    <input type="time" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 outline-none" required />
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => { setShowRepairBooking(false); setRepairImages([]); }} className="px-6 py-5 bg-slate-100 text-slate-500 font-black rounded-full uppercase tracking-[0.2em] text-xs hover:bg-slate-200">CANCEL</button>
                                <button type="submit" className="flex-1 py-5 bg-slate-950 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-slate-800">CONFIRM DROP-OFF</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: RESEARCH SERVICES BOOKING */}
            {showResearchBooking && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300 text-left">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 lg:p-12 shadow-2xl relative animate-in zoom-in-95 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => { setShowResearchBooking(false); setResearchDocs([]); }} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all z-10"><X className="w-5 h-5"/></button>
                        
                        <div className="flex items-center space-x-3 mb-6 pt-4">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><FileSearch className="w-6 h-6" /></div>
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-slate-950 leading-none">Request Research Support</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Field Logistics & Academic Consulting</p>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={(e) => { 
                            e.preventDefault(); 
                            setNotif({msg: "Request submitted. Our research coordinator will contact you shortly.", type: "success"}); 
                            setShowResearchBooking(false); 
                            setResearchDocs([]);
                        }}>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Primary Contact / PI</label>
                                <input placeholder="Full Name & Institution" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 outline-none" required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Service Requested</label>
                                <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 outline-none appearance-none cursor-pointer">
                                    <option value="">Select Primary Need...</option>
                                    <option value="data_collection">Field Enumerators & Data Collection</option>
                                    <option value="analysis">Statistical Analysis & Data Management</option>
                                    <option value="coordination">Project Coordination & Logistics</option>
                                    <option value="full_team">Full Research Team Deployment</option>
                                    <option value="consultation">General Ideation & Ethics Consultation</option>
                                </select>
                            </div>

                            {/* RESEARCH DOCUMENT UPLOAD */}
                            <div className="w-full">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Supporting Documents</label>
                                <label className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer bg-slate-50 group">
                                    <Upload className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-sm">Attach Proposal or Docs</span>
                                    <span className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX up to 10MB</span>
                                    <input 
                                        type="file" 
                                        accept=".pdf,.doc,.docx" 
                                        multiple
                                        className="hidden" 
                                        onChange={(e) => {
                                            if(e.target.files) {
                                                setResearchDocs(Array.from(e.target.files));
                                            }
                                        }} 
                                    />
                                </label>
                                {researchDocs.length > 0 && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm font-bold flex-wrap gap-2">
                                        <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0" />
                                        {researchDocs.length} document(s) attached
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Project Overview</label>
                                <textarea placeholder="Briefly describe your research goals, target demographic, and timeline..." required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-28 focus:border-blue-500 transition-colors"></textarea>
                            </div>
                            
                            <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => { setShowResearchBooking(false); setResearchDocs([]); }} className="px-6 py-5 bg-slate-100 text-slate-500 font-black rounded-full uppercase tracking-[0.2em] text-xs hover:bg-slate-200">CANCEL</button>
                                <button type="submit" className="flex-1 py-5 bg-blue-600 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-xs hover:bg-blue-700">SUBMIT REQUEST</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ExchangePage = ({ setNotif }) => {
    const [view, setView] = useState('list');
    const [selectedType, setSelectedType] = useState("");
    const [search, setSearch] = useState("");
    
    // DB Items State
    const [items, setItems] = useState([]);
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
    }, []);

    const nextSlide = () => setCurrentSlideIndex(prev => (selectedItem?.image_urls && prev === selectedItem.image_urls.length - 1) ? 0 : prev + 1);
    const prevSlide = () => setCurrentSlideIndex(prev => (selectedItem?.image_urls && prev === 0) ? selectedItem.image_urls.length - 1 : prev - 1);

    if (view === 'donate_step1') return (
        <div className="py-24 max-w-4xl mx-auto px-6 animate-in fade-in">
            <p className="text-blue-600 font-black tracking-widest uppercase mb-6 text-xs text-center">Step 01 / Category Selection</p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-950 mb-12 uppercase tracking-tighter leading-none text-center">CHOOSE DEVICE TYPE</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {DEVICE_TYPES.map((t, i) => (
                <button key={i} onClick={() => { setSelectedType(t); setView('donate_step2'); setImageFiles([]); }} className="p-6 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-600 hover:shadow-lg transition-all group flex items-center justify-between">
                    <div>
                        <span className="font-black text-slate-950 group-hover:text-blue-600 text-lg uppercase tracking-tight block">{t.split('(')[0]}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1 block">{t.split('(')[1]?.replace(')', '') || 'Misc'}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
                    <input name="name" placeholder="Item Nomenclature (e.g. Model X)" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold focus:border-blue-500" required />
                    <select name="condition" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" required>
                        <option value="">Select Overall Condition...</option>
                        <option value="Mint / Boxed">Mint / Boxed</option>
                        <option value="Minimal Wear">Minimal Wear</option>
                        <option value="Needs Minor Repair">Needs Minor Repair</option>
                    </select>
                    
                    <div className="w-full">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Visual Proof (Multiple allowed)</label>
                        <label className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer bg-slate-50 group">
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

                    <textarea name="description" placeholder="General description of the item and features..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-28 focus:border-blue-500" required></textarea>
                    <textarea name="defects" placeholder="Specify any broken parts, missing pieces..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-28 focus:border-blue-500" required></textarea>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg flex items-center justify-center">
                        {isSubmitting ? "UPLOADING TO CLOUD..." : "DEPLOY TO EXCHANGE"}
                    </button>
                    <button type="button" disabled={isSubmitting} onClick={() => setView('list')} className="w-full py-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600">Cancel</button>
                </form>
            </div>
        </div>
    );

    return (
        <section className="py-24 bg-slate-50 px-6 min-h-screen text-left">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mb-20">
                    <p className="text-blue-600 font-black tracking-widest uppercase mb-3 text-xs">Community Logistics</p>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-8">The <br />Exchange</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-24">
                    <button onClick={() => setView('donate_step1')} className="bg-white p-10 rounded-[2rem] shadow-sm flex flex-col items-center text-center group border border-slate-100 hover:border-blue-100 hover:-translate-y-1 transition-all outline-none w-full">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><Heart className="w-8 h-8" /></div>
                        <h3 className="text-3xl font-black text-slate-950 mb-4 uppercase tracking-tight leading-none">Donate Asset</h3>
                        <p className="text-slate-500 font-medium mb-8 max-w-xs leading-relaxed text-sm">Gift your pre-loved assistive tools to a community member in need.</p>
                    </button>
                    <div className="bg-slate-950 p-10 rounded-[2rem] shadow-xl flex flex-col items-center text-center text-white group hover:-translate-y-1 transition-all">
                        <div className="w-20 h-20 bg-white/5 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm"><Search className="w-8 h-8" /></div>
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tight leading-none">Acquire Tool</h3>
                        <div className="w-full relative mt-auto">
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search live inventory..." className="w-full py-4 px-6 bg-white/10 rounded-full text-center outline-none focus:border-blue-500 font-bold text-sm text-white" />
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
                                        <div><p className="font-black text-sm sm:text-lg tracking-tight uppercase text-slate-950 mb-1 truncate">{d.name}</p><p className="text-[9px] font-black uppercase text-blue-600 tracking-widest truncate">{d.device_type}</p></div>
                                    </div>
                                    <button onClick={() => { setSelectedItem(d); setCurrentSlideIndex(0); }} className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-950 text-white font-black text-[9px] sm:text-[10px] rounded-full hover:bg-blue-600 uppercase tracking-[0.2em] flex items-center">
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
                        <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all z-10"><X className="w-5 h-5"/></button>
                        
                        <div className="mb-6 border-b border-slate-100 pb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md inline-flex items-center mb-4">
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
                                                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentSlideIndex ? 'bg-blue-600 w-3' : 'bg-slate-300'}`} />
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
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 mb-2 flex items-center"><Wrench className="w-3 h-3 mr-2 text-blue-600"/> Known Defects / Issues</h4>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed p-5 bg-red-50 rounded-xl border border-red-100">{selectedItem.defects}</p>
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); setNotif({msg: "Inquiry sent securely to the donor.", type: "success"}); setSelectedItem(null); }} className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-white">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4 flex items-center"><MessageSquare className="w-4 h-4 mr-2 text-blue-500"/> Secure Inquire & Claim</h4>
                            <textarea placeholder="Write a brief message to the donor explaining your need..." required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none resize-none font-medium text-sm h-24 focus:border-blue-500 transition-colors mb-4 placeholder:text-white/30"></textarea>
                            <button type="submit" className="w-full py-4 sm:py-5 bg-blue-600 text-white font-black rounded-full shadow-lg uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 transition-all flex items-center justify-center">SUBMIT INQUIRY <ArrowRight className="w-3 h-3 ml-2" /></button>
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
    
    // UPDATED: Comprehensive list of roles based on Therapies and Support ecosystems
    const roles = [
        { title: "Physical Therapist", sub: "Movement & posture care.", color: "bg-blue-600" },
        { title: "Occupational Therapist", sub: "Daily life independence.", color: "bg-blue-700" },
        { title: "Speech Pathologist", sub: "Communication support.", color: "bg-blue-800" },
        { title: "Behavioral Therapist", sub: "Emotional & behavior regulation.", color: "bg-blue-900" },
        { title: "Sensory Specialist", sub: "Sensory processing.", color: "bg-slate-700" },
        { title: "Special Education Expert", sub: "Learning adaptation.", color: "bg-slate-800" },
        { title: "Assistive Tech Specialist", sub: "Hardware & software tools.", color: "bg-slate-900" },
        { title: "Vocational Coach", sub: "Career & life mentoring.", color: "bg-black" },
        { title: "Clinical Psychologist", sub: "Mental health guidance.", color: "bg-blue-950" },
        { title: "Caregiver / Caretaker", sub: "Family & daily support.", color: "bg-blue-500" },
        { title: "Respite Coordinator", sub: "Temporary care relief.", color: "bg-blue-400" },
        { title: "Inclusion Consultant", sub: "Corporate audits.", color: "bg-slate-600" }
    ];

    if (view === 'signup') return (
        <div className="bg-slate-950 py-24 min-h-screen text-white flex items-center px-6 animate-in zoom-in-95 duration-500">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
                <div className="text-center lg:text-left">
                    <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Candidate Induction</span>
                    <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">JOIN AS <br /><span className="text-blue-500 italic">{role}</span></h2>
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
                        <input name="fullName" placeholder="Full Legal Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 outline-none" required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Communication</label>
                        <input name="email" type="email" placeholder="Professional Email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 outline-none" required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Mission Statement</label>
                        <textarea name="mission" placeholder="Briefly describe your focus..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium h-32 focus:border-blue-500" required></textarea>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-3 cursor-pointer" onClick={() => setConsentToDisplay(!consentToDisplay)}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 flex-shrink-0 transition-colors ${consentToDisplay ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>{consentToDisplay && <CheckCircle2 className="w-4 h-4" />}</div>
                        <div><p className="font-bold text-sm text-slate-950 leading-tight">Public Directory Consent</p><p className="text-xs text-slate-500 mt-1">I consent to having my name listed publicly.</p></div>
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full uppercase tracking-[0.2em] text-xs shadow-lg flex items-center justify-center">
                        {isSubmitting ? "PROCESSING..." : "SEND APPLICATION"}
                    </button>
                    <button type="button" onClick={() => setView('choice')} disabled={isSubmitting} className="w-full py-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600">Cancel & Go Back</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="bg-blue-600 min-h-screen text-white text-center relative overflow-hidden flex flex-col items-center justify-center pt-24 pb-32">
            <Globe className="absolute -right-40 -top-40 w-[600px] h-[600px] text-white/5 rotate-12" />
            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <h2 className="text-6xl lg:text-[10rem] font-black mb-12 tracking-tighter uppercase leading-[0.8]">JOIN THE <br />FORCE</h2>
                <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto mb-12 font-medium">We welcome advocates, caretakers, and professionals to join our network and support the community.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {roles.map((r, i) => (
                    <button key={i} onClick={() => { setRole(r.title); setView('signup'); setConsentToDisplay(false); }} className={`${r.color} p-8 lg:p-10 rounded-[2rem] text-left group hover:-translate-y-2 transition-all shadow-xl flex flex-col justify-between min-h-[250px] relative border border-white/10`}>
                        <div><h3 className="text-2xl font-black mb-4 leading-tight uppercase tracking-tighter text-white">{r.title}</h3><p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{r.sub}</p></div>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-950 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-md mt-6"><ArrowRight className="w-5 h-5" /></div>
                    </button>
                ))}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    // 1. Initialize state from the URL hash, default to HOME
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        return Object.values(PAGES).includes(hash) ? hash : PAGES.HOME;
    });
    
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [notif, setNotif] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State added back
    
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
    
    // 2. Listen for Hash Changes (Browser Back/Forward buttons)
    useEffect(() => { 
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const validPage = Object.values(PAGES).includes(hash) ? hash : PAGES.HOME;
            setCurrentPage(validPage);
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
            setIsMobileMenuOpen(false); // Close menu on navigation
        };

        window.addEventListener('hashchange', handleHashChange);
        
        // Set initial hash if missing
        if (!window.location.hash) {
            window.location.hash = PAGES.HOME;
        }

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // 3. Navigation helper function
    const navigate = (pageId) => {
        window.location.hash = pageId;
    };

    const renderPage = () => {
        if (!isAuthReady) return <div className="fixed inset-0 bg-slate-950 flex justify-center items-center"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
        switch (currentPage) {
            case PAGES.THERAPIES: return <TherapiesPage setNotif={setNotif} dynamicSpecialists={dynamicSpecialists} />;
            case PAGES.GET_INVOLVED: return <GetInvolvedPage setNotif={setNotif} onAddSpecialist={(spec) => setDynamicSpecialists([...dynamicSpecialists, spec])} />;
            case PAGES.RESOURCES: return <ResourcesPage setNotif={setNotif} />;
            case PAGES.RESEARCH: return <ResearchPage setNotif={setNotif} />;
            case PAGES.EXCHANGE: return <ExchangePage setNotif={setNotif} />;
            case PAGES.HOME: return <><HeroSection navigate={navigate} /><AboutSection navigate={navigate} /><PillarsSection /><CoreTeamSection /></>;
            default: return <HeroSection navigate={navigate} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-slate-950 antialiased pb-24 lg:pb-0">
            {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}
            
            <header className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-100 z-[1000] h-20 flex justify-between items-center px-4 lg:px-6">
                <button onClick={() => navigate(PAGES.HOME)} className="flex items-center space-x-2 lg:space-x-3 outline-none group z-50">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-[10px] flex items-center justify-center shadow-md group-hover:rotate-6 transition-all"><LogoIcon /></div>
                    <span className="text-lg lg:text-xl font-black tracking-tighter uppercase leading-none group-hover:text-blue-600 transition-colors">Tenda Care</span>
                </button>
                
                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-2">
                    {NAV_ITEMS.map((item) => {
                        if (item.id === PAGES.HOME) return null; 
                        return (
                            <button key={item.id} onClick={() => navigate(item.id)} className={`flex items-center space-x-1.5 px-4 py-2.5 font-black uppercase text-[10px] tracking-widest transition-all rounded-full ${currentPage === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                                {item.icon}<span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="flex items-center space-x-2 lg:space-x-4">
                    {/* Desktop & Mobile Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
                        {!isLoggedIn ? (
                            <button onClick={() => setShowAuthModal(true)} className="flex items-center space-x-2 px-3 lg:px-5 py-2 lg:py-2.5 text-slate-600 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-colors"><UserCircle className="w-5 h-5 lg:w-4 lg:h-4" /> <span className="hidden lg:inline">Sign In</span></button>
                        ) : (
                            <button onClick={async () => { if(supabase) await supabase.auth.signOut(); setIsLoggedIn(false); setNotif({msg: "Logged out.", type: "info"}); }} className="flex items-center space-x-2 px-3 lg:px-5 py-2 lg:py-2.5 text-blue-600 font-black text-[10px] uppercase tracking-widest transition-colors"><UserCircle className="w-5 h-5 lg:w-4 lg:h-4" /> <span className="hidden lg:inline">Logout</span></button>
                        )}
                        {/* Get Involved Button - visible on all screens */}
                        <button onClick={() => navigate(PAGES.GET_INVOLVED)} className="flex items-center space-x-1 lg:space-x-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-slate-950 hover:bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md transition-all">
                            <span className="hidden sm:inline">JOIN ACTION</span><span className="sm:hidden">JOIN</span> <ArrowRight className="w-3 h-3 ml-1 lg:ml-0" />
                        </button>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button 
                        className="lg:hidden p-2 text-slate-950 focus:outline-none hover:text-blue-600 transition-colors z-50"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Full-Screen Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-20 z-[999] bg-white border-t border-slate-100 p-6 flex flex-col space-y-6 lg:hidden overflow-y-auto animate-in fade-in duration-200">
                    <nav className="flex flex-col space-y-3">
                        {NAV_ITEMS.map((item) => {
                            if (item.id === PAGES.HOME) return null;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.id)}
                                    className={`flex items-center space-x-3 px-5 py-4 font-black uppercase text-xs tracking-widest transition-all rounded-2xl ${currentPage === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-700'}`}
                                >
                                    {React.cloneElement(item.icon, { className: 'w-5 h-5 mb-0' })}<span className="ml-2">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                    <div className="flex flex-col space-y-4 border-t border-slate-100 pt-6 mt-auto pb-8">
                        {!isLoggedIn ? (
                            <button onClick={() => {setShowAuthModal(true); setIsMobileMenuOpen(false);}} className="flex items-center justify-center space-x-2 px-5 py-4 bg-slate-50 text-slate-600 hover:text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-colors"><UserCircle className="w-5 h-5" /> <span>Sign In</span></button>
                        ) : (
                            <button onClick={async () => { if(supabase) await supabase.auth.signOut(); setIsLoggedIn(false); setNotif({msg: "Logged out.", type: "info"}); setIsMobileMenuOpen(false); }} className="flex items-center justify-center space-x-2 px-5 py-4 bg-slate-50 text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-colors"><UserCircle className="w-5 h-5" /> <span>Logout</span></button>
                        )}
                        <button onClick={() => {navigate(PAGES.GET_INVOLVED); setIsMobileMenuOpen(false);}} className="flex items-center justify-center space-x-2 px-6 py-4 bg-slate-950 hover:bg-blue-600 text-white text-xs font-black rounded-2xl uppercase tracking-widest shadow-md transition-all"><span>JOIN ACTION</span> <ArrowRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}

            <main className="flex-1 w-full pt-20">{renderPage()}</main>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    );
};

export default App;