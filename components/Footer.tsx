export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 px-6 py-8 mx-4 mb-4 rounded-2xl md:mx-6 md:mb-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-slate-500">
        <span>© {new Date().getFullYear()} Aditya. Built with Next.js and LiveKit.</span>
        <span className="text-terracotta">SIG_END</span>
      </div>
    </footer>
  );
}