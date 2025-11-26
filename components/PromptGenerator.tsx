import React, { useState, useEffect } from 'react';
import { GeneratorParams, GeneratedPrompt } from '../types';
import { generatePromptFromIdeas } from '../services/geminiService';
import { Button } from './ui/Button';

interface Props {
  onSave: (prompt: GeneratedPrompt) => void;
}

export const PromptGenerator: React.FC<Props> = ({ onSave }) => {
  const [params, setParams] = useState<GeneratorParams>({
    topic: '',
    goal: '',
    audience: '',
    tone: 'Professional',
    format: 'Bullet Points',
    targetModel: 'Gemini 2.5 Flash'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedPrompt[]>([]);
  const [history, setHistory] = useState<GeneratorParams[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('prompt_etheus_generator_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse generator history");
      }
    }
  }, []);

  const addToHistory = (newParams: GeneratorParams) => {
    setHistory(prev => {
      // Avoid duplicates at top of stack
      if (prev.length > 0 && JSON.stringify(prev[0]) === JSON.stringify(newParams)) {
        return prev;
      }
      const updated = [newParams, ...prev].slice(0, 10);
      localStorage.setItem('prompt_etheus_generator_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your configuration history?")) {
      setHistory([]);
      localStorage.removeItem('prompt_etheus_generator_history');
    }
  };

  const handleGenerate = async () => {
    if (!params.topic || !params.goal) return;
    
    addToHistory(params);
    
    setIsLoading(true);
    try {
      const generated = await generatePromptFromIdeas(params);
      setResults(generated);
    } catch (e) {
      alert("Failed to generate prompt. Please check API key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Input Panel */}
      <div className="lg:col-span-4 space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-fit flex flex-col">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Configure Generator
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Topic / Subject</label>
              <input 
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g., React Performance Optimization"
                value={params.topic}
                onChange={e => setParams(p => ({...p, topic: e.target.value}))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Primary Goal</label>
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-24"
                placeholder="What should the prompt achieve?"
                value={params.goal}
                onChange={e => setParams(p => ({...p, goal: e.target.value}))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Audience</label>
                <input 
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. Senior Devs"
                  value={params.audience}
                  onChange={e => setParams(p => ({...p, audience: e.target.value}))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tone</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={params.tone}
                  onChange={e => setParams(p => ({...p, tone: e.target.value}))}
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Academic</option>
                  <option>Creative</option>
                  <option>Persuasive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Format</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={params.format}
                  onChange={e => setParams(p => ({...p, format: e.target.value}))}
                >
                  <option>Bullet Points</option>
                  <option>Paragraphs</option>
                  <option>Code Block</option>
                  <option>Step-by-Step</option>
                  <option>JSON</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Target Model</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={params.targetModel}
                  onChange={e => setParams(p => ({...p, targetModel: e.target.value}))}
                >
                  <option>Gemini 2.5 Flash</option>
                  <option>Gemini 3 Pro</option>
                  <option>GPT-4o</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>Midjourney v6</option>
                </select>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={handleGenerate} 
              isLoading={isLoading}
              disabled={!params.topic || !params.goal}
            >
              Generate Prompts
            </Button>
          </div>
        </div>
        
        {/* History Section */}
        {history.length > 0 && (
          <div className="pt-6 border-t border-slate-800 animate-fade-in">
             <div className="flex items-center justify-between mb-3">
               <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Recent History
               </h3>
               <button onClick={clearHistory} className="text-[10px] text-slate-600 hover:text-red-400 transition-colors">Clear All</button>
             </div>
             <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
               {history.map((item, idx) => (
                 <div 
                    key={idx} 
                    onClick={() => setParams(item)}
                    className="group p-3 rounded-lg bg-slate-800/40 border border-slate-800 hover:bg-slate-800 hover:border-indigo-500/30 cursor-pointer transition-all"
                 >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-300 text-sm truncate w-full pr-2 group-hover:text-indigo-300 transition-colors">{item.topic}</span>
                      <svg className="w-3.5 h-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                    <p className="text-xs text-slate-500 truncate mb-2">{item.goal}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-slate-900/80 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">{item.targetModel}</span>
                      <span className="text-[10px] bg-slate-900/80 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">{item.format}</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-8 space-y-6">
        {results.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl p-12 bg-slate-900/20">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            <p className="text-lg font-medium">Ready to craft masterpiece prompts?</p>
            <p className="text-sm">Fill in the parameters and hit generate.</p>
          </div>
        )}

        {results.map((prompt) => (
          <div key={prompt.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl hover:shadow-indigo-900/10 transition-all">
             <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></div>
             <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{prompt.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {prompt.tags.map(t => (
                        <span key={t} className="text-xs font-mono bg-slate-900 text-slate-400 px-2 py-1 rounded">{t}</span>
                      ))}
                      <span className="text-xs font-mono bg-indigo-900/40 text-indigo-300 px-2 py-1 rounded border border-indigo-500/20">{prompt.modelTarget}</span>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => onSave(prompt)} className="text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Save to Library
                  </Button>
                </div>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap border border-slate-900 relative group">
                  {prompt.content}
                  <button 
                    onClick={() => navigator.clipboard.writeText(prompt.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded transition-opacity"
                    title="Copy to clipboard"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};