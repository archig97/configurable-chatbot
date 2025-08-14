import React, { useMemo, useState } from "react";
import BotConfigForm from "./components/BotConfigForm";
import LogsPanel from "./components/LogPanel";
import ChatInterface, { type ChatMessage as ChatInterfaceMessage } from "./components/ChatInterface";

type Role = "user" | "assistant" | "system";
interface ChatMessage {
  role: Role;
  content: string;
}

type ModelKey = "gpt-4o-mini" | "gpt-4o";

interface LogEntry {
  timestamp: string;
  model: string;
  promptSnippet: string;
  responseSnippet: string;
}

const MODEL_OPTIONS: { key: ModelKey; label: string }[] = [
  { key: "gpt-4o-mini", label: "GPT-4o Mini" },
  { key: "gpt-4o", label: "GPT-4o" },
];

const MAX_LOG_ENTRIES = 5;

function truncate(text: string, max = 40) {
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
}

function nowTimeLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

async function callOpenAIChat(apiKey: string, model: ModelKey, messages: ChatMessage[]): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.7 }),
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "(no content)";
}

export default function App() {
  const [botConfig, setBotConfig] = useState({ name: "Buddy", persona: "a friendly science tutor", model: "gpt-4o-mini" as ModelKey });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSending, setIsSending] = useState(false);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;

  const systemPrompt = useMemo(() => `You are a chatbot named ${botConfig.name}, and you ${botConfig.persona}.`, [botConfig]);

  async function handleSend(userText: string) {
    const trimmed = userText.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(newMessages);
    setIsSending(true);
    try {
      const responseText = await callOpenAIChat(apiKey, botConfig.model, [{ role: "system", content: systemPrompt }, ...newMessages]);
      const withAssistant = [...newMessages, { role: "assistant" as const, content: responseText }];
      setMessages(withAssistant);
      setLogs((prev) => [{ timestamp: nowTimeLabel(), model: MODEL_OPTIONS.find((m) => m.key === botConfig.model)?.label || botConfig.model, promptSnippet: truncate(trimmed), responseSnippet: truncate(responseText) }, ...prev].slice(0, MAX_LOG_ENTRIES));
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err?.message || "failed to get response"}` }]);
    } finally {
      setIsSending(false);
    }
  }

  // Cast messages to the type expected by ChatInterface (without "system" role)
  const filteredMessages: ChatInterfaceMessage[] = messages.filter(m => m.role !== "system") as ChatInterfaceMessage[];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-xl font-bold">Your Favorite Chatbot</h1>
          <p className="text-sm text-gray-600">Configurable bot with chat and logs.</p>
          <p className="text-sm text-gray-600">{systemPrompt}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <BotConfigForm botConfig={botConfig} setBotConfig={setBotConfig} isMock={!apiKey} />
            <LogsPanel logs={logs} />
          </div>

          <div className="lg:col-span-2">
            <ChatInterface messages={filteredMessages} onSend={handleSend} isSending={isSending} />
          </div>
        </div>
      </div>
    </div>
  );
}
