import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = useMemo(
    () => ({
      code({ className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const code = String(children).replace(/\n$/, '');
        if (match) {
          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              customStyle={{ margin: 0, borderRadius: 8, fontSize: 13 }}
            >
              {code}
            </SyntaxHighlighter>
          );
        }
        return (
          <code
            className={className}
            style={{
              background: '#2d2d4a',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: '0.9em',
              color: '#e4e4e7',
            }}
            {...props}
          >
            {children}
          </code>
        );
      },
      pre({ children }) {
        return <div style={{ margin: '8px 0' }}>{children}</div>;
      },
      p({ children }) {
        return <p style={{ margin: '8px 0', lineHeight: 1.6 }}>{children}</p>;
      },
      ul({ children }) {
        return <ul style={{ margin: '8px 0', paddingLeft: 24 }}>{children}</ul>;
      },
      ol({ children }) {
        return <ol style={{ margin: '8px 0', paddingLeft: 24 }}>{children}</ol>;
      },
      li({ children }) {
        return <li style={{ margin: '4px 0' }}>{children}</li>;
      },
      h1({ children }) {
        return <h1 style={{ margin: '16px 0 8px', fontSize: 20, color: '#e4e4e7' }}>{children}</h1>;
      },
      h2({ children }) {
        return <h2 style={{ margin: '14px 0 6px', fontSize: 18, color: '#e4e4e7' }}>{children}</h2>;
      },
      h3({ children }) {
        return <h3 style={{ margin: '12px 0 4px', fontSize: 16, color: '#e4e4e7' }}>{children}</h3>;
      },
      blockquote({ children }) {
        return (
          <blockquote
            style={{
              margin: '8px 0',
              padding: '4px 12px',
              borderLeft: '3px solid #7c5cfc',
              color: '#a1a1aa',
            }}
          >
            {children}
          </blockquote>
        );
      },
      a({ children, href }) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#7c5cfc' }}>
            {children}
          </a>
        );
      },
      hr() {
        return <hr style={{ border: 'none', borderTop: '1px solid #2d2d4a', margin: '16px 0' }} />;
      },
      table({ children }) {
        return (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', margin: '8px 0' }}>
              {children}
            </table>
          </div>
        );
      },
      th({ children }) {
        return (
          <th style={{ border: '1px solid #2d2d4a', padding: '8px 12px', textAlign: 'left', background: '#2d2d4a' }}>
            {children}
          </th>
        );
      },
      td({ children }) {
        return <td style={{ border: '1px solid #2d2d4a', padding: '8px 12px' }}>{children}</td>;
      },
    }),
    []
  );

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
