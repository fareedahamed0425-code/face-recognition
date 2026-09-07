import React from 'react';
import { Globe, Database, FileText, Activity } from 'lucide-react';

export default function Header({ health, onExportAudit, hasAuditRecord }) {
  return (
    <header className="border-b border-[#1e283d] bg-[#090d16]/95 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-slate-900 border border-cyan-500/40 p-1.5 shadow-lg shadow-cyan-500/10 flex items-center justify-center shrink-0">
            <img src="/logo.svg" alt="Face ID Blockchain Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                Face ID <span className="text-cyan-400 font-normal">+</span> Blockchain Verification
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-950/80 text-cyan-300 border border-blue-700/60 shadow-sm">
                v1.0.0-PROD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-tight flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block"></span>
              Reverse-image forensic verification with tamper-evident blockchain records
            </p>
          </div>
        </div>

        {/* Live Network & API Diagnostics */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Network Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1320] border border-[#1e283d] text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 font-light">NETWORK:</span>
            <span className="text-emerald-300 font-bold tracking-tight">
              {health?.blockchain_network ? health.blockchain_network.toUpperCase() : 'SEPOLIA TESTNET'}
            </span>
          </div>

          {/* Search Engine Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1320] border border-[#1e283d] text-xs font-mono shadow-sm">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-light">SEARCH:</span>
            <span className="text-cyan-300 font-bold tracking-tight">
              {health?.serpapi_configured ? 'GOOGLE LENS (LIVE)' : 'PUBLIC WEB ENGINE'}
            </span>
          </div>

          {/* Export Audit Proof */}
          {hasAuditRecord && (
            <button
              onClick={onExportAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold transition-all shadow-md shadow-cyan-900/20"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPORT AUDIT PROOF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
