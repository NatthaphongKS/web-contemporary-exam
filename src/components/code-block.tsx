"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "bash", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-md my-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">{title || language}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            copied
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600"
          }`}
          title="คัดลอกโค้ดลง Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>คัดลอกแล้ว!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>คัดลอก (Copy)</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm text-slate-100 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
