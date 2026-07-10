import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import fs from 'fs';
import path from 'path';
import BackButton from '@/components/BackButton';

export default async function ProjectPage({ params }: { params: { slug: string[] } }) {
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
    <div className="min-h-screen bg-[#0A0D14] py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <article
          className="
            mt-8 p-8 md:p-12
            glass-strong
            prose prose-lg prose-invert
            max-w-none
            prose-headings:text-white
            prose-p:text-[#F0EDE8]/90
            prose-li:text-[#F0EDE8]/90
            prose-strong:text-white
            prose-code:text-[#FFB648]
            prose-a:text-[#FFB648]
            prose-a:no-underline
            hover:prose-a:underline
            prose-blockquote:text-white
            prose-blockquote:border-l-[#FFB648]
            prose-img:rounded-xl
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}