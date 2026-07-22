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
    <div className="min-h-screen bg-bg py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <article
          className="
            mt-8 p-8 md:p-12
            bg-card
            prose prose-lg prose-primary
            max-w-none
            prose-headings:text-primary
            prose-p:text-secondary
            prose-li:text-secondary
            prose-strong:text-primary
            prose-code:text-yellow-500
            prose-a:text-yellow-500
            prose-a:no-underline
            hover:prose-a:underline
            prose-blockquote:text-primary
            prose-blockquote:border-l-yellow-500
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