import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const components = {
  h1: ({ children }) => (
    <h2 className="text-2xl font-semibold text-[var(--text-h)] mt-8 mb-4 first:mt-0" style={{ fontFamily: 'var(--heading)' }}>
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-[var(--text-h)] mt-8 mb-4 first:mt-0" style={{ fontFamily: 'var(--heading)' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-[var(--text-h)] mt-6 mb-3" style={{ fontFamily: 'var(--heading)' }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[var(--text)] leading-relaxed text-base mb-5 last:mb-0">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--accent)] underline underline-offset-2 hover:opacity-70 transition-opacity"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-[var(--text-h)]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="opacity-60">{children}</del>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-5 flex flex-col gap-1.5 text-[var(--text)]">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 flex flex-col gap-1.5 text-[var(--text)]">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 pl-4 my-5 italic text-[var(--text)] opacity-80" style={{ borderColor: 'var(--accent-border)' }}>
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => (
    <code className={`px-1.5 py-0.5 rounded text-[0.85em] font-[var(--mono)] bg-[var(--code-bg)] text-[var(--text-h)] ${className ?? ''}`}>
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="rounded-lg p-4 mb-5 overflow-x-auto bg-[var(--code-bg)] [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-[var(--border)]" />,
  img: ({ src, alt }) => (
    <img src={src} alt={alt} loading="lazy" className="rounded-lg my-6 w-full" />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-5">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-[var(--border)]">{children}</thead>,
  th: ({ children }) => <th className="text-left font-semibold text-[var(--text-h)] px-3 py-2">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 border-t border-[var(--border-subtle)] text-[var(--text)]">{children}</td>,
};

const MarkdownContent = ({ content }) => (
  <div className="prose-bookwise">
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
      {content ?? ''}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;