import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dna,
  ArrowRight,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  Network,
  Fingerprint,
  Layers,
  Activity,
  ChevronRight
} from 'lucide-react';

const lightCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M3 3l7.5 18 2.5-7.5L20.5 11z'/%3E%3C/svg%3E"), auto`;
const darkCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M3 3l7.5 18 2.5-7.5L20.5 11z'/%3E%3C/svg%3E"), auto`;

const featuresData = [
  {
    icon: FileText,
    badge: "Docling Integration",
    title: "Evidence Ingestion",
    description: "Multi-format parsing for PDF, DOCX, logs, emails, and tables. Preserves structural layouts, tables, and document metadata via Docling without flattening evidence to an unreadable text stream."
  },
  {
    icon: Search,
    badge: "Multi-Query MMR",
    title: "Multi-Query MMR RAG",
    description: "Generates 5 distinct investigative queries and extracts diverse, deduplicated evidence chunks using Maximal Marginal Relevance (MMR) retrieval, avoiding repetitive search artifacts."
  },
  {
    icon: CheckCircle2,
    badge: "Verifiable Citations",
    title: "Factual Evidence Grounding",
    description: "Every finding is strictly cited with its exact source filename. Answers include an explicit Evidence Gaps audit that surfaces unverified details and prevents hallucinations."
  },
  {
    icon: Activity,
    badge: "Score 0-100 Triage",
    title: "Anomaly Triage",
    description: "Evaluates temporal conflicts, behavioral shifts, and structural anomalies on a 0–100 risk score, pinpointing suspicious files and critical discrepancies immediately."
  }
];

const useCasesData = [
  {
    icon: Clock,
    badge: "Chronological Audit",
    title: "Timeline Reconstruction",
    description: "Chronologically orders events buried across multi-source evidence, with actor and artifact attribution and confidence metrics so guesses are never mistaken for facts.",
    action: "Filter by Individual Actor"
  },
  {
    icon: Network,
    badge: "Graph Intelligence",
    title: "User Profiling & Entity Mapping",
    description: "Dynamic knowledge graph exposing relationships, communication loops, and suspicious accomplice clusters. Switch between force-directed graph view and itemized entity lists.",
    action: "Interactive Force Topology"
  },
  {
    icon: Fingerprint,
    badge: "Forensic Discovery",
    title: "Insider Threat & Deception",
    description: "Semantic cue detection within unstructured chats, emails, and audit trails to uncover policy violations, unauthorized exfiltration, and cross-party communication leaks.",
    action: "Verbatim Text Citation"
  },
  {
    icon: Layers,
    badge: "Persistent Dossier",
    title: "Court-Ready Notes",
    description: "Interactive side-panel that follows you across tabs. Drag entities, timeline milestones, or raw files into notes as clickable deep links that persist per investigation session.",
    action: "Session Tagging & Export"
  }
];

const stepsData = [
  {
    num: "01",
    title: "Create Session & Upload",
    description: "Create an isolated case session and upload raw evidence files or complete ZIP archives. Cryptographic SHA-256 hashes are automatically calculated to preserve chain-of-custody."
  },
  {
    num: "02",
    title: "Extract, Index & Score",
    description: "The backend ingests structured tables, extracts key actors and dates, generates embeddings into an isolated Chroma collection, and flags anomalous behavioral patterns."
  },
  {
    num: "03",
    title: "Query & Trace Evidence",
    description: "Ask investigative questions with grounded citations, interactively explore actor graphs, inspect chronological event milestones, and synthesize findings into persistent notes."
  }
];

const HeroView = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('nexus_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    localStorage.setItem('nexus_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const theme = isDark ? {
    bgPage: '#0f1013',
    bgSection: '#15171c',        // Core Capabilities tone
    navBg: 'rgba(21, 23, 28, 0.94)', // Matching Core Capabilities
    bgCard: '#1b1d24',
    bgCardAlt: '#20232c',
    border: '#292c35',
    borderSubtle: '#22252e',
    textHeading: '#ffffff',
    textBody: '#c4c6ce',
    textMuted: '#9aa0ad',
    navPillBg: '#1f222a',        // Mild dark button tone
    navPillText: '#f4f4f5',
    navPillBorder: '#2f3340',    // Mild outline
    btnPrimaryBg: '#242732',
    btnPrimaryText: '#ffffff',
    btnPrimaryBorder: '#3d4255',
    btnSecondaryBg: '#191b22',
    btnSecondaryText: '#e2e4ea',
    btnSecondaryBorder: '#2e3240',
    badgeBg: '#22252e',
    ctaBg: '#171920',
    ctaText: '#ffffff'
  } : {
    bgPage: '#ffffff',
    bgSection: '#f7f7f5',
    navBg: 'rgba(255, 255, 255, 0.92)',
    bgCard: '#ffffff',
    bgCardAlt: '#f2f2ef',
    border: '#e4e4df',
    borderSubtle: '#ededeb',
    textHeading: '#111111',
    textBody: '#444446',
    textMuted: '#717175',
    navPillBg: '#f2f2ef',
    navPillText: '#111111',
    navPillBorder: '#e4e4df',
    btnPrimaryBg: '#111111',
    btnPrimaryText: '#ffffff',
    btnPrimaryBorder: '#111111',
    btnSecondaryBg: '#ffffff',
    btnSecondaryText: '#111111',
    btnSecondaryBorder: '#e4e4df',
    badgeBg: '#eeeeea',
    ctaBg: '#f7f7f5',
    ctaText: '#111111'
  };

  return (
    <div
      className="min-h-screen flex flex-col select-none transition-colors duration-200"
      style={{
        backgroundColor: theme.bgPage,
        color: theme.textBody,
        cursor: isDark ? darkCursor : lightCursor
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Navigation Bar (Matches Core Capabilities in Dark Mode)     */}
      {/* ------------------------------------------------------------- */}
      <nav
        className="w-full py-4 px-6 sm:px-12 sticky top-0 backdrop-blur-md z-50 transition-colors duration-200"
        style={{
          backgroundColor: theme.navBg,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#111111',
                color: isDark ? '#111111' : '#ffffff'
              }}
            >
              <Dna size={18} />
            </div>
            <span
              className="font-bold text-lg tracking-tight transition-colors"
              style={{ color: theme.textHeading }}
            >
              CrimeNexus
            </span>
          </div>

          {/* Nav Links (Styled with Mild Dark Outline & Crisp Text) */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => scrollToSection('features')}
              className="px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all cursor-pointer hover:opacity-85"
              style={{
                backgroundColor: theme.navPillBg,
                color: theme.navPillText,
                border: `1px solid ${theme.navPillBorder}`
              }}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className="px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all cursor-pointer hover:opacity-85"
              style={{
                backgroundColor: theme.navPillBg,
                color: theme.navPillText,
                border: `1px solid ${theme.navPillBorder}`
              }}
            >
              Use cases
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all cursor-pointer hover:opacity-85"
              style={{
                backgroundColor: theme.navPillBg,
                color: theme.navPillText,
                border: `1px solid ${theme.navPillBorder}`
              }}
            >
              How it works
            </button>
          </div>

          {/* Action Row: Theme Toggle + Sign In */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:opacity-90"
              style={{
                backgroundColor: theme.navPillBg,
                color: theme.navPillText,
                border: `1px solid ${theme.navPillBorder}`
              }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                  <span>Light</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  <span>Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[13.5px] font-semibold px-5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm hover:opacity-90"
              style={{
                backgroundColor: theme.btnSecondaryBg,
                color: theme.btnSecondaryText,
                border: `1px solid ${theme.btnSecondaryBorder}`
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. Hero Section: Full Viewport with Rounded Floating Image   */}
      {/* ------------------------------------------------------------- */}
      <main className="min-h-[calc(100vh-73px)] flex items-center justify-center w-full px-6 sm:px-12 py-10">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 max-w-[540px] text-left"
          >
            <h1
              className="text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight leading-[1.05] mb-6"
              style={{ color: theme.textHeading }}
            >
              Investigate{' '}
              <span className="relative inline-block">
                smarter.
                <svg
                  className="absolute -bottom-1.5 left-0 w-full"
                  viewBox="0 0 260 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7 C65 2, 195 2, 258 7"
                    stroke={theme.textHeading}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-[480px]"
              style={{ color: theme.textBody }}
            >
              AI-powered digital forensics — analyze evidence, build timelines, uncover connections, and get answers from your case files instantly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 mb-10">
              <button
                type="button"
                onClick={() => navigate('/c')}
                className="font-bold px-7 py-3.5 rounded-full text-[15px] transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: theme.btnPrimaryBg,
                  color: theme.btnPrimaryText,
                  border: `1px solid ${theme.btnPrimaryBorder}`
                }}
              >
                <span>Start Investigating</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold px-6 py-3.5 rounded-full text-[15px] transition-all cursor-pointer hover:opacity-85"
                style={{
                  backgroundColor: theme.btnSecondaryBg,
                  color: theme.btnSecondaryText,
                  border: `1px solid ${theme.btnSecondaryBorder}`
                }}
              >
                Sign In
              </button>
            </div>

            {/* Metrics */}
            <div className="flex items-start gap-6 sm:gap-8 pt-2">
              <div>
                <p
                  className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
                  style={{ color: theme.textHeading }}
                >
                  98.4%
                </p>
                <p className="text-xs sm:text-sm mt-1.5 font-medium" style={{ color: theme.textMuted }}>
                  Evidence accuracy
                </p>
              </div>
              <div className="w-px h-10 mt-1" style={{ backgroundColor: theme.border }} />
              <div>
                <p
                  className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
                  style={{ color: theme.textHeading }}
                >
                  ~10x
                </p>
                <p className="text-xs sm:text-sm mt-1.5 font-medium" style={{ color: theme.textMuted }}>
                  Faster case analysis
                </p>
              </div>
              <div className="w-px h-10 mt-1 hidden sm:block" style={{ backgroundColor: theme.border }} />
              <div className="hidden sm:block">
                <p
                  className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
                  style={{ color: theme.textHeading }}
                >
                  0%
                </p>
                <p className="text-xs sm:text-sm mt-1.5 font-medium" style={{ color: theme.textMuted }}>
                  Model hallucination
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Rounded Floating Graphic Card with Ambient Shadow */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex-1 flex items-center justify-center w-full max-w-[430px] lg:max-w-[460px]"
          >
            <div
              className="w-full rounded-3xl overflow-hidden p-3 transition-all duration-300"
              style={{
                backgroundColor: '#ffffff',
                boxShadow: isDark
                  ? '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                  : '0 20px 45px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px #e8e8e4'
              }}
            >
              <img
                src="/illustrater.jpg"
                alt="Forensic Dashboard Illustration"
                className="w-full h-auto max-h-[350px] object-contain block rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. Section 1: Features                                        */}
      {/* ------------------------------------------------------------- */}
      <section
        id="features"
        className="py-24 px-6 sm:px-12 transition-colors duration-200"
        style={{
          backgroundColor: theme.bgSection,
          borderTop: `1px solid ${theme.border}`
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span
              className="inline-block text-xs uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full mb-3"
              style={{
                backgroundColor: theme.badgeBg,
                border: `1px solid ${theme.border}`,
                color: theme.textHeading
              }}
            >
              Core Capabilities
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3.5"
              style={{ color: theme.textHeading }}
            >
              Precision Engineering for Forensic Evidence
            </h2>
            <p className="text-base leading-relaxed" style={{ color: theme.textBody }}>
              Purpose-built retrieval and analytical pipelines designed specifically for digital evidence integrity and zero-gap case analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuresData.map((feature) => {
              const IconComp = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  whileHover={{ y: -4, scale: 1.015 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 rounded-2xl transition-all duration-200"
                  style={{
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      backgroundColor: theme.badgeBg,
                      border: `1px solid ${theme.borderSubtle}`,
                      color: theme.textHeading
                    }}
                  >
                    <IconComp size={20} />
                  </div>

                  <div className="mb-2">
                    <span
                      className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: theme.badgeBg,
                        border: `1px solid ${theme.borderSubtle}`,
                        color: theme.textMuted
                      }}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-bold tracking-tight mb-2.5"
                    style={{ color: theme.textHeading }}
                  >
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed" style={{ color: theme.textBody }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. Section 2: Use Cases                                       */}
      {/* ------------------------------------------------------------- */}
      <section
        id="use-cases"
        className="py-24 px-6 sm:px-12 transition-colors duration-200"
        style={{
          backgroundColor: theme.bgPage,
          borderTop: `1px solid ${theme.border}`
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span
              className="inline-block text-xs uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full mb-3"
              style={{
                backgroundColor: theme.badgeBg,
                border: `1px solid ${theme.border}`,
                color: theme.textHeading
              }}
            >
              Operational Workflows
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3.5"
              style={{ color: theme.textHeading }}
            >
              Built for High-Stakes Forensic Investigations
            </h2>
            <p className="text-base leading-relaxed" style={{ color: theme.textBody }}>
              Explore how investigators, legal analysts, and cyber-forensic teams unravel complex cases with CrimeNexus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCasesData.map((uc) => {
              const IconComp = uc.icon;
              return (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  whileHover={{ y: -4, scale: 1.015 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-200"
                  style={{
                    backgroundColor: theme.bgCardAlt,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        color: theme.textHeading
                      }}
                    >
                      <IconComp size={18} />
                    </div>

                    <span
                      className="text-[11px] font-mono font-bold uppercase tracking-wider block mb-1.5"
                      style={{ color: theme.textMuted }}
                    >
                      {uc.badge}
                    </span>

                    <h3
                      className="text-lg font-bold tracking-tight mb-2"
                      style={{ color: theme.textHeading }}
                    >
                      {uc.title}
                    </h3>

                    <p className="text-xs leading-relaxed mb-6" style={{ color: theme.textBody }}>
                      {uc.description}
                    </p>
                  </div>

                  <div
                    className="pt-3.5 text-xs font-bold flex items-center justify-between"
                    style={{
                      borderTop: `1px solid ${theme.border}`,
                      color: theme.textHeading
                    }}
                  >
                    <span>{uc.action}</span>
                    <ChevronRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. Section 3: Workflow Guide                                  */}
      {/* ------------------------------------------------------------- */}
      <section
        id="how-it-works"
        className="py-24 px-6 sm:px-12 transition-colors duration-200"
        style={{
          backgroundColor: theme.bgSection,
          borderTop: `1px solid ${theme.border}`
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span
              className="inline-block text-xs uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full mb-3"
              style={{
                backgroundColor: theme.badgeBg,
                border: `1px solid ${theme.border}`,
                color: theme.textHeading
              }}
            >
              Workflow Guide
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3.5"
              style={{ color: theme.textHeading }}
            >
              From Raw Evidence to Clear Proof in Three Steps
            </h2>
            <p className="text-base leading-relaxed" style={{ color: theme.textBody }}>
              Zero manual vector plumbing. Fast, intuitive, and isolated by default.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stepsData.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -4, scale: 1.015 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="p-8 rounded-2xl relative transition-all duration-200"
                style={{
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${theme.border}`
                }}
              >
                <div
                  className="text-xl font-black w-11 h-11 rounded-xl flex items-center justify-center mb-6 font-mono"
                  style={{
                    backgroundColor: theme.badgeBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textHeading
                  }}
                >
                  {step.num}
                </div>

                <h3
                  className="text-xl font-bold tracking-tight mb-2.5"
                  style={{ color: theme.textHeading }}
                >
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: theme.textBody }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. Pre-Footer Banner                                          */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 sm:py-20 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div
            className="p-10 sm:p-14 rounded-3xl transition-all duration-200 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm"
            style={{
              backgroundColor: theme.ctaBg,
              border: `1px solid ${theme.border}`
            }}
          >
            <div className="max-w-xl text-center lg:text-left">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3"
                style={{ color: theme.ctaText }}
              >
                Ready to accelerate your forensic investigations?
              </h2>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: theme.textMuted }}
              >
                Start exploring your case evidence with AI-assisted clarity, strict citations, and zero hallucinations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 items-center justify-center">
              <button
                type="button"
                onClick={() => navigate('/c')}
                className="font-bold px-7 py-3.5 rounded-full text-[15px] transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: theme.btnPrimaryBg,
                  color: theme.btnPrimaryText,
                  border: `1px solid ${theme.btnPrimaryBorder}`
                }}
              >
                <span>Launch CrimeNexus</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold px-6 py-3.5 rounded-full text-[15px] transition-all cursor-pointer hover:opacity-85"
                style={{
                  backgroundColor: theme.btnSecondaryBg,
                  color: theme.btnSecondaryText,
                  border: `1px solid ${theme.btnSecondaryBorder}`
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. Footer (Matches Mild Outline Styling)                      */}
      {/* ------------------------------------------------------------- */}
      <footer
        className="py-8 px-6 sm:px-12 text-xs transition-colors duration-200"
        style={{
          backgroundColor: theme.bgPage,
          borderTop: `1px solid ${theme.border}`
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#111111',
                color: isDark ? '#111111' : '#ffffff'
              }}
            >
              <Dna size={13} />
            </div>
            <span className="font-bold" style={{ color: theme.textHeading }}>
              CrimeNexus
            </span>
            <span className="hidden sm:inline" style={{ color: theme.textMuted }}>
              — AI-Powered Digital Forensics & Investigation Intelligence
            </span>
          </div>

          <div className="flex items-center gap-2.5 font-medium">
            <button
              onClick={() => scrollToSection('features')}
              className="px-3 py-1 rounded-full transition-all cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: theme.navPillBg,
                color: theme.navPillText,
                border: `1px solid ${theme.navPillBorder}`
              }}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className="px-3 py-1 rounded-full transition-all cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: theme.navPillBg,
                color: theme.navPillText,
                border: `1px solid ${theme.navPillBorder}`
              }}
            >
              Use Cases
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3 py-1 rounded-full transition-all cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: theme.navPillBg,
                color: theme.navPillText,
                border: `1px solid ${theme.navPillBorder}`
              }}
            >
              How It Works
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1 rounded-full transition-all cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: theme.navPillBg,
                color: theme.navPillText,
                border: `1px solid ${theme.navPillBorder}`
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroView;