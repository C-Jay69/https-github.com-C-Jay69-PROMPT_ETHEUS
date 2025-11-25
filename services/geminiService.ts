import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratorParams, AuditResult, GeneratedPrompt } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const GENERATION_MODEL = 'gemini-2.5-flash';

export const generatePromptFromIdeas = async (params: GeneratorParams): Promise<GeneratedPrompt[]> => {
  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    Act as a world-class Prompt Engineer. Create 3 distinct, high-quality prompts based on the following parameters:
    - Topic: ${params.topic}
    - Goal: ${params.goal}
    - Target Audience: ${params.audience}
    - Tone: ${params.tone}
    - Desired Format: ${params.format}
    - Target AI Model: ${params.targetModel} (Optimize syntax for this model)

    For each prompt, provide a catchy title, the prompt content itself, and relevant tags.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      prompts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['title', 'content', 'tags']
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a specialized AI tailored for prompt engineering. Your output must be JSON."
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");

    const parsed = JSON.parse(jsonText);
    
    return parsed.prompts.map((p: any) => ({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      modelTarget: params.targetModel,
      ...p
    }));

  } catch (error) {
    console.error("Generation failed", error);
    throw error;
  }
};

export const auditPromptWithGemini = async (promptToAudit: string): Promise<AuditResult> => {
  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    Audit the following prompt for clarity, specificity, context, and potential biases.
    
    PROMPT TO AUDIT:
    "${promptToAudit}"
    
    Provide:
    1. A critique of the prompt (max 50 words).
    2. A quality score from 0 to 100.
    3. A significantly improved version of the prompt.
    4. A list of 3 specific suggestions for improvement.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      critique: { type: Type.STRING },
      score: { type: Type.NUMBER },
      improvedPrompt: { type: Type.STRING },
      suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['critique', 'score', 'improvedPrompt', 'suggestions']
  };

  try {
    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a strict prompt auditor. You value precision, context, and lack of ambiguity."
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");
    
    const parsed = JSON.parse(jsonText);

    return {
      originalPrompt: promptToAudit,
      critique: parsed.critique,
      score: parsed.score,
      improvedPrompt: parsed.improvedPrompt,
      suggestions: parsed.suggestions
    };

  } catch (error) {
    console.error("Audit failed", error);
    throw error;
  }
};