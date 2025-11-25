import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Prompt Etheus <span className="text-indigo-500 text-sm font-mono px-2 py-0.5 bg-indigo-950 rounded-full border border-indigo-900">AUDITED</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-500">v2.0.0 // Deployment Ready</span>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};