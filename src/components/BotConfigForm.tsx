import React, {useState} from "react";

export type ModelKey = "gpt-4o" | "gpt-3.5-turbo";

interface BotConfig {
  name: string;
  persona: string;
  model: ModelKey;
}

export const MODEL_OPTIONS: { key: ModelKey; label: string }[] = [
  { key: "gpt-4o", label: "GPT-4o" },
  { key: "gpt-3.5-turbo", label: "GPT-3.5-turbo" }
];

interface Props {
  botConfig: BotConfig;
  setBotConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
  isMock: boolean;
}

export default function BotConfigForm({ botConfig, setBotConfig, isMock }: Props) {
  
    const [localConfig, setLocalConfig] = useState(botConfig);

    const handleSaveClick = () => {
        setBotConfig(localConfig);
    }
    return (
    <div className="rounded-2xl shadow-lg border border-gray-400 p-6 bg-red-400 space-y-4 transition-colors duration-200">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Bot Config</h2>
      <label className="block">
        <span className="block text-sm text-gray-700 mb-1">Bot Name</span>
        <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" value={localConfig.name} onChange={(e) => setLocalConfig((c) => ({ ...c, name: e.target.value }))} />
      </label>
      <label className="block">
        <span className="block text-sm text-gray-700 mb-1">Persona</span>
        <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-[80px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" value={localConfig.persona} onChange={(e) => setLocalConfig((c) => ({ ...c, persona: e.target.value }))} />
      </label>
      <label className="block">
        <span className="block text-sm text-gray-700 mb-1">Model</span>
        <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" value={localConfig.model} onChange={(e) => setLocalConfig((c) => ({ ...c, model: e.target.value as ModelKey }))}>
          {MODEL_OPTIONS.map((m) => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
      </label>
      <div className="text-xs text-gray-500 mt-2">API mode: {isMock ? "Mock" : "Live"}</div>

      <button onClick={handleSaveClick} className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Save</button>
    </div>
  );
}