"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Zap, Layout } from 'lucide-react';

export default function LoadingState() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing Vision AI...");

  const messages = [
    "Capturing website screenshot...",
    "Analyzing DOM structure...",
    "Running WCAG 2.1 accessibility checks...",
    "Evaluating Heuristic principles...",
    "Identifying friction points...",
    "Generating AI report..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 1 : prev));
    }, 100);

    const msgTimer = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#030712] z-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Scanning Radar Effect */}
      <div className="relative w-64 h-64 mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-500"
        />
        <div className="absolute inset-8 rounded-full bg-cyan-500/5 flex items-center justify-center border border-slate-800 backdrop-blur-3xl">
          <Search size={48} className="text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Progress Stats */}
      <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">
        Analyzing <span className="text-cyan-500">{progress}%</span>
      </h2>
      <p className="text-slate-400 font-medium tracking-wide flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
        {message}
      </p>

      {/* Bottom Features Icons */}
      <div className="mt-16 flex gap-8 opacity-20">
        <Shield size={24} className="text-white" />
        <Zap size={24} className="text-white" />
        <Layout size={24} className="text-white" />
      </div>
    </div>
  );
}