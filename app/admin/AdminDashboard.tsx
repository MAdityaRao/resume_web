"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

export default function AdminDashboard({ logs }: { logs: any[] }) {
  const [currentLogs, setCurrentLogs] = useState(logs);
  const [selectedLog, setSelectedLog] = useState<any | null>(currentLogs[0] || null);

  const handleDelete = async () => {
    if (!selectedLog) return;
    if (!confirm("Are you sure you want to delete this session?")) return;

    const res = await fetch("/api/admin/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedLog.id }),
    });

    if (res.ok) {
      const updatedLogs = currentLogs.filter((log: any) => log.id !== selectedLog.id);
      setCurrentLogs(updatedLogs);
      setSelectedLog(updatedLogs[0] || null);
      if (updatedLogs.length === 0) setMobileView('list');
    } else {
      alert("Failed to delete log");
    }
  };

  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!currentLogs || currentLogs.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-white p-8 flex items-center justify-center">
        <h1 className="text-xl text-slate-400">No logs found in the database.</h1>
      </div>
    );
  }

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
      <aside className={`w-full md:w-96 border-r border-white/10 flex flex-col h-full bg-[#0A0D14] ${mobileView === 'detail' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/10 shrink-0">
          <div className="mb-6">
            <BackButton />
          </div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_10px_rgba(192,92,67,0.6)]" />
            Agent Logs
          </h1>
          <p className="text-xs text-slate-500 mt-4">{currentLogs.length} total sessions</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {currentLogs.map((log) => (
            <button
              key={log.id}
              onClick={() => {
                setSelectedLog(log);
                setMobileView('detail');
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedLog?.id === log.id
                  ? "bg-white/5 border-terracotta/30"
                  : "bg-transparent border-transparent hover:bg-white/5"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <p className={`font-semibold text-sm truncate ${selectedLog?.id === log.id ? 'text-terracotta' : 'text-white'}`}>
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
      <main className={`flex-1 h-screen flex flex-col bg-[#0b0f17] ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {selectedLog ? (
          <>
            <header className="p-4 md:p-6 border-b border-white/10 bg-[#0A0D14]/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                >
                  ← Back
                </button>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-white truncate max-w-[150px] md:max-w-none">{selectedLog.visitor_name || "Anonymous"}</h2>
                  <p className="text-[10px] md:text-xs text-slate-400 font-mono mt-0.5">ID: {selectedLog.id.slice(0, 8)}...</p>
                </div>
              </div>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg text-xs md:text-sm hover:bg-red-900/50 transition-colors"
              >
                Delete
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 bg-gradient-to-b from-[#0e121d] to-[#0A0D14]">
              {conversation.length > 0 ? (
                <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-20">
                  {conversation.map((msg: any, i: number) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`flex flex-col ${msg.from === 'you' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[9px] uppercase tracking-widest text-slate-600 mb-1 px-1 font-bold">
                        {msg.from === 'you' ? 'Visitor' : 'Agent'}
                      </span>
                      <div className={`max-w-[95%] md:max-w-[80%] px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl text-xs md:text-sm leading-relaxed shadow-lg ${
                        msg.from === 'you'
                          ? 'bg-terracotta/10 text-white rounded-br-none border border-terracotta/30'
                          : 'bg-[#1a202e] text-slate-100 rounded-bl-none border border-white/5'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 italic text-sm">
                  No conversation data found.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 italic p-6 text-center">
            Select a session from the sidebar to view conversation details
          </div>
        )}
      </main>
    </div>
  );
}
