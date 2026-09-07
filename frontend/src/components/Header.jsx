import React from 'react';
import { ShieldCheck, Cpu, Globe, Database, FileText } from 'lucide-react';

export default function Header({ health, onExportAudit, hasAuditRecord }) {
  return (
    <header className="border-b border-[#232d42] bg-[#0c101a]/95 backdrop-blur sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                Face ID <span className="text-blue-500">+</span> Blockchain Verification
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-blue-950/80 text-cyan-400 border border-blue-800">
                  v1.0.0
                </span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Reverse-image verification with tamper-evident blockchain records
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Network Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161c2b] border border-[#232d42] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">CHAIN:</span>
            <span className="text-emerald-300 font-semibold">{health?.blockchain_network || 'Sepolia Testnet'}</span>
          </div>

          {/* Engine Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161c2b] border border-[#232d42] text-xs font-mono">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">SEARCH:</span>
            <span className="text-cyan-300 font-semibold">
              {health?.serpapi_configured ? 'Google Lens (SerpApi)' : 'Public Web Engine'}
            </span>
          </div>

          {/* Export Proof Button */}
          {hasAuditRecord && (
            <button
              onClick={onExportAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-mono transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Export Audit Proof
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
