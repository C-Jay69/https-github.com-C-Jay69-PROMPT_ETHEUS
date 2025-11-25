import React, { useState } from 'react';
import { GeneratedPrompt } from '../types';

interface Props {
  prompts: GeneratedPrompt[];
  onDelete: (id: string) => void;
}

export const PromptLibrary: React.FC<Props> = ({ prompts, onDelete }) => {
  const [search, setSearch] = useState('');

  const filtered = prompts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
         <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
           <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
         </div>
         <h3 className="text-xl font-semibold text-slate-300">Library Empty</h3>
         <p className="mt-2 max-w-sm text-center">Generate some prompts in the generator tab to save them here.</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mb-6">
        <div className="relative">
          <input 
             type="text"
             placeholder="Search your prompts..."
             className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
             value={search}
             onChange={e => setSearch(e.target.value)}
          />
          <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(prompt => (
          <div key={prompt.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-colors group flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white truncate pr-2">{prompt.title}</h3>
                <button onClick={() => onDelete(prompt.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div className="line-clamp-4 text-sm text-slate-400 font-mono bg-slate-900/50 p-3 rounded border border-slate-900/50 mb-3">
                {prompt.content}
              </div>
              <div className="flex flex-wrap gap-2">
                 {prompt.tags.slice(0,3).map(t => (
                    <span key={t} className="text-[10px] uppercase tracking-wider bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{t}</span>
                 ))}
              </div>
            </div>
            <div className="bg-slate-900/30 p-3 border-t border-slate-700 flex justify-between items-center">
              <span className="text-xs text-slate-500">{new Date(prompt.createdAt).toLocaleDateString()}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(prompt.content)}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                Copy Prompt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};