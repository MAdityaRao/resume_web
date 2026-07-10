import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import fs from 'fs';
import path from 'path';

export default async function ProjectPage({ params }: { params: { slug: string[] } }) {
  // Construct path to the README file
  // params.slug is an array, e.g., ["project_readme", "resume_agent"]
  const fileName = `${params.slug[params.slug.length - 1]}.md`;
  const filePath = path.join(process.cwd(), 'public', 'project_readme', fileName);

  if (!fs.existsSync(filePath)) {
    return (
      <div className="p-10 text-white min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">README not found</h1>
          <p>Looking for: {filePath}</p>
        </div>
      </div>
    );
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  return (
    <div className="min-h-screen bg-slate-950">
        <article className="px-6 py-24 text-slate-300 max-w-4xl mx-auto prose prose-invert prose-cyan prose-lg prose-headings:font-display prose-p:leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
        </ReactMarkdown>
        </article>
    </div>
  );
}
