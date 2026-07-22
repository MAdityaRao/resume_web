export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 mx-4 mb-4 rounded-2xl md:mx-6 md:mb-6 bg-card">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-secondary">
        <span>© {new Date().getFullYear()} Aditya. Built with Next.js and LiveKit.</span>
        <span className="text-primary">SIG_END</span>
      </div>
    </footer>
  );
}