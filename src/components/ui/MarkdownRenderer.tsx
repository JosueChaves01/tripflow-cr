import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Strip internal XML tags like <SAVE_PREFERENCES>...</SAVE_PREFERENCES> before rendering
  const safeContent = content.replace(/<(?:SAVE_)?PREFERENCES>[\s\S]*?<\/(?:SAVE_)?PREFERENCES>/gi, '').trim();

  return (
    <div className={cn(
      "prose prose-sm max-w-none",
      "prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight",
      "prose-h1:text-xl",
      "prose-h2:text-lg",
      "prose-h3:text-base",
      "prose-p:text-slate-700 prose-p:leading-relaxed",
      "prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-a:font-medium prose-a:underline-offset-4",
      "prose-strong:text-slate-900 prose-strong:font-bold",
      "prose-ul:text-slate-700 prose-ol:text-slate-700",
      "prose-li:marker:text-emerald-500",
      "prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:text-slate-700 prose-blockquote:not-italic prose-blockquote:rounded-r-lg",
      "prose-hr:border-slate-200",
      "prose-code:text-emerald-700 prose-code:bg-emerald-50/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[13px] prose-code:font-medium prose-code:before:content-none prose-code:after:content-none",
      "prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-sm prose-pre:my-4",
      "prose-pre:prose-code:text-slate-50 prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0 prose-pre:prose-code:text-[13px]",
      "prose-img:rounded-xl prose-img:shadow-sm",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node: _, ...props }) => (
            <div className="w-full overflow-x-auto my-6 rounded-xl border border-slate-200 bg-white shadow-sm scrollbar-hide">
              <table className="w-full border-collapse m-0 text-sm" {...props} />
            </div>
          ),
          thead: ({ node: _, ...props }) => (
            <thead className="bg-slate-50 border-b border-slate-200" {...props} />
          ),
          th: ({ node: _, ...props }) => (
            <th className="p-4 text-left font-semibold text-slate-900 align-middle whitespace-nowrap" {...props} />
          ),
          td: ({ node: _, ...props }) => (
            <td className="p-4 border-b border-slate-100 text-slate-700 align-middle whitespace-nowrap last:border-0" {...props} />
          ),
          tr: ({ node: _, ...props }) => (
            <tr className="hover:bg-slate-50/50 transition-colors" {...props} />
          )
        }}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
}
