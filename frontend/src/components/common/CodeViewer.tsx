import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: 'xml' | 'json' | 'text';
  title?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, language = 'json', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs shadow-inner">
      {title && (
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-slate-300 font-sans font-medium text-xs">
          <span>{title}</span>
          <button
            onClick={handleCopy}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto text-emerald-400 leading-relaxed whitespace-pre font-mono">
        {code}
      </div>
    </div>
  );
};
