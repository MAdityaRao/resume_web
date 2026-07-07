export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-faint">
        <span>© {new Date().getFullYear()} Aditya. Built with Next.js and LiveKit.</span>
        <span>SIG_END</span>
      </div>
    </footer>
  );
}
