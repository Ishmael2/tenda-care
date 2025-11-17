/* global __firebase_config __initial_auth_token __app_id */ 
import React, { useState, useEffect, useCallback } from 'react';
// Changed remote CDN imports to standard package names for React compatibility
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, setLogLevel, collection, onSnapshot, addDoc, query } from 'firebase/firestore';

// --- Global Variables (Canvas Environment Injection) ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'tenda-care-default'; // Fallback App ID

// --- Page Definitions ---
const PAGES = {
    HOME: 'HOME',
    RESOURCES: 'RESOURCES',
    THERAPIES: 'THERAPIES',
    RESEARCH: 'RESEARCH', // New Research Page
    EXCHANGE: 'EXCHANGE', // New Equipment Exchange Page
    GET_INVOLVED: 'GET_INVOLVED',
};

// --- Static Mock Data (Previously AI-fetched) ---
const STATIC_ADVOCACY_CONTENT = {
    newsSummary: "The UN has approved a new resolution focusing on digital accessibility standards for global education platforms.",
    globalTrainings: [
        { title: "Global Digital Skills Workshop", summary: "Free online training covering web development and accessible design principles.", link: "#" },
        { title: "Disability Rights Law Seminar", summary: "International webinar on CRPD compliance and advocacy strategies.", link: "#" },
        { title: "Assistive Tech Implementation", summary: "Course on deploying and managing new communication technologies.", link: "#" }
    ],
    kenyaTrainings: [
        { title: "Kenya Micro-Enterprise Grant Program", summary: "Application open for small business grants for PWD entrepreneurs.", link: "#" },
        { title: "Accessible Transport Forum (Nairobi)", summary: "Local workshop on demanding better public transit accessibility.", link: "#" },
        { title: "Digital Marketing for PWDs", summary: "In-person training focused on job-ready online marketing skills.", link: "#" }
    ]
};


// --- Inline SVG Components for Accessibility and Consistency ---

const LogoIcon = () => (
    <svg className="h-8 w-8 text-red-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z"/>
    </svg>
);

const AdvocacyIcon = () => (
    <svg className="h-10 w-10 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 9.043m15.836 2.365a11.955 11.955 0 01-9.043 9.618 11.955 11.955 0 01-2.365-15.836"/>
    </svg>
);

const EmpowermentIcon = () => (
    <svg className="h-10 w-10 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-5h-5v5zM12 20h5v-5h-5v5zM7 20h5v-5H7v5zM2 20h5v-5H2v5zM17 10h5v-5h-5v5zM12 10h5v-5h-5v5zM7 10h5v-5H7v5zM2 10h5v-5H2v5zM17 0h5v-5h-5v5zM12 0h5v-5h-5v5zM7 0h5v-5H7v5zM2 0h5v-5H2v5z"/>
    </svg>
);

const AccessibilityIcon = () => (
    <svg className="h-10 w-10 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
);

const CoachingIcon = () => (
    <svg className="w-10 h-10 text-red-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h-2c-1.104 0-2 .896-2 2v4M18 10h-4M6 10h4m-4 4h4m-4-4v4m16 0A9 9 0 112 12a9 9 0 0120 0z"/>
    </svg>
);

const LinkArrow = () => (
    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
);

const PhysicalTherapyIcon = () => (
    <svg className="w-10 h-10 text-red-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h1a4 4 0 014 4v3m-4 0v3m-4 0v-6m0 0h-1a4 4 0 00-4 4v3m10-7h.01M16 19v2m-8-2v2m-4-2h12a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
);

const OccupationalTherapyIcon = () => (
    <svg className="w-10 h-10 text-red-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-14-1V9a2 2 0 012-2h2m0 0v-2m-2 2v2m2 0h2m4-2h6m-3-3v6"/>
    </svg>
);

const SpeechTherapyIcon = () => (
    <svg className="w-10 h-10 text-red-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.787-1.294l-4.576 1.83a.998.998 0 01-1.28-1.28L4.294 6.787A9.86 9.86 0 0112 4c4.97 0 9 3.582 9 8z"/>
    </svg>
);

const MentalHealthIcon = () => (
    <svg className="w-10 h-10 text-red-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0zM12 21V3"/>
    </svg>
);

const ResearchIcon = () => (
    <svg className="h-10 w-10 text-red-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 17l-2-2-2 2"/>
    </svg>
);

const ExchangeIcon = () => (
    <svg className="h-10 w-10 text-red-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0v4m-5 4h5m-5 4h5M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
);

const NewsIcon = () => (
    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m-7 4h3m-3 0h3m-3 0h.01M17 12l2-2 2 2M7 12l-2 2-2-2"/>
    </svg>
);

const TrainingIcon = () => (
    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.787-1.294l-4.576 1.83a.998.998 0 01-1.28-1.28L4.294 6.787A9.86 9.86 0 0112 4c4.97 0 9 3.582 9 8z"/>
    </svg>
);

const LinkIcon = () => (
    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
    </svg>
);

// Helper array for navigation links (Now links to PAGES)
const navLinks = [
    { page: PAGES.HOME, label: 'Home' },
    { page: PAGES.RESOURCES, label: 'Resources' },
    { page: PAGES.THERAPIES, label: 'Therapy Options' },
    { page: PAGES.RESEARCH, label: 'Research' },
    { page: PAGES.EXCHANGE, label: 'Exchange' },
];

// --- Sub-Component: Hero Section ---
const HeroSection = ({ setPage }) => (
    <section id="home" className="bg-white py-16 sm:py-24 lg:py-32 rounded-b-2xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                <span className="block text-red-700">Amplifying the Voice</span>
                <span className="block mt-2">of Every Person with a Disability.</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
                Our foundation is the principle: <strong className="text-red-700 font-bold">"Nothing About Us Without Us."</strong> We fight for dignity, inclusion, and equal rights in every aspect of community life.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
                <a href="#mission" className="px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 transition duration-300 shadow-xl" role="button">
                    Discover Our Mission
                </a>
                <button 
                    onClick={() => setPage(PAGES.GET_INVOLVED)} 
                    className="px-8 py-3 border-2 border-red-700 text-lg font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition duration-300 shadow-xl" 
                    role="button"
                >
                    Take Action
                </button>
            </div>
        </div>
    </section>
);

// --- Sub-Component: Mission Section ---
const MissionSection = () => (
    <section id="mission" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
                <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Our Core Commitment</h2>
                <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    A Vision for a Truly Inclusive Society
                </p>
                <p className="mt-4 max-w-3xl lg:mx-auto text-xl text-gray-600">
                    We aim for a socially just, accessible, and inclusive community where the human rights, belonging, and potential of all people with disabilities are recognized, respected, and celebrated with pride.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]">
                    <AdvocacyIcon />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Advocacy & Rights</h3>
                    <p className="text-gray-600">Championing systemic change to uphold the dignity and legal rights of PWDs at every level of government and society.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]">
                    <EmpowermentIcon />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Empowerment</h3>
                    <p className="text-gray-600">Fostering self-determination and building the leadership capacity of individuals with disabilities.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]">
                    <AccessibilityIcon />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
                    <p className="text-gray-600">Working to remove environmental, institutional, and attitudinal barriers in all public and digital spaces.</p>
                </div>
            </div>
        </div>
    </section>
);

// --- Sub-Component: Pillars Section ---
const PillarsSection = () => (
    <section id="pillars" className="py-16 sm:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
                <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Key Focus Areas</h2>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Our Four Pillars of Action
                </p>
            </div>
            <div className="mt-16 space-y-12">
                <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-6 md:p-10 border-l-4 border-red-600">
                    <div className="md:w-1/3 flex-shrink-0 mb-4 md:mb-0">
                        <h3 className="text-2xl font-extrabold text-red-700">1. Economic Empowerment</h3>
                    </div>
                    <div className="md:w-2/3 md:pl-10">
                        <p className="text-gray-700 text-lg">We advocate for policies that ensure financial stability, access to quality jobs, and entrepreneurial opportunities for PWDs, fighting against employment discrimination and sub-minimum wages. This includes campaigning for inclusive employment strategies and skills development.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-6 md:p-10 border-l-4 border-red-600">
                    <div className="md:w-1/3 flex-shrink-0 mb-4 md:mb-0">
                        <h3 className="text-2xl font-extrabold text-red-700">2. Accessible & Inclusive Environments</h3>
                    </div>
                    <div className="md:w-2/3 md:pl-10">
                        <p className="text-gray-700 text-lg">Our focus is on making physical infrastructure, public transportation, and digital spaces barrier-free. We push for compliance with accessibility standards (like WCAG) and advocate for universal design principles in planning and construction.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-6 md:p-10 border-l-4 border-red-600">
                    <div className="md:w-1/3 flex-shrink-0 mb-4 md:mb-0">
                        <h3 className="text-2xl font-extrabold text-red-700">3. Inclusive Services</h3>
                    </div>
                    <div className="md:w-2/3 md:pl-10">
                        <p className="text-gray-700 text-lg">We work to ensure equal access to quality, comprehensive healthcare and fully inclusive education systems. This means fighting for necessary accommodations, assistive devices, and teacher training to support diverse learning needs.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-6 md:p-10 border-l-4 border-red-600">
                    <div className="md:w-1/3 flex-shrink-0 mb-4 md:mb-0">
                        <h3 className="text-2xl font-extrabold text-red-700">4. Policy & Leadership</h3>
                    </div>
                    <div className="md:w-2/3 md:pl-10">
                        <p className="text-gray-700 text-lg">We promote the involvement of PWDs in all decision-making processes ("Nothing About Us Without Us"). We track legislation and mobilize communities to influence policy reforms that affect disability rights.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- Full Page Components ---

const HomePage = ({ setPage }) => (
    <>
        <HeroSection setPage={setPage} />
        <MissionSection />
        <PillarsSection />
    </>
);

const ResourcesPage = ({ setPage }) => {
    const documents = [
        { title: "UN Convention on the Rights of PWDs (CRPD)", description: "The core international human rights treaty defining the rights of people with disabilities worldwide.", link: "#" },
        { title: "WCAG Accessibility Guidelines", description: "The technical standard for digital accessibility. Essential for all web developers and content creators.", link: "#" },
        { title: "Local Advocacy & DPO Directory", description: "A list of local Disabled Persons' Organizations (DPOs) and regional advocacy groups near you.", link: "#" },
        { title: "Guide to Accessible Voting", description: "Information on state and federal laws ensuring accessible polling places and voting methods.", link: "#" },
        { title: "Employment Rights: ADA Title I", description: "Detailed summary of employer obligations and employee rights under the Americans with Disabilities Act.", link: "#" },
        { title: "Inclusive Education IEP/504 Handbook", description: "A comprehensive guide for parents and educators on creating effective Individualized Education Programs.", link: "#" },
    ];
    
    // Using static content now that AI functionality is removed
    const staticContent = STATIC_ADVOCACY_CONTENT;

    return (
        <section id="resources-page" className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center mb-12">
                    <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Deep Dive Documents</h2>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Essential Policy and Legal Resources
                    </p>
                    <p className="mt-4 max-w-4xl lg:mx-auto text-xl text-gray-600">
                        Access our curated library of the most important legislative acts, international treaties, and practical guides that empower PWDs and advocates.
                    </p>
                </div>
                
                {/* --- Static Advocacy Updates & Training --- */}
                <div className="my-16 p-8 bg-gray-100 rounded-xl shadow-inner border-t-4 border-red-600" aria-label="Advocacy Updates Section">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                        <NewsIcon /> Current Advocacy Headlines & Trainings
                    </h2>
                    
                    {/* Display Static Content */}
                    {staticContent && (
                        <>
                            {/* Latest News Summary */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 border-b border-red-300 pb-1">Global Advocacy Headlines</h3>
                                <p className="text-gray-700">{staticContent.newsSummary}</p>
                            </div>

                            {/* Trainings Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><TrainingIcon /> Global Training Opportunities</h3>
                                    <ul className="space-y-4" role="list">
                                        {staticContent.globalTrainings.map((t, i) => (
                                            <li key={`gt-${i}`} className="p-4 bg-white rounded-lg shadow-md" aria-labelledby={`global-title-${i}`}>
                                                <p id={`global-title-${i}`} className="font-semibold text-red-700">{t.title}</p>
                                                <p className="text-sm text-gray-600 mb-2">{t.summary}</p>
                                                <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 text-sm inline-flex items-center" aria-label={`View details for training: ${t.title} (opens in new tab)`}>
                                                    View Details <LinkIcon />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><TrainingIcon /> Kenya-Specific Trainings</h3>
                                    <ul className="space-y-4" role="list">
                                        {staticContent.kenyaTrainings.map((t, i) => (
                                            <li key={`kt-${i}`} className="p-4 bg-white rounded-lg shadow-md" aria-labelledby={`kenya-title-${i}`}>
                                                <p id={`kenya-title-${i}`} className="font-semibold text-red-700">{t.title}</p>
                                                <p className="text-sm text-gray-600 mb-2">{t.summary}</p>
                                                <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 text-sm inline-flex items-center" aria-label={`View details for training: ${t.title} (opens in new tab)`}>
                                                    View Details <LinkIcon />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Static Documents */}
                <h3 className="text-3xl font-extrabold text-gray-900 mt-16 mb-8 border-t pt-8">Static Legal Documents</h3>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {documents.map((doc, index) => (
                        <article key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300">
                            <h3 className="text-xl font-bold text-red-700 mb-2">{doc.title}</h3>
                            <p className="text-gray-600 mb-4">{doc.description}</p>
                            <a href={doc.link} className="text-red-600 font-semibold hover:text-red-700 inline-flex items-center" aria-label={`View the ${doc.title} document`}>
                                View Document
                                <LinkArrow />
                            </a>
                        </article>
                    ))}
                </div>
                
                <div className="mt-16 text-center">
                    <button
                        onClick={() => setPage(PAGES.GET_INVOLVED)}
                        className="px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 transition duration-300 shadow-xl"
                        role="button"
                    >
                        Need Legal Help? Contact Our Advocacy Team
                    </button>
                </div>
            </div>
        </section>
    );
};

const TherapiesPage = () => {
    // Consolidated list of therapeutic and coaching services
    const services = [
        // --- Traditional Therapies ---
        { type: "Therapy", title: "Physical Therapy (PT)", icon: PhysicalTherapyIcon, description: "Aims to restore or improve physical mobility, strength, and function. Crucial for managing chronic pain and post-operative recovery." },
        { type: "Therapy", title: "Occupational Therapy (OT)", icon: OccupationalTherapyIcon, description: "Focuses on adapting the environment and teaching skills for daily living (ADLs), employment, and leisure activities, maximizing independence." },
        { type: "Therapy", title: "Speech-Language Pathology (SLP)", icon: SpeechTherapyIcon, description: "Addresses communication challenges, language comprehension, social communication, and difficulties with swallowing (dysphagia)." },
        { type: "Therapy", title: "Mental Health Support", icon: MentalHealthIcon, description: "Provides counseling, psychological support, and coping strategies to address emotional well-being, stress, anxiety, and depression." },
        
        // --- Coaching Services (New) ---
        { type: "Coaching", title: "Independent Life Coaching", icon: CoachingIcon, description: "Focuses on personal goal setting, self-advocacy, time management, and building confidence for living independently." },
        { type: "Coaching", title: "Career & Employment Coaching", icon: CoachingIcon, description: "Specialized support for job seeking, preparing for interviews, workplace accommodation navigation, and long-term career planning." },
        { type: "Coaching", title: "Peer Support Coaching", icon: CoachingIcon, description: "Connects individuals with experienced mentors who share similar disabilities, offering emotional support, coping strategies, and shared knowledge." },
        { type: "Coaching", title: "Family & Caregiver Coaching", icon: CoachingIcon, description: "Provides guidance and strategies to family members to support the PWD, focusing on communication, stress reduction, and resource navigation." },
        
        // --- Specialized Therapies ---
        { type: "Specialized", title: "Assistive Technology Training", icon: AccessibilityIcon, description: "Specialized training to master devices and software that enhance communication, mobility, and digital access." },
        { type: "Specialized", title: "Aquatic Therapy (Hydrotherapy)", icon: PhysicalTherapyIcon, description: "Using water's buoyancy and resistance for rehabilitation exercises, often benefiting individuals with severe joint pain or limited mobility." },
    ];
    
    // Separate services for clear section headers
    const traditionalServices = services.filter(s => s.type === 'Therapy' || s.type === 'Specialized');
    const coachingServices = services.filter(s => s.type === 'Coaching');

    return (
        <section id="therapies-page" className="py-16 sm:py-24 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center mb-12">
                    <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Comprehensive Care</h2>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Rehabilitation, Psychological Support, and Coaching
                    </p>
                    <p className="mt-4 max-w-4xl lg:mx-auto text-xl text-gray-600">
                        We advocate for affordable and inclusive access to the services necessary for personal growth, independence, and well-being.
                    </p>
                </div>

                {/* --- Coaching Section --- */}
                <h3 className="text-3xl font-extrabold text-gray-900 mt-16 mb-8 border-b border-red-300 pb-3 flex items-center">
                    <CoachingIcon /> Professional Coaching Services
                </h3>
                <p className="max-w-4xl text-lg text-gray-700 mb-10">
                    Coaching is non-clinical, forward-looking support tailored to help PWDs set goals, develop skills, and navigate personal or professional challenges to maximize autonomy.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {coachingServices.map((service, index) => (
                        <div key={index} className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-red-600 hover:shadow-2xl transition duration-300 transform hover:scale-[1.03]">
                            <service.icon />
                            <h4 className="text-xl font-bold text-red-700 mb-2">{service.title}</h4>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                            <a href="#" className="mt-4 inline-block text-red-700 font-semibold text-sm hover:text-red-800" aria-label={`Find local providers for ${service.title}`}>
                                Connect with a Coach &rarr;
                            </a>
                        </div>
                    ))}
                </div>

                {/* --- Traditional Therapies Section --- */}
                <h3 className="text-3xl font-extrabold text-gray-900 mt-16 mb-8 border-b border-red-300 pb-3">
                    Clinical and Rehabilitative Therapies
                </h3>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {traditionalServices.map((service, index) => (
                        <div key={index} className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-red-600 hover:shadow-2xl transition duration-300 transform hover:scale-[1.03]">
                            <service.icon />
                            <h4 className="text-xl font-bold text-red-700 mb-2">{service.title}</h4>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                            <a href="#" className="mt-4 inline-block text-red-700 font-semibold text-sm hover:text-red-800" aria-label={`Find local providers for ${service.title}`}>
                                Find Local Providers &rarr;
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// FIX: Corrected function definition syntax to ensure proper compilation
const ResearchPage = () => (
    <section id="research-page" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
                <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Data-Driven Advocacy</h2>
                <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    Research for Inclusion and Equity
                </p>
                <p className="mt-4 max-w-4xl lg:mx-auto text-xl text-gray-600">
                    Our studies generate evidence to expose systemic barriers, influence policy, and drive meaningful, measurable change for the PWD community.
                </p>
            </div>

            <div className="mt-16 space-y-16">
                {/* Current Studies */}
                <div className="bg-gray-100 p-8 rounded-xl shadow-inner border-t-4 border-red-600">
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                        <ResearchIcon /> Current Studies
                    </h3>
                    <div className="space-y-6">
                        <article className="p-4 bg-white rounded-lg shadow border-l-4 border-red-700">
                            <h4 className="font-semibold text-xl text-red-700 mb-1">Digital Accessibility Audit 2024: Kenya</h4>
                            <p className="text-gray-700 text-sm">Analyzing the WCAG compliance of the top 50 government and public service websites in Kenya to identify key digital exclusion points. (Est. completion: Q4 2024)</p>
                            <a href="#" className="text-red-600 text-sm mt-2 inline-flex items-center hover:text-red-800" aria-label="View the methodology for the Digital Accessibility Audit">
                                View Methodology <LinkIcon />
                            </a>
                        </article>
                        <article className="p-4 bg-white rounded-lg shadow border-l-4 border-red-700">
                            <h4 className="font-semibold text-xl text-red-700 mb-1">Impact of Peer Coaching on Employment Rates</h4>
                            <p className="text-gray-700 text-sm">A longitudinal study assessing how sustained peer support coaching affects job retention and career advancement for recent PWD graduates. (Ongoing enrollment)</p>
                            <a href="#" className="text-red-600 text-sm mt-2 inline-flex items-center hover:text-red-800" aria-label="Learn how to participate in the Peer Coaching Impact Study">
                                Get Involved <LinkIcon />
                            </a>
                        </article>
                    </div>
                </div>

                {/* Publications */}
                <div className="mt-16">
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-300 pb-3">
                        Recent Publications & Reports
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <article className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-gray-300">
                            <p className="text-sm text-gray-500">June 2024</p>
                            <h4 className="font-bold text-red-700 text-lg my-1">The Cost of Exclusion Report</h4>
                            <p className="text-gray-600 text-sm mb-3">Economic analysis of lost GDP due to employment and educational barriers for PWDs.</p>
                            <a href="#" className="text-red-600 font-semibold text-sm inline-flex items-center hover:text-red-800" aria-label="Download the full report on The Cost of Exclusion">
                                Download PDF <LinkIcon />
                            </a>
                        </article>
                        <article className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-gray-300">
                            <p className="text-sm text-gray-500">April 2024</p>
                            <h4 className="font-bold text-red-700 text-lg my-1">Healthcare Access Policy Brief</h4>
                            <p className="text-gray-600 text-sm mb-3">Policy recommendations for improving availability and affordability of rehabilitation services in rural areas.</p>
                            <a href="#" className="text-red-600 font-semibold text-sm inline-flex items-center hover:text-red-800" aria-label="Read the Healthcare Access Policy Brief">
                                Read Online <LinkIcon />
                            </a>
                        </article>
                        <article className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-gray-300">
                            <p className="text-sm text-gray-500">February 2024</p>
                            <h4 className="font-bold text-red-700 text-lg my-1">Voices of Young Advocates</h4>
                            <p className="text-gray-600 text-sm mb-3">Qualitative study capturing the experiences of PWD youth navigating post-secondary education.</p>
                            <a href="#" className="text-red-600 font-semibold text-sm inline-flex items-center hover:text-red-800" aria-label="View the Voices of Young Advocates report">
                                View Summary <LinkIcon />
                            </a>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const EQUIPMENT_COLLECTION_PATH = (appId) => (`artifacts/${appId}/public/data/equipmentExchange`);

const EquipmentExchangePage = ({ db, userId, appId }) => {
    // State for equipment management
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [formStatus, setFormStatus] = useState(null);

    // Placeholder data for demonstration
    const mockDonation = { name: "Manual Wheelchair (Like New)", condition: "Excellent", donor: userId };
    const mockRequest = { item: "Speech-to-Text Software License", applicant: userId, disabilityType: "Hearing Impairment" };

    const EQUIPMENT_COLLECTION = EQUIPMENT_COLLECTION_PATH(appId);

    // 2. Fetch Donations and Requests using onSnapshot (Real-time listening)
    useEffect(() => {
        if (!db) return;

        // Query to fetch all public equipment items
        const donationsRef = collection(db, EQUIPMENT_COLLECTION);
        
        // Listen for real-time updates on donations
        const unsubscribeDonations = onSnapshot(query(donationsRef), (snapshot) => {
            const fetchedDonations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })).filter(item => item.type === 'donation'); // Filter for donations
            setDonations(fetchedDonations);
        }, (error) => {
            console.error("Error listening to donations:", error);
        });

        // Listen for real-time updates on requests (using the same collection path)
        const unsubscribeRequests = onSnapshot(query(donationsRef), (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })).filter(item => item.type === 'request'); // Filter for requests
            setRequests(fetchedRequests);
        }, (error) => {
            console.error("Error listening to requests:", error);
        });

        // Cleanup subscription on unmount
        return () => {
            unsubscribeDonations();
            unsubscribeRequests();
        };
    }, [db, EQUIPMENT_COLLECTION]);

    // Function to handle donation submission (MOCK)
    const handleAddDonation = async () => {
        if (!db || !userId) {
            setFormStatus({ type: 'error', message: "Please wait for user authentication to complete." });
            return;
        }

        try {
            const docRef = await addDoc(collection(db, EQUIPMENT_COLLECTION), {
                ...mockDonation,
                type: 'donation',
                status: 'Available',
                timestamp: new Date().toISOString(),
                donorId: userId // Link to the current user
            });
            setFormStatus({ type: 'success', message: `Donation added! ID: ${docRef.id}. Check the available list below.` });
        } catch (e) {
            console.error("Error adding donation: ", e);
            setFormStatus({ type: 'error', message: "Failed to submit donation due to a database error." });
        }
    };

    // Function to handle request submission (MOCK)
    const handleAddRequest = async () => {
        if (!db || !userId) {
            setFormStatus({ type: 'error', message: "Please wait for user authentication to complete." });
            return;
        }

        try {
            const docRef = await addDoc(collection(db, EQUIPMENT_COLLECTION), {
                ...mockRequest,
                type: 'request',
                status: 'Pending',
                timestamp: new Date().toISOString(),
                applicantId: userId // Link to the current user
            });
            setFormStatus({ type: 'success', message: `Request submitted! ID: ${docRef.id}. We will notify you when a match is found.` });
        } catch (e) {
            console.error("Error submitting request: ", e);
            setFormStatus({ type: 'error', message: "Failed to submit request due to a database error." });
        }
    };


    // Helper function to render card based on status/type
    const renderCard = (item, type) => (
        <div key={item.id} className="p-4 bg-white rounded-lg shadow-md border-t-4 border-red-600">
            <p className="font-bold text-red-700">{type === 'donation' ? item.name : item.item}</p>
            <p className="text-sm text-gray-700">Condition: {item.condition || 'N/A'}</p>
            <p className="text-xs text-gray-500 mt-2">Status: <span className={`font-semibold ${item.status === 'Available' ? 'text-green-600' : 'text-yellow-600'}`}>{item.status}</span></p>
            <p className="text-xs text-gray-500 truncate mt-1" title={item.donorId || item.applicantId}>User: {item.donorId || item.applicantId}</p>
        </div>
    );

    return (
        <section id="exchange-page" className="py-16 sm:py-24 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center mb-12">
                    <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Community Support</h2>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Assistive Equipment Exchange
                    </p>
                    <p className="mt-4 max-w-4xl lg:mx-auto text-xl text-gray-600">
                        Donate pre-owned equipment to those in need, or request the items essential for independence. All allocations are matched automatically.
                    </p>
                </div>

                {/* Form Status Message */}
                {formStatus && (
                    <div className={`p-4 mb-8 rounded-lg ${formStatus.type === 'success' ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'} border`} role="alert">
                        <p className="font-semibold">{formStatus.message}</p>
                    </div>
                )}
                
                {/* Donation/Request Forms (MOCK) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-red-700">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">I Want to Donate Equipment</h3>
                        <p className="text-gray-600 mb-6">Click below to simulate donating a **Manual Wheelchair**. This will add it to the 'Available Donations' list below in real-time.</p>
                        <button
                            onClick={handleAddDonation}
                            className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 transition duration-300 shadow-md"
                            aria-label="Simulate adding a wheelchair donation"
                        >
                            Simulate Donate Wheelchair
                        </button>
                    </div>

                    <div className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-red-700">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">I Need Equipment</h3>
                        <p className="text-gray-600 mb-6">Click below to simulate requesting **Speech-to-Text Software**. This will add it to the 'Pending Requests' list.</p>
                        <button
                            onClick={handleAddRequest}
                            className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition duration-300 shadow-md"
                            aria-label="Simulate requesting speech-to-text software"
                        >
                            Simulate Request Item
                        </button>
                    </div>
                </div>

                {/* Live Data Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Available Donations */}
                    <div>
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                            Available Donations ({donations.length})
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {donations.length > 0 ? (
                                donations.map(d => renderCard(d, 'donation'))
                            ) : (
                                <p className="text-gray-500">No donations available yet. Try simulating a donation!</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div>
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                            Pending Requests ({requests.length})
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {requests.length > 0 ? (
                                requests.map(r => renderCard(r, 'request'))
                            ) : (
                                <p className="text-gray-500">No requests pending. Try simulating a request!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// FIX 1: Corrected Firestore collection path to be private data for the Get Involved Form
const CONTACTS_COLLECTION_PATH = (appId, userId) => (`artifacts/${appId}/users/${userId}/contacts`);

// --- Get Involved Form Component (NEW) ---
const GetInvolvedForm = ({ db, userId, appId }) => {
    const [formData, setFormData] = useState({
        role: 'PWD', // Default role
        email: '',
        phone: '',
        address: '',
    });
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const CONTACTS_COLLECTION = CONTACTS_COLLECTION_PATH(appId, userId);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        if (!db || !userId) {
            setStatus({ type: 'error', message: "Authentication not ready. Please wait a moment." });
            setIsSubmitting(false);
            return;
        }

        const requiredFields = [formData.email, formData.phone, formData.address];
        if (requiredFields.every(field => field.trim() === '')) {
            setStatus({ type: 'error', message: "Please provide at least one contact method (Email, Phone, or Address)." });
            setIsSubmitting(false);
            return;
        }

        try {
            await addDoc(collection(db, CONTACTS_COLLECTION), {
                ...formData,
                timestamp: new Date().toISOString(),
                userId: userId,
            });
            setStatus({ type: 'success', message: `Thank you for signing up as a ${formData.role}! We'll be in touch.` });
            setFormData({
                role: formData.role, 
                email: '', 
                phone: '', 
                address: ''
            });
        } catch (e) {
            console.error("Error submitting contact info: ", e);
            setStatus({ type: 'error', message: "Submission failed due to a database error." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-900";
    const labelClasses = "block text-sm font-medium text-gray-200 mb-1 mt-3";

    return (
        <section id="sign-up-form" className="py-20 bg-red-700 text-white rounded-t-2xl">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                    Join the Tenda Care Community
                </h2>
                <p className="text-xl text-red-200 mb-10">
                    Sign up to receive specialized support, news, and opportunities tailored to your role.
                </p>

                {status && (
                    <div className={`p-4 mb-6 rounded-lg font-semibold ${status.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-800 text-white'}`} role="alert">
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-red-800 p-8 rounded-xl shadow-2xl space-y-4">
                    <div className="mb-6">
                        <label className="block text-xl font-bold mb-3">I am a:</label>
                        <div className="flex justify-center space-x-6">
                            <label className="flex items-center space-x-2 cursor-pointer p-3 bg-red-700 rounded-lg hover:bg-red-600 transition duration-150">
                                <input
                                    type="radio"
                                    name="role"
                                    value="PWD"
                                    checked={formData.role === 'PWD'}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-white border-white bg-red-700 focus:ring-red-500"
                                    aria-label="I am a Person with a Disability"
                                />
                                <span className="font-semibold">Person with a Disability (PWD)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer p-3 bg-red-700 rounded-lg hover:bg-red-600 transition duration-150">
                                <input
                                    type="radio"
                                    name="role"
                                    value="Caregiver"
                                    checked={formData.role === 'Caregiver'}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-white border-white bg-red-700 focus:ring-red-500"
                                    aria-label="I am a Parent or Caregiver"
                                />
                                <span className="font-semibold">Parent / Caregiver</span>
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="email" className={labelClasses}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="e.g., yourname@example.com"
                            aria-describedby="email-help"
                        />
                        <p id="email-help" className="text-xs text-red-200 text-left mt-1">We respect your privacy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="e.g., +254 7XX XXX XXX"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className={labelClasses}>Home Address (Optional)</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="For local services/equipment delivery"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-6 px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-200 transition duration-300 shadow-xl disabled:opacity-50"
                        aria-label={isSubmitting ? "Submitting..." : "Sign Up for Community Support"}
                    >
                        {isSubmitting ? 'Submitting...' : 'Sign Up for Tenda Care'}
                    </button>
                </form>

                <p className="mt-8 text-sm text-red-200">Your current, temporary Tenda Care ID is: <span className="font-mono">{userId}</span></p>
            </div>
        </section>
    );
};


// --- Main App Component ---

const App = () => {
    const [currentPage, setCurrentPage] = useState(PAGES.HOME);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // --- Firebase State ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // 1. Initialize Firebase and Authenticate User
    useEffect(() => {
        try {
            // Set Firestore log level for debugging (optional but recommended)
            setLogLevel('Debug');
            
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const authInstance = getAuth(app);
            
            setDb(firestore);
            setAuth(authInstance);

            const unsubscribe = onAuthStateChanged(authInstance, (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    // Sign in anonymously if no token is available
                    signInAnonymously(authInstance)
                        .then(anonUser => setUserId(anonUser.user.uid))
                        .catch(err => console.error("Anonymous sign-in failed:", err));
                }
                setIsAuthReady(true);
            });

            // Use the provided custom token if available
            if (initialAuthToken) {
                signInWithCustomToken(authInstance, initialAuthToken)
                    .catch(err => console.error("Custom token sign-in failed:", err));
            }

            return () => unsubscribe();
        } catch (e) {
            console.error("Firebase Initialization Error:", e);
            // Fallback for non-authenticated user identification
            setUserId(crypto.randomUUID());
            setIsAuthReady(true);
        }
    }, []); 

    // Helper Functions
    const handleNavClick = (page) => {
        setCurrentPage(page);
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
        // This is crucial for screen reader users when routing in a single-page app:
        // Move focus to the main content area after the page changes.
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.setAttribute('tabIndex', '-1');
            mainContent.focus();
            mainContent.removeAttribute('tabIndex');
        }
        window.scrollTo(0, 0);
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const customStyles = {
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#f9fafb',
    };

    const headerShadow = "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.06)]";

    const renderPage = () => {
        // Ensure authentication is ready before rendering pages that might need the userId
        if (!isAuthReady) {
            return (
                <div className="py-20 text-center text-red-700 font-semibold">
                    <div className="animate-pulse">Loading Application...</div>
                </div>
            );
        }

        switch (currentPage) {
            case PAGES.HOME:
                return <HomePage setPage={handleNavClick} />;
            case PAGES.RESOURCES:
                // Pass necessary Firebase state (though only userId is used in this file for display)
                return <ResourcesPage setPage={handleNavClick} userId={userId} appId={appId} />; 
            case PAGES.THERAPIES:
                return <TherapiesPage />;
            case PAGES.RESEARCH:
                return <ResearchPage />;
            case PAGES.EXCHANGE:
                // Pass db, userId, and appId to the Exchange page for Firestore operations
                return <EquipmentExchangePage db={db} userId={userId} appId={appId} />; 
            case PAGES.GET_INVOLVED:
            default:
                if (currentPage === PAGES.GET_INVOLVED) {
                    setTimeout(() => {
                        document.getElementById('sign-up-form')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                    return (
                        <>
                            <HomePage setPage={handleNavClick} />
                            {/* This is the new, primary CTA form */}
                            <GetInvolvedForm db={db} userId={userId} appId={appId} /> 
                        </>
                    );
                }
                return <HomePage setPage={handleNavClick} />;
        }
    };

    return (
        <div className="text-gray-900" style={customStyles}>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:block absolute left-0 top-0 bg-red-700 text-white p-3 z-[999] rounded-br-lg">Skip to main content</a>
            {/* Header and Navigation */}
            <header className={`${headerShadow} bg-white sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo/Title - Always returns to HOME */}
                        <button onClick={() => handleNavClick(PAGES.HOME)} className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-700 rounded-lg p-2" aria-label="Tenda Care - Home">
                            <LogoIcon />
                            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Tenda Care</span>
                        </button>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8" aria-label="Main Navigation">
                            {navLinks.map(link => (
                                <button
                                    key={link.page}
                                    onClick={() => handleNavClick(link.page)}
                                    className={`font-medium transition duration-150 ${currentPage === link.page ? 'text-red-700 border-b-2 border-red-700' : 'text-gray-600 hover:text-red-700'}`}
                                    aria-current={currentPage === link.page ? 'page' : undefined}
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                onClick={() => handleNavClick(PAGES.GET_INVOLVED)}
                                className="text-white bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-semibold transition duration-150 shadow-md"
                                aria-label="Get Involved (Call to Action)"
                            >
                                Get Involved
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            id="mobile-menu-btn"
                            className="md:hidden text-gray-900 hover:text-red-700 p-2 rounded-lg transition duration-150"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            onClick={toggleMenu}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <nav id="mobile-menu" className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-xl py-2`} aria-label="Mobile Navigation">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                        {navLinks.map(link => (
                            <button
                                key={link.page}
                                onClick={() => handleNavClick(link.page)}
                                className="text-gray-900 hover:bg-red-50 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium text-left"
                                aria-current={currentPage === link.page ? 'page' : undefined}
                            >
                                {link.label}
                            </button>
                        ))}
                        <button
                            onClick={() => handleNavClick(PAGES.GET_INVOLVED)}
                            className="text-white bg-red-700 hover:bg-red-800 block px-3 py-2 rounded-md text-base font-medium mt-2 text-center"
                            aria-label="Get Involved (Call to Action)"
                        >
                            Get Involved
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content Router - Added ID for focus management */}
            <main id="main-content" role="main">
                {renderPage()}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8" role="contentinfo">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {userId && isAuthReady && (
                        <p className="text-gray-400 text-sm mb-2">Authenticated User ID: <span className="text-red-400 font-mono break-all">{userId}</span></p>
                    )}
                    <p className="text-gray-400 text-sm">© 2024 Tenda Care. Built on the principle of Inclusion. All rights reserved.</p>
                    <div className="mt-4 space-x-4">
                        <button onClick={() => handleNavClick(PAGES.HOME)} className="text-gray-400 hover:text-red-400 transition duration-150">Privacy Policy</button>
                        <button onClick={() => handleNavClick(PAGES.HOME)} className="text-gray-400 hover:text-red-400 transition duration-150">Terms of Use</button>
                        <button onClick={() => handleNavClick(PAGES.HOME)} className="text-gray-400 hover:text-red-400 transition duration-150">Accessibility Statement</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;