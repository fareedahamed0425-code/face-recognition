import React, { useRef, useEffect } from 'react';
import { Terminal, Copy, Check, Trash2, Shield } from 'lucide-react';

export default function ActivityLog({ logs, onClearLogs }) {
  const logEndRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.stage}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'IMAGE':
        return 'text-blue-400';
      case 'FACE_ID':
        return 'text-cyan-400';
      case 'REVERSE_SEARCH':
        return 'text-indigo-400';
      case 'VERIFY':
        return 'text-emerald-400';
      case 'BLOCKCHAIN':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="tech-card p-4">
      <div className="flex items-center justify-between border-b border-[#232d42] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
            Forensic Activity / Technical Execution Log
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161c2b] text-slate-400 border border-[#232d42]">
            {logs.length} EVENTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded bg-[#161c2b] border border-[#232d42]"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'COPIED' : 'COPY LOG'}</span>
          </button>
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Monospace Stream Window */}
      <div className="bg-[#070a10] border border-[#1e273a] rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto space-y-1.5 selection:bg-cyan-900">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic py-2 text-[11px]">
            [00:00:00] Verification engine idle. Ready for execution...
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 leading-relaxed text-[11px] hover:bg-[#0f1422] p-0.5 rounded">
              <span className="text-slate-500 shrink-0 font-light">[{log.timestamp}]</span>
              <span className={`font-bold shrink-0 text-[10px] px-1.5 py-0.2 rounded bg-[#121827] border border-[#20293d] ${getStageColor(log.stage)}`}>
                {log.stage}
              </span>
              <span className={`break-all ${
                log.status === 'ERROR' ? 'text-rose-400' :
                log.status === 'SUCCESS' ? 'text-slate-200' :
                log.status === 'WARNING' ? 'text-amber-300' : 'text-slate-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
