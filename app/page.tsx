"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Upload, Code2, Layers, Cpu, Sparkles, 
  ChevronDown, Zap, FileText, X, Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<'url' | 'screenshot' | 'code' | 'hybrid'>('url');
  const [projectType, setProjectType] = useState("SaaS Dashboard");
  const [framework, setFramework] = useState("React");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [codeContent, setCodeContent] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputModes = [
    { id: 'url', label: 'URL', icon: Globe },
    { id: 'screenshot', label: 'Screenshot', icon: Upload },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'hybrid', label: 'Code + Screenshot', icon: Layers }, 
  ];

  const handleUploadTrigger = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // --- API INTEGRATION LOGIC ---
  const handleRunAudit = async () => {
    // 1. Basic Validation
    if (inputMode === 'screenshot' && !selectedFile) return alert("Please upload a screenshot.");
    if (inputMode === 'url' && !urlValue) return alert("Please enter a URL.");
    if (inputMode === 'code' && !codeContent) return alert("Please paste your code.");
    if (inputMode === 'hybrid' && (!selectedFile || !codeContent)) return alert("Upload both code and screenshot.");

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('mode', inputMode);
      formData.append('projectType', projectType);
      formData.append('framework', framework);
      
      if (selectedFile) formData.append('file', selectedFile);
      if (codeContent) formData.append('code', codeContent);
      if (urlValue) formData.append('url', urlValue);

      // 2. Call Node.js Backend
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        // 3. Store results and navigate to Dashboard
        localStorage.setItem('auditResults', JSON.stringify(result.data));
        router.push('/dashboard');
      } else {
        alert("Analysis Error: " + result.message);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Backend server not responding. Ensure node server.js is running on port 5000.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 overflow-hidden relative font-sans">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-10 flex flex-col items-center">
        {/* Header Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full mb-8">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">Next-Gen Hybrid UI Audit</span>
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.8] text-center mb-12">
          VANTAGE <span className="text-cyan-400">PRO</span>
        </h1>

        {/* Project Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
          <ContextSelector label="App / Website Type" value={projectType} onChange={setProjectType} options={["E-commerce", "SaaS Dashboard", "Landing Page", "Mobile App", "Blog / Content", "AI Chat Interface"]} />
          <ContextSelector label="Dev Framework" value={framework} onChange={setFramework} options={["React", "Tailwind CSS", "HTML / CSS", "Vue", "Bootstrap"]} />
        </div>

        {/* Main Input Card */}
        <div className="w-full max-w-4xl bg-slate-900/30 border-2 border-slate-800/50 rounded-[3rem] p-8 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {inputModes.map((mode) => (
              <button key={mode.id} onClick={() => setInputMode(mode.id as any)} className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-2 transition-all ${inputMode === mode.id ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <mode.icon size={22} />
                <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{mode.label}</span>
              </button>
            ))}
          </div>

          <div className="relative flex flex-col">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            <AnimatePresence mode="wait">
              {inputMode === 'hybrid' ? (
                <motion.div key="hybrid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <textarea value={codeContent} onChange={(e) => setCodeContent(e.target.value)} placeholder="Paste JSX/HTML..." className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 text-cyan-400 font-mono text-xs h-48 outline-none focus:border-cyan-400 resize-none" />
                  <div onClick={handleUploadTrigger} className="w-full border-2 border-dashed border-slate-800 rounded-2xl h-48 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500/50 cursor-pointer relative">
                    {selectedFile ? <FilePreview name={selectedFile.name} onRemove={() => setSelectedFile(null)} /> : <UploadPlaceholder label="UI Screenshot" />}
                  </div>
                </motion.div>
              ) : (
                <motion.div key={inputMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                  {inputMode === 'url' && <UrlInput value={urlValue} onChange={setUrlValue} />}
                  {inputMode === 'code' && <textarea value={codeContent} onChange={(e) => setCodeContent(e.target.value)} placeholder="Paste code here..." className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-cyan-400 font-mono text-sm h-40 outline-none focus:border-cyan-400 resize-none" />}
                  {inputMode === 'screenshot' && (
                    <div onClick={handleUploadTrigger} className="w-full border-2 border-dashed border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500/50 cursor-pointer">
                      {selectedFile ? <FilePreview name={selectedFile.name} onRemove={() => setSelectedFile(null)} /> : <UploadPlaceholder label="Drop Screenshot Here" large />}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleRunAudit}
              disabled={isAnalyzing}
              className={`mt-8 self-end flex items-center gap-3 px-12 py-5 rounded-[1.5rem] font-black text-xs tracking-[0.2em] transition-all active:scale-95 shadow-xl ${isAnalyzing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-cyan-400'}`}
            >
              {isAnalyzing ? (
                <>ANALYZING... <Loader2 size={18} className="animate-spin" /></>
              ) : (
                <>RUN AUDIT <Zap size={18} /> </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Sub-components to keep code clean ---

function ContextSelector({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-900 border-2 border-slate-800 rounded-[1.5rem] p-5 appearance-none font-bold text-sm outline-none focus:border-cyan-400 cursor-pointer">
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
      </div>
    </div>
  );
}

function UrlInput({ value, onChange }: any) {
  return (
    <div className="relative">
      <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://your-website.com" className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 pl-14 text-white font-mono text-sm outline-none focus:border-cyan-400" />
    </div>
  );
}

function FilePreview({ name, onRemove }: any) {
  return (
    <div className="flex flex-col items-center text-cyan-400 p-4">
      <FileText size={32} />
      <p className="text-[10px] font-bold mt-2 truncate w-32 text-center">{name}</p>
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="mt-2 text-[10px] text-red-500 underline font-black">Remove</button>
    </div>
  );
}

function UploadPlaceholder({ label, large }: any) {
  return (
    <div className="flex flex-col items-center">
      <Upload size={large ? 32 : 24} className="mb-2" />
      <p className="text-[9px] font-black uppercase tracking-widest">{label}</p>
    </div>
  );
}