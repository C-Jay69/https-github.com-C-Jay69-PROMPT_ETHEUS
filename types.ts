export enum PromptMode {
  GENERATOR = 'GENERATOR',
  AUDITOR = 'AUDITOR',
  LIBRARY = 'LIBRARY'
}

export interface GeneratedPrompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  modelTarget?: string;
}

export interface AuditResult {
  originalPrompt: string;
  critique: string;
  score: number;
  improvedPrompt: string;
  suggestions: string[];
}

export interface GeneratorParams {
  topic: string;
  goal: string;
  audience: string;
  tone: string;
  format: string;
  targetModel: string;
}

// Icons props
export interface IconProps {
  className?: string;
}