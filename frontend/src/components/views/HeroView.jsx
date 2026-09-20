import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dna, 
  ArrowRight, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Network, 
  Fingerprint, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Database, 
  UploadCloud, 
  FileCheck,
  ChevronRight
} from 'lucide-react';

const HeroView = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col stack-sans-notch text-[#1f1f1f]">
      {/* ------------------------------------------------------------- */}
      {/* Navigation Bar                                                */}
      {/* ------------------------------------------------------------- */}
      <nav className="w-full py-5 px-6 sm:px-12 lg:px-16 flex justify-between items-center border-b border-[#f0f0ed] sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-[#102d25] rounded-[8px] flex items-center justify-center shadow-sm">
            <Dna size={18} className="text-white" />
          </div>
          <span className="font-medium text-[19px] tracking-tight text-[#1f1f1f]">
            CrimeNexus
          </span>
        </div>

        {/* Clean Nav Links connected to sections */}
        <div className="hidden md:flex items-center gap-8 text-[15px] text-[#1f1f1f] font-medium">
          <button 
            onClick={() => scrollToSection('features')}
            className="hover:opacity-70 transition-opacity cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('use-cases')}
            className="hover:opacity-70 transition-opacity cursor-pointer"
          >
            Use cases
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hover:opacity-70 transition-opacity cursor-pointer"
          >
            How it works
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate('/login')}
            className="text-[15px] font-medium text-[#1f1f1f] hover:opacity-70 transition-opacity cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/c')}
            className="text-[15px] font-medium text-white bg-[#102d25] px-6 py-2.5 rounded-full hover:bg-[#0a1f19] transition-colors shadow-sm cursor-pointer"
          >
            Start Investigating
          </button>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* Hero Section                                                  */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col lg:flex-row items-center px-6 sm:px-12 lg:px-16 max-w-screen-2xl mx-auto w-full py-12 lg:py-20 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="flex-1 max-w-[640px]">
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-[#1a1a1a] tracking-tight leading-[1.05] mb-7">
            Investigate{' '}
            <span className="relative inline-block">
              smarter.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 260 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 7 C65 2, 195 2, 258 7" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-[#555] text-lg sm:text-xl leading-relaxed mb-10 max-w-[500px]">
            AI-powered digital forensics — analyze evidence, build timelines, uncover connections, and get answers from your case files instantly.
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap gap-4 mb-14">
            <button
              onClick={() => navigate('/c')}
              className="bg-[#1f1f1f] text-white font-bold px-8 py-4 rounded-full text-[16px] hover:bg-black transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Start Investigating</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-[#1f1f1f] font-bold px-8 py-4 rounded-full text-[16px] border border-[#d4d4d4] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-start gap-8 sm:gap-10 pb-6">
            <div>
              <p className="text-3xl sm:text-[44px] font-black text-[#1a1a1a] tracking-tight leading-none">98.4%</p>
              <p className="text-[#888] text-[15px] mt-2 font-medium">Evidence accuracy</p>
            </div>
            <div className="w-px h-16 bg-gray-200 mt-1" />
            <div>
              <p className="text-3xl sm:text-[44px] font-black text-[#1a1a1a] tracking-tight leading-none">~10x</p>
              <p className="text-[#888] text-[15px] mt-2 font-medium">Faster case analysis</p>
            </div>
            <div className="w-px h-16 bg-gray-200 mt-1 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-3xl sm:text-[44px] font-black text-[#1a1a1a] tracking-tight leading-none">0%</p>
              <p className="text-[#888] text-[15px] mt-2 font-medium">Model hallucination</p>
            </div>
          </div>
        </div>

        {/* Right Column - Illustration */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="relative w-full max-w-[640px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#e8e8e4]">
            <img
              src="/illustrater.jpg"
              alt="CrimeNexus Forensic Dashboard Illustration"
              className="w-full h-auto object-contain block"
            />
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* Section 1: Features                                           */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-24 px-6 sm:px-12 lg:px-16 border-t border-[#f0f0ed] bg-[#fbfbfa]">
        <div className="max-w-screen-2xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[#102d25] bg-[#102d25]/5 border border-[#102d25]/15 px-3.5 py-1 rounded-full mb-3">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] tracking-tight mb-4">
              Precision Engineering for Forensic Evidence
            </h2>
            <p className="text-[#666] text-lg leading-relaxed">
              Purpose-built retrieval and analytical pipelines designed specifically for digital evidence integrity and zero-gap case analysis.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8e8e4] hover:border-[#102d25]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#102d25]/5 border border-[#102d25]/10 flex items-center justify-center mb-6 text-[#102d25]">
                <FileText size={22} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#102d25] bg-[#102d25]/5 px-2.5 py-0.5 rounded-full">
                  Docling Integration
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                Evidence Ingestion
              </h3>
              <p className="text-[#555] text-base leading-relaxed">
                Multi-format parsing for PDF, DOCX, DOC, PPTX, RTF, logs, emails, and CSV. Preserves tables, metadata, and structural layouts via Docling models rather than flattening evidence to an unreadable wall of text.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8e8e4] hover:border-[#102d25]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#102d25]/5 border border-[#102d25]/10 flex items-center justify-center mb-6 text-[#102d25]">
                <Search size={22} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#102d25] bg-[#102d25]/5 px-2.5 py-0.5 rounded-full">
                  5x Multi-Query Pipeline
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                Multi-Query MMR RAG
              </h3>
              <p className="text-[#555] text-base leading-relaxed">
                Rewrites investigative questions into 4 alternate phrasings alongside the original. Each runs through an MMR retriever (k=4, fetch_k=8) that trades off pure similarity against diversity, merging approximately 20 unique evidence chunks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8e8e4] hover:border-[#102d25]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#102d25]/5 border border-[#102d25]/10 flex items-center justify-center mb-6 text-[#102d25]">
                <CheckCircle2 size={22} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#102d25] bg-[#102d25]/5 px-2.5 py-0.5 rounded-full">
                  Verifiable Citations
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                Factual Evidence Grounding
              </h3>
              <p className="text-[#555] text-base leading-relaxed">
                Every claim is cited with its exact source filename. Answers come structured with an explicit Evidence Gaps audit that directly reports what could not be substantiated from the documents, strictly preventing generative hallucination.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8e8e4] hover:border-[#102d25]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#102d25]/5 border border-[#102d25]/10 flex items-center justify-center mb-6 text-[#102d25]">
                <Activity size={22} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#102d25] bg-[#102d25]/5 px-2.5 py-0.5 rounded-full">
                  Score 0-100 Triage
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                Anomaly Triage
              </h3>
              <p className="text-[#555] text-base leading-relaxed">
                Automatic multi-dimensional scoring evaluating temporal conflicts, behavioral anomalies, and structural patterns out of 100. Pinpoints high-risk documents immediately so legal examiners know exactly which file to inspect first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Section 2: Use Cases                                          */}
      {/* ------------------------------------------------------------- */}
      <section id="use-cases" className="py-24 px-6 sm:px-12 lg:px-16 border-t border-[#f0f0ed] bg-white">
        <div className="max-w-screen-2xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[#102d25] bg-[#102d25]/5 border border-[#102d25]/15 px-3.5 py-1 rounded-full mb-3">
              Operational Workflows
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] tracking-tight mb-4">
              Built for High-Stakes Forensic Investigations
            </h2>
            <p className="text-[#666] text-lg leading-relaxed">
              Explore how investigators, legal analysts, and cyber-forensic teams unravel complex cases with CrimeNexus.
            </p>
          </div>

          {/* 4 Use Case Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Use Case 1 */}
            <div className="p-7 rounded-3xl bg-[#fafafa] border border-[#e8e8e4] flex flex-col justify-between hover:bg-white hover:border-[#102d25]/30 hover:shadow-md transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#102d25]/5 flex items-center justify-center mb-5 text-[#102d25]">
                  <Clock size={20} />
                </div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#888] block mb-1">
                  Chronological Audit
                </span>
                <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                  Timeline Reconstruction
                </h3>
                <p className="text-[#666] text-sm leading-relaxed mb-6">
                  Chronologically orders events buried across multi-source evidence, with actor and artifact attribution and confidence metrics so guesses are never mistaken for facts.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e8e8e4] text-xs font-semibold text-[#102d25] flex items-center gap-1">
                <span>Filter by Individual Actor</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="p-7 rounded-3xl bg-[#fafafa] border border-[#e8e8e4] flex flex-col justify-between hover:bg-white hover:border-[#102d25]/30 hover:shadow-md transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#102d25]/5 flex items-center justify-center mb-5 text-[#102d25]">
                  <Network size={20} />
                </div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#888] block mb-1">
                  Graph Intelligence
                </span>
                <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                  User Profiling & Entity Mapping
                </h3>
                <p className="text-[#666] text-sm leading-relaxed mb-6">
                  Dynamic knowledge graph exposing relationships, communication loops, and suspicious accomplice clusters. Switch between force-directed graph view and itemized entity lists.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e8e8e4] text-xs font-semibold text-[#102d25] flex items-center gap-1">
                <span>Interactive Force Topology</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="p-7 rounded-3xl bg-[#fafafa] border border-[#e8e8e4] flex flex-col justify-between hover:bg-white hover:border-[#102d25]/30 hover:shadow-md transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#102d25]/5 flex items-center justify-center mb-5 text-[#102d25]">
                  <Fingerprint size={20} />
                </div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#888] block mb-1">
                  Forensic Discovery
                </span>
                <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                  Insider Threat & Deception
                </h3>
                <p className="text-[#666] text-sm leading-relaxed mb-6">
                  Semantic cue detection within unstructured chats, emails, and audit trails to uncover policy violations, unauthorized exfiltration, and cross-party communication leaks.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e8e8e4] text-xs font-semibold text-[#102d25] flex items-center gap-1">
                <span>Verbatim Text Citation</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Use Case 4 */}
            <div className="p-7 rounded-3xl bg-[#fafafa] border border-[#e8e8e4] flex flex-col justify-between hover:bg-white hover:border-[#102d25]/30 hover:shadow-md transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#102d25]/5 flex items-center justify-center mb-5 text-[#102d25]">
                  <Layers size={20} />
                </div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#888] block mb-1">
                  Persistent Dossier
                </span>
                <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                  Court-Ready Notes
                </h3>
                <p className="text-[#666] text-sm leading-relaxed mb-6">
                  Interactive side-panel that follows you across tabs. Drag entities, timeline milestones, or raw files into notes as clickable deep links that persist per investigation session.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e8e8e4] text-xs font-semibold text-[#102d25] flex items-center gap-1">
                <span>Session Tagging & Export</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Section 3: How It Works                                       */}
      {/* ------------------------------------------------------------- */}
      <section id="how-it-works" className="py-24 px-6 sm:px-12 lg:px-16 border-t border-[#f0f0ed] bg-[#fbfbfa]">
        <div className="max-w-screen-2xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[#102d25] bg-[#102d25]/5 border border-[#102d25]/15 px-3.5 py-1 rounded-full mb-3">
              Workflow Guide
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] tracking-tight mb-4">
              From Raw Evidence to Clear Proof in Three Steps
            </h2>
            <p className="text-[#666] text-lg leading-relaxed">
              Zero manual vector plumbing. Fast, intuitive, and isolated by default.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8e8e4] relative hover:shadow-md transition-all duration-300">
              <div className="text-2xl font-black text-[#102d25] bg-[#102d25]/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 font-mono">
                01
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                Create Session & Upload
              </h3>
              <p className="text-[#555] text-base leading-relaxed">
                Create an isolated case session and upload raw evidence files or complete ZIP archives. Cryptographic SHA-256 hashes are automatically calculated to preserve chain-of-custody.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8e8e4] relative hover:shadow-md transition-all duration-300">
              <div className="text-2xl font-black text-[#102d25] bg-[#102d25]/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 font-mono">
                02
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                Extract, Index & Score
              </h3>
              <p className="text-[#555] text-base leading-relaxed">
                The backend ingests structured tables, extracts key actors and dates, generates embeddings into an isolated Chroma collection, and flags anomalous behavioral patterns.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8e8e4] relative hover:shadow-md transition-all duration-300">
              <div className="text-2xl font-black text-[#102d25] bg-[#102d25]/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 font-mono">
                03
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-3">
                Query & Trace Evidence
              </h3>
              <p className="text-[#555] text-base leading-relaxed">
                Ask investigative questions with grounded citations, interactively explore actor graphs, inspect chronological event milestones, and synthesize findings into persistent notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Bottom CTA Banner                                             */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 bg-[#102d25] text-white">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
              Ready to accelerate your forensic investigations?
            </h2>
            <p className="text-white/80 text-lg">
              Start exploring your case evidence with AI-assisted clarity, strict citations, and zero hallucinations.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button
              onClick={() => navigate('/c')}
              className="bg-white text-[#102d25] font-bold px-8 py-4 rounded-full text-base hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Launch CrimeNexus</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-white font-bold px-8 py-4 rounded-full text-base border border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Footer                                                        */}
      {/* ------------------------------------------------------------- */}
      <footer className="py-10 px-6 sm:px-12 lg:px-16 border-t border-[#f0f0ed] bg-white text-xs text-[#888]">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#102d25] rounded-[6px] flex items-center justify-center">
              <Dna size={14} className="text-white" />
            </div>
            <span className="font-semibold text-[#1f1f1f]">CrimeNexus</span>
            <span>— AI-Powered Digital Forensics & Investigation Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#1f1f1f] transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('use-cases')} className="hover:text-[#1f1f1f] transition-colors cursor-pointer">Use Cases</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#1f1f1f] transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => navigate('/login')} className="hover:text-[#1f1f1f] transition-colors cursor-pointer">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroView;
