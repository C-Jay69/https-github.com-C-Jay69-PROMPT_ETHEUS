import React, { useState } from 'react';
import { Button } from './ui/Button';
import { auditPromptWithGemini } from '../services/geminiService';
import { AuditResult } from '../types';

export const PromptAuditor: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAudit = async () => {
    if (!inputPrompt.trim()) return;
    setIsLoading(true);
    try {
      const result = await auditPromptWithGemini(inputPrompt);
      setAuditResult(result);
    } catch (e) {
      alert('Audit failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-5 space-y-6">
         <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Prompt Auditor
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Paste your draft prompt below. Gemini will analyze it for weakness, ambiguity, and missing context.
            </p>
            <textarea 
              className="w-full flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-mono text-sm mb-4"
              placeholder="Paste your prompt here..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleAudit} isLoading={isLoading} disabled={!inputPrompt.trim()} className="w-full sm:w-auto">
                Audit & Improve
              </Button>
            </div>
         </div>
      </div>

      <div className="lg:col-span-7">
        {!auditResult && !isLoading && (
           <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl p-12 bg-slate-900/20 min-h-[400px]">
             <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
             <p>Audit results will appear here.</p>
           </div>
        )}

        {auditResult && (
          <div className="space-y-6 animate-fade-in">
            {/* Score Card */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg flex items-center justify-between">
               <div>
                 <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Quality Score</h3>
                 <div className={`text-4xl font-bold mt-1 ${getScoreColor(auditResult.score)}`}>
                    {auditResult.score}/100
                 </div>
               </div>
               <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${auditResult.score >= 80 ? 'bg-emerald-500' : auditResult.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${auditResult.score}%` }}
                  ></div>
               </div>
            </div>

            {/* Critique */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
               <h3 className="text-rose-400 font-semibold mb-2 flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 Critique
               </h3>
               <p className="text-slate-300 text-sm leading-relaxed">
                 {auditResult.critique}
               </p>
            </div>

            {/* Suggestions */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
               <h3 className="text-yellow-400 font-semibold mb-3">Suggestions for Improvement</h3>
               <ul className="space-y-2">
                 {auditResult.suggestions.map((s, i) => (
                   <li key={i} className="flex gap-3 text-sm text-slate-300">
                     <span className="text-slate-600 font-mono">{i+1}.</span>
                     {s}
                   </li>
                 ))}
               </ul>
            </div>

            {/* Improved Version */}
             <div className="bg-slate-800 rounded-xl border border-emerald-900/50 shadow-lg overflow-hidden">
               <div className="bg-emerald-900/20 p-3 border-b border-emerald-900/30 flex justify-between items-center">
                 <h3 className="text-emerald-400 font-semibold text-sm flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   Optimized Version
                 </h3>
                 <button 
                    onClick={() => navigator.clipboard.writeText(auditResult.improvedPrompt)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                 >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   Copy
                 </button>
               </div>
               <div className="p-6 bg-slate-900/50">
                  <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">{auditResult.improvedPrompt}</pre>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};