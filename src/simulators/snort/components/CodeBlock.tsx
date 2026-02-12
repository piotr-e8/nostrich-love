/**
 * Snort Code Block Component
 * Syntax highlighted code display
 */

import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Simple syntax highlighting
  const highlightCode = (code: string, lang: string): React.ReactNode[] => {
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      let highlighted = line;
      
      // Language-specific highlighting
      if (['javascript', 'js', 'typescript', 'ts'].includes(lang)) {
        // Keywords
        highlighted = highlighted.replace(
          /\b(const|let|var|function|return|if|else|for|while|import|export|from|class|interface|type|async|await|try|catch|new|this)\b/g,
          '<span class="snort-code-keyword">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /(['"`])((?!\1)[^\\]|\\.)*?(\1)/g,
          '<span class="snort-code-string">$&</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /(\/\/.*$)/gm,
          '<span class="snort-code-comment">$1</span>'
        );
        // Functions
        highlighted = highlighted.replace(
          /(\w+)(?=\()/g,
          '<span class="snort-code-function">$1</span>'
        );
        // Numbers
        highlighted = highlighted.replace(
          /\b(\d+)\b/g,
          '<span class="snort-code-number">$1</span>'
        );
      } else if (['json'].includes(lang)) {
        // Keys
        highlighted = highlighted.replace(
          /"([^"]+)":/g,
          '<span class="snort-code-keyword">"$1"</span>:'
        );
        // Strings
        highlighted = highlighted.replace(
          /: "([^"]+)"/g,
          ': <span class="snort-code-string">"$1"</span>'
        );
        // Numbers
        highlighted = highlighted.replace(
          /: (\d+)/g,
          ': <span class="snort-code-number">$1</span>'
        );
        // Booleans
        highlighted = highlighted.replace(
          /\b(true|false|null)\b/g,
          '<span class="snort-code-keyword">$1</span>'
        );
      } else if (['python', 'py'].includes(lang)) {
        // Keywords
        highlighted = highlighted.replace(
          /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|with|async|await|lambda|None|True|False)\b/g,
          '<span class="snort-code-keyword">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /(['"])((?!\1)[^\\]|\\.)*?(\1)/g,
          '<span class="snort-code-string">$&</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /(#.*$)/gm,
          '<span class="snort-code-comment">$1</span>'
        );
        // Functions
        highlighted = highlighted.replace(
          /(\w+)(?=\()/g,
          '<span class="snort-code-function">$1</span>'
        );
      } else if (['rust', 'rs'].includes(lang)) {
        // Keywords
        highlighted = highlighted.replace(
          /\b(fn|let|mut|const|if|else|match|loop|while|for|return|struct|enum|impl|trait|use|mod|pub|async|await|unsafe)\b/g,
          '<span class="snort-code-keyword">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /("(?:[^"\\]|\\.)*")/g,
          '<span class="snort-code-string">$1</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /(\/\/.*$)/gm,
          '<span class="snort-code-comment">$1</span>'
        );
        // Functions
        highlighted = highlighted.replace(
          /(\w+)(?=\()/g,
          '<span class="snort-code-function">$1</span>'
        );
      } else if (['css', 'scss'].includes(lang)) {
        // Properties
        highlighted = highlighted.replace(
          /([\w-]+)(?=:)/g,
          '<span class="snort-code-keyword">$1</span>'
        );
        // Values
        highlighted = highlighted.replace(
          /: ([^;]+)/g,
          ': <span class="snort-code-string">$1</span>'
        );
        // Selectors
        highlighted = highlighted.replace(
          /^([.#][\w-]+)/gm,
          '<span class="snort-code-function">$1</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /(\/\*[\s\S]*?\*\/)/g,
          '<span class="snort-code-comment">$1</span>'
        );
      } else if (['html', 'xml'].includes(lang)) {
        // Tags
        highlighted = highlighted.replace(
          /(&lt;\/?)([\w-]+)/g,
          '$1<span class="snort-code-keyword">$2</span>'
        );
        // Attributes
        highlighted = highlighted.replace(
          /(\s)([\w-]+)(=)/g,
          '$1<span class="snort-code-function">$2</span>$3'
        );
        // Strings
        highlighted = highlighted.replace(
          /("[^"]*")/g,
          '<span class="snort-code-string">$1</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /(&lt;!--[\s\S]*?--&gt;)/g,
          '<span class="snort-code-comment">$1</span>'
        );
      } else if (['bash', 'sh', 'shell'].includes(lang)) {
        // Commands
        highlighted = highlighted.replace(
          /^(\w+)/gm,
          '<span class="snort-code-function">$1</span>'
        );
        // Flags
        highlighted = highlighted.replace(
          /(-[-\w]+)/g,
          '<span class="snort-code-keyword">$1</span>'
        );
        // Strings
        highlighted = highlighted.replace(
          /(['"])((?!\1)[^\\]|\\.)*?(\1)/g,
          '<span class="snort-code-string">$&</span>'
        );
        // Comments
        highlighted = highlighted.replace(
          /(#.*$)/gm,
          '<span class="snort-code-comment">$1</span>'
        );
      } else if (['markdown', 'md'].includes(lang)) {
        // Headers
        highlighted = highlighted.replace(
          /^(#{1,6}\s)(.*)$/gm,
          '<span class="snort-code-keyword">$1</span><span class="snort-code-function">$2</span>'
        );
        // Bold/Italic
        highlighted = highlighted.replace(
          /(\*\*\*|___)(.*?)(\1)/g,
          '<span class="snort-code-keyword">$1$2$3</span>'
        );
        // Links
        highlighted = highlighted.replace(
          /(\[.*?\])(\(.*?\))/g,
          '<span class="snort-code-string">$1</span><span class="snort-code-function">$2</span>'
        );
        // Code
        highlighted = highlighted.replace(
          /(`[^`]+`)/g,
          '<span class="snort-code-keyword">$1</span>'
        );
      }

      return (
        <div key={lineIndex} className="leading-relaxed">
          <span 
            className="inline-block w-8 text-right mr-4 text-slate-600 select-none"
            style={{ userSelect: 'none' }}
          >
            {lineIndex + 1}
          </span>
          <span dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
        </div>
      );
    });
  };

  // Escape HTML for display
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const escapedCode = escapeHtml(code);

  return (
    <div className="snort-code-block">
      <div className="snort-code-header">
        <span className="snort-code-lang">{language}</span>
        <button
          onClick={handleCopy}
          className="snort-code-copy"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="snort-code-content font-mono">
        {highlightCode(escapedCode, language.toLowerCase())}
      </div>
    </div>
  );
};

export default CodeBlock;
