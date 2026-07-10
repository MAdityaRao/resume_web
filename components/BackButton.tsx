import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <Link
      href="/#projects"
      className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8 text-sm font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Projects
    </Link>
  );
}