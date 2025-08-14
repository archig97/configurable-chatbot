import React from "react";

type ModelKey = "gpt-4o-mini" | "gpt-4o";

interface BotConfig {
  name: string;
  persona: string;
  model: ModelKey;
}

const MODEL_OPTIONS: { key: ModelKey; label: string }[] = [
  { key: "gpt-4o-mini", label: "GPT-4o Mini" },
  { key: "gpt-4o", label: "GPT-4o" },
];

interface Props {
  botConfig: BotConfig;
  setBotConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
  isMock: boolean;
}

export default function BotConfigForm({ botConfig, setBotConfig, isMock }: Props) {
  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 p-4 bg-red-400">
      <h2 className="text-lg font-semibold mb-3">Bot Config</h2>
      <label className="block mb-3">
        <span className="block text-sm text-gray-700 mb-1">Bot Name</span>
        <input className="w-full rounded-xl border px-3 py-2 text-white" value={botConfig.name} onChange={(e) => setBotConfig((c) => ({ ...c, name: e.target.value }))} />
      </label>
      <label className="block mb-3">
        <span className="block text-sm text-gray-700 mb-1">Persona</span>
        <textarea className="w-full rounded-xl border px-3 py-2 text-white" value={botConfig.persona} onChange={(e) => setBotConfig((c) => ({ ...c, persona: e.target.value }))} />
      </label>
      <label className="block mb-3">
        <span className="block text-sm text-gray-700 mb-1">Model</span>
        <select className="w-full rounded-xl border px-3 py-2 text-white" value={botConfig.model} onChange={(e) => setBotConfig((c) => ({ ...c, model: e.target.value as ModelKey }))}>
          {MODEL_OPTIONS.map((m) => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
      </label>
      <div className="text-xs text-gray-500">API mode: {isMock ? "Mock" : "Live"}</div>
    </div>
  );
}