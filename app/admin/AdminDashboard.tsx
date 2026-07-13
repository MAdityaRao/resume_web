"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminDashboard({ logs }: { logs: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any | null>(logs[0] || null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!logs || logs.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-white p-8 flex items-center justify-center">
        <h1 className="text-xl text-slate-400">No logs found in the database.</h1>
      </div>
    );
  }

  // Updated Helper to map 'role' to 'from'
  const getConversation = (log: any) => {
    const data = Array.isArray(log.conversation) ? log.conversation :
                 (typeof log.conversation === 'string' ? JSON.parse(log.conversation) : []);

    return data.map((msg: any) => ({
      from: msg.role === 'assistant' ? 'agent' : 'you',
      text: msg.content || msg.text || ""
    }));
  };

  const conversation = selectedLog ? getConversation(selectedLog) : [];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Log List */}
      <aside className={`w-full md:w-96 border-r border-white/10 flex flex-col h-[40vh] md:h-screen bg-[#0A0D14] ${mobileView === 'detail' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/10 shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
            Agent Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">{logs.length} total sessions</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {logs.map((log) => (
            <button
              key={log.id}
              onClick={() => {
                setSelectedLog(log);
                setMobileView('detail');
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedLog?.id === log.id
                  ? "bg-white/5 border-amber/30 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                  : "bg-transparent border-transparent hover:bg-white/5"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <p className={`font-semibold text-sm truncate ${selectedLog?.id === log.id ? 'text-amber' : 'text-white'}`}>
                  {log.visitor_name || "Anonymous"}
                </p>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.created_at).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content - Detailed View */}
      <main className={`flex-1 h-[60vh] md:h-screen flex flex-col bg-[#0b0f17] ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {selectedLog ? (
          <>
            <header className="p-6 border-b border-white/10 bg-[#0A0D14]/50 backdrop-blur-sm sticky top-0 z-10 flex items-center gap-4">
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
              >
                ←
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedLog.visitor_name || "Anonymous"}</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">ID: {selectedLog.id}</p>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-gradient-to-b from-[#0e121d] to-[#0A0D14]">
              {conversation.length > 0 ? (
                <div className="max-w-3xl mx-auto space-y-6">
                  {conversation.map((msg: any, i: number) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`flex flex-col ${msg.from === 'you' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] uppercase tracking-widest text-slate-600 mb-1.5 px-1 font-bold">
                        {msg.from === 'you' ? 'Visitor' : 'Agent'}
                      </span>
                      <div className={`max-w-[90%] md:max-w-[80%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-lg ${
                        msg.from === 'you'
                          ? 'bg-amber text-black rounded-br-none'
                          : 'bg-[#1a202e] text-slate-100 rounded-bl-none border border-white/5'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 italic">
                  No conversation data found.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 italic">
            Select a session from the sidebar to view details
          </div>
        )}
      </main>
    </div>
  );
}
