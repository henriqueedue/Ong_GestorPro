// LLM Integration for Ong Gestor Pro
// This module provides integration with OpenAI-compatible APIs

import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type Message = {
  role: Role;
  content: string;
};

export type InvokeParams = {
  messages: Message[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string;
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

const getApiUrl = () => {
  return process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions";
};

const getApiKey = () => {
  return process.env.OPENAI_API_KEY;
};

export async function createChatCompletion(
  params: InvokeParams
): Promise<InvokeResult> {
  const apiKey = getApiKey();
  const apiUrl = getApiUrl();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: params.model || "gpt-4",
      messages: params.messages,
      max_tokens: params.maxTokens,
      temperature: params.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LLM API error: ${response.status} - ${error}`);
  }

  return response.json() as Promise<InvokeResult>;
}