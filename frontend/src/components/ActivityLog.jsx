import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Copy, Check, Trash2 } from 'lucide-react';

export default function ActivityLog({ logs, onClearLogs }) {
  const logEndRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.stage}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-card-goa">
      <div className="terminal-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal style={{ width: 18, height: 18, color: '#0d5c36' }} />
          <span className="card-title">Forensic Activity / Execution Log</span>
          <span className="stage-badge-goa badge-pending">{logs.length} EVENTS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="secondary-btn-sand"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            {copied ? <Check style={{ width: 14, height: 14, color: '#10b981' }} /> : <Copy style={{ width: 14, height: 14 }} />}
            <span>{copied ? 'COPIED' : 'COPY LOG'}</span>
          </button>
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="secondary-btn-sand"
            style={{ padding: '6px 10px' }}
            title="Clear Log"
          >
            <Trash2 style={{ width: 14, height: 14, color: '#ef4444' }} />
          </button>
        </div>
      </div>

      <div className="terminal-window-goa">
        {logs.length === 0 ? (
          <div style={{ color: '#86efac', fontStyle: 'italic', padding: '6px 0' }}>
            [00:00:00] [MINDBRIDGE] Verification engine initialized. Ready for execution...
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="terminal-line">
              <span className="t-time">[{log.timestamp}]</span>
              <span className="t-stage">{log.stage}</span>
              <span className="t-msg">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
