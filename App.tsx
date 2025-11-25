import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptGenerator } from './components/PromptGenerator';
import { PromptAuditor } from './components/PromptAuditor';
import { PromptLibrary } from './components/PromptLibrary';
import { PromptMode, GeneratedPrompt } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PromptMode>(PromptMode.GENERATOR);
  const [savedPrompts, setSavedPrompts] = useState<GeneratedPrompt[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('prompt_etheus_library');
    if (saved) {
      try {
        setSavedPrompts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved prompts");
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('prompt_etheus_library', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const handleSavePrompt = (prompt: GeneratedPrompt) => {
    setSavedPrompts(prev => [prompt, ...prev]);
    alert("Prompt saved to library!");
  };

  const handleDeletePrompt = (id: string) => {
    if(confirm("Are you sure you want to delete this prompt?")) {
        setSavedPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-1">
          <button 
            onClick={() => setActiveTab(PromptMode.GENERATOR)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === PromptMode.GENERATOR ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
          >
            Generator
          </button>
          <button 
             onClick={() => setActiveTab(PromptMode.AUDITOR)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === PromptMode.AUDITOR ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
          >
            Auditor <span className="ml-1.5 px-1.5 py-0.5 bg-rose-900/50 text-rose-400 text-[10px] rounded-full border border-rose-900">New</span>
          </button>
          <button 
             onClick={() => setActiveTab(PromptMode.LIBRARY)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === PromptMode.LIBRARY ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
          >
            Library <span className="ml-1.5 px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">{savedPrompts.length}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] animate-fade-in-up">
          {activeTab === PromptMode.GENERATOR && (
            <PromptGenerator onSave={handleSavePrompt} />
          )}
          
          {activeTab === PromptMode.AUDITOR && (
            <PromptAuditor />
          )}

          {activeTab === PromptMode.LIBRARY && (
            <PromptLibrary prompts={savedPrompts} onDelete={handleDeletePrompt} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;