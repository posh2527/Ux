"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, Zap, Layout, Eye, 
  ArrowLeft, Download, Sparkles, Wand2, Copy, Check, MousePointer2,
  Flame, CheckCircle, Activity, Info, FileDown, Scan
} from 'lucide-react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- Reusable UI Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className={`bg-[#0f172a]/80 border border-[#1e293b] rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md hover:border-slate-700/50 transition-all duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

const ScoreCircle = ({ label, score, color }: { label: string, score: number, color: string }) => {
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => { if (displayScore < score) setDisplayScore(prev => prev + 1); }, 20);
    return () => clearTimeout(timer);
  }, [displayScore, score]);

  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className={`relative w-24 h-24 rounded-full border-[6px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-[0_0_20px_rgba(34,211,238,0.1)] ${color}`}>
        <span className="text-2xl font-black text-white tracking-tighter">{displayScore}%</span>
      </div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  );
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'standard' | 'heatmap' | 'simulation'>('standard');
  const [copied, setCopied] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const issues = [
    { 
      id: 0, title: "Low Contrast Text", severity: "Critical", color: "text-red-500", bg: "bg-red-500/20",
      impact: "Fails WCAG 2.1 AA Standards (Ratio 2.1:1)", ruleValid: true,
      reason: "The footer text 'Privacy Policy' is unreadable for colorblind users. AI Vision flagged contrast violation.",
      code: "/* Remediation: High Contrast Patch */\n.footer-text {\n  color: #FFFFFF !important;\n  text-shadow: 0 1px 2px rgba(0,0,0,0.5);\n}",
      box: { top: '22%', left: '58%', width: '32%', height: '12%' }
    },
    { 
      id: 1, title: "Tiny Touch Target", severity: "High", color: "text-orange-500", bg: "bg-orange-500/20",
      impact: "Violates Nielsen Heuristic #7", ruleValid: true,
      reason: "Mobile menu trigger is <44px. Predicted 24% accidental click rate by AI simulation.",
      code: "/* Remediation: Touch Target Expansion */\n.mobile-nav-toggle {\n  padding: 12px;\n  min-width: 44px;\n  min-height: 44px;\n}",
      box: { top: '68%', left: '42%', width: '18%', height: '10%' }
    }
  ];

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2, backgroundColor: "#030712" });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('Vantage-Pro-Audit-Report.pdf');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(issues[selectedIssue].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-6">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-t-4 border-cyan-400 border-r-4 border-r-transparent rounded-full" />
      <div className="text-center">
        <p className="text-cyan-400 font-black tracking-[0.4em] text-[10px] uppercase animate-pulse">Running Hybrid Engine</p>
        <p className="text-slate-600 text-[9px] mt-2 font-bold uppercase italic">Cross-Validating AI Vision with Nielsen Heuristics</p>
      </div>
    </div>
  );

  return (
    <main ref={dashboardRef} className={`min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 transition-all duration-700 ${viewMode === 'simulation' ? 'grayscale brightness-90 contrast-125' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 border-b border-slate-800 pb-8">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-all text-[9px] font-black uppercase tracking-[0.2em]">
              <ArrowLeft size={12} /> Return to Analyzer
            </Link>
            <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter">VANTAGE <span className="text-cyan-400">PRO</span></h1>
          </div>
          
          <div className="flex flex-wrap gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
            <button onClick={() => setViewMode('standard')} className={`px-6 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${viewMode === 'standard' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'text-slate-500 hover:text-white'}`}>STANDARD</button>
            <button onClick={() => setViewMode('heatmap')} className={`px-6 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all flex items-center gap-2 ${viewMode === 'heatmap' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-white'}`}>
              <Flame size={14} /> HEATMAP
            </button>
            <button onClick={() => setViewMode('simulation')} className={`px-6 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${viewMode === 'simulation' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-white'}`}>VISION SIM</button>
            <div className="w-[1px] bg-slate-800 mx-2" />
            <button onClick={handleExportPDF} className="bg-white text-black px-6 py-3 rounded-xl font-black text-[9px] tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-2">
              <FileDown size={14} /> EXPORT
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Scoring & Hybrid Logic Indicator */}
          <Card className="md:col-span-4 flex flex-col items-center justify-center gap-8">
            <div className="flex gap-8">
              <ScoreCircle label="UX Rating" score={78} color="border-cyan-400" />
              <ScoreCircle label="Accessibility" score={62} color="border-purple-500" />
            </div>
            <div className="w-full pt-6 border-t border-slate-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Audit Logic</span>
                <span className="text-[9px] font-black text-emerald-400 uppercase">Hybrid Active</span>
              </div>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                 <CheckCircle className="text-emerald-500" size={16} />
                 <p className="text-[10px] font-bold text-slate-300">Nielsen Heuristics & WCAG 2.1 Cross-Validated.</p>
              </div>
            </div>
          </Card>

          {/* AI Executive Summary */}
          <Card className="md:col-span-8 flex items-center gap-8 border-l-4 border-cyan-400">
            <div className="hidden md:flex p-6 bg-cyan-400/10 rounded-3xl border border-cyan-400/20">
              <Sparkles className="text-cyan-400" size={32} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black uppercase italic tracking-widest text-sm">Automated Briefing</h3>
                <span className="px-2 py-0.5 bg-slate-800 rounded text-[8px] font-black text-cyan-400">CONTEXT: SAAS DASHBOARD</span>
              </div>
              <p className="text-slate-400 text-[12px] leading-relaxed font-bold italic">
                "The analysis identifies high friction in the <span className="text-white">checkout funnel</span>. 
                Visual attention is leaking toward non-interactive elements in the footer. 
                Generated <span className="text-cyan-400">remediation patches</span> can improve conversion by an estimated 12%."
              </p>
            </div>
          </Card>

          {/* Attention Heatmap / Inspection Window */}
          <Card className="md:col-span-8 overflow-hidden relative min-h-[500px] border-2 border-slate-800">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                 <Scan size={14} className="text-cyan-400" /> Visual Inspection Window
               </h3>
               {viewMode === 'heatmap' && (
                 <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-black text-orange-500 animate-pulse">
                   PREDICTIVE ATTENTION MAP ACTIVE
                 </motion.span>
               )}
            </div>
            
            <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-slate-900 bg-black group">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bbbda5366391?w=1200" 
                className={`w-full transition-all duration-1000 ${viewMode === 'heatmap' ? 'blur-md brightness-50 contrast-125' : 'opacity-40 grayscale hover:opacity-100 transition-opacity'}`} 
              />
              
              <AnimatePresence>
                {viewMode === 'heatmap' && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-red-600/60 via-yellow-400/40 to-blue-500/20 mix-blend-overlay pointer-events-none" 
                  />
                )}
              </AnimatePresence>

              {/* Dynamic Scan Area */}
              <motion.div 
                animate={{ ...issues[selectedIssue].box }} 
                transition={{ type: 'spring', stiffness: 100 }}
                className="absolute border-[3px] border-cyan-400 bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.4)] z-10"
              >
                <div className="absolute inset-0 w-full h-[2px] bg-cyan-400/80 top-0 animate-scan" />
                <div className="absolute -top-6 left-0 bg-cyan-400 text-black px-2 py-0.5 text-[8px] font-black uppercase">
                  ISSUE #{issues[selectedIssue].id + 1}
                </div>
              </motion.div>
            </div>
          </Card>

          {/* Issue Remediation Side Panel */}
          <div className="md:col-span-4 space-y-4">
            <Card className="h-full space-y-6">
              <div className="flex justify-between items-start">
                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${issues[selectedIssue].bg} ${issues[selectedIssue].color}`}>
                  {issues[selectedIssue].severity} SEVERITY
                </span>
                <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg text-[8px] font-black">
                  <CheckCircle size={10} /> VALIDATED
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">User Impact</h4>
                  <p className="text-[12px] text-white font-bold leading-tight">{issues[selectedIssue].impact}</p>
                </div>
                <div>
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Root Cause</h4>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{issues[selectedIssue].reason}</p>
                </div>
              </div>

              {/* Code Patch Block */}
              <div className="relative group">
                <div className="absolute -top-2 -left-2 bg-emerald-500 text-black px-2 py-0.5 text-[8px] font-black rounded z-20">AUTO-FIX</div>
                <div className="p-5 bg-black/80 rounded-2xl border border-slate-800 group-hover:border-emerald-500/30 transition-all font-mono">
                  <pre className="text-[10px] text-emerald-400 leading-relaxed overflow-x-auto">
                    {issues[selectedIssue].code}
                  </pre>
                  <button 
                    onClick={handleCopyCode}
                    className="absolute right-4 top-4 p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Issue Toggle List */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Backlog</h4>
                <div className="grid grid-cols-1 gap-2">
                  {issues.map((issue, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedIssue(idx)} 
                      className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${selectedIssue === idx ? 'bg-cyan-400/10 border-cyan-400/50' : 'bg-slate-950/50 border-slate-900 hover:border-slate-700'}`}
                    >
                      <span className="text-[10px] font-black text-white uppercase">{issue.title}</span>
                      <Activity size={12} className={selectedIssue === idx ? 'text-cyan-400' : 'text-slate-700'} />
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Component Redesign Visual Slider */}
          <Card className="md:col-span-12">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-white font-black uppercase italic flex items-center gap-3 tracking-tighter text-xl">
                 <Wand2 size={24} className="text-purple-400" /> Component-Level Redesign
               </h3>
               <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-500">
                  <span>Current UI</span>
                  <div className="w-12 h-[2px] bg-slate-800" />
                  <span className="text-cyan-400">Vantage Patch</span>
               </div>
            </div>
            
            <div className="relative aspect-[21/6] rounded-[3rem] overflow-hidden border-4 border-slate-900 group shadow-inner">
              {/* After (Improved State) */}
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center p-12">
                 <div className="w-full max-w-xl flex flex-col items-center gap-6">
                    <div className="w-full h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl shadow-cyan-500/20 flex items-center justify-center">
                       <span className="text-black font-black uppercase tracking-widest text-sm">Improved Hero Action</span>
                    </div>
                    <div className="flex gap-4 w-full">
                       <div className="h-4 bg-slate-800 w-full rounded-full" />
                       <div className="h-4 bg-slate-800 w-2/3 rounded-full" />
                    </div>
                 </div>
              </div>

              {/* Before (Original State) */}
              <div 
                className="absolute inset-0 bg-[#030712] flex items-center justify-center grayscale brightness-50" 
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                 <div className="w-full max-w-xl opacity-20 space-y-6">
                    <div className="w-full h-12 bg-slate-700 rounded-lg border border-slate-600" />
                    <div className="w-3/4 h-3 bg-slate-800 rounded-full mx-auto" />
                 </div>
              </div>
              
              {/* Interactive Range Input */}
              <input 
                type="range" min="0" max="100" value={sliderPos} 
                onChange={(e) => setSliderPos(parseInt(e.target.value))} 
                className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-ew-resize" 
              />
              
              {/* Divider Line */}
              <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] z-40 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <MousePointer2 size={20} className="text-black" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}