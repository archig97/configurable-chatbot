import React, { useRef, useEffect, useState } from "react";

export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
  };
  
  interface Props {
    messages: ChatMessage[];
    onSend: (text: string) => void;
    onClearChat: React.MouseEventHandler<HTMLButtonElement>;
    isSending: boolean;
    isBotTyping: boolean;
    
    
  }
  
export default function ChatInterface({ messages, onSend, isSending, isBotTyping, onClearChat}: Props) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  function handleSendClick() {
    onSend(input);
    setInput("");
  }

  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
  <h2 className="text-lg font-semibold">Chat</h2>
  <button
    onClick={onClearChat}
    className="text-xs text-red-500 hover:text-red-700 transition-colors"
  >
    Clear Chat
  </button>
</div>
      <div className="flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className="text-xs font-semibold text-gray-500 mb-1">
      {m.role === "user" ? "You" : "Bot"}
    </div>
                <div className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"}`}>{m.content}</div>
              </div>
            ))}

            { isBotTyping && 
            (
                <div className="text-left">
                  <div className="inline-flex items-center gap-1 max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-gray-100 text-gray-900 animate-pulse">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )
            }
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="mt-3 flex gap-2 sticky bottom-0 bg-white pt-2">
          <input className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-black bg-white focu:outline-none focus:ring focus:ring-indigo-200" placeholder="Type your message…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendClick(); } }} disabled={isSending} />
          <button onClick={handleSendClick} disabled={isSending} className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">{isSending ? "Sending…" : "Send"}</button>
        </div>
      </div>
    </div>
  );
}
