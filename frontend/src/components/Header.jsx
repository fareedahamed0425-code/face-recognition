import React from 'react';
import { Globe, FileText, Sparkles } from 'lucide-react';

export default function Header({ health, onExportAudit, hasAuditRecord }) {
  return (
    <header className="console-header">
      <div className="max-container header-inner">
        {/* Brand & Team MINDBRIDGE */}
        <div className="brand-wrapper">
          <div className="brand-logo-frame">
            <img src="/logo.svg" alt="MINDBRIDGE Logo" />
          </div>
          <div className="brand-text">
            <div className="team-banner-row">
              <span className="team-badge-pink">🌴 TEAM MINDBRIDGE</span>
              <span className="goa-tag">HACKER HOUSE GOA</span>
            </div>
            <h1 className="brand-title">
              Face ID <span className="accent-yellow">+</span> Blockchain Verification
            </h1>
            <p className="brand-subtitle">
              Reverse-image forensic verification with tamper-evident blockchain records
            </p>
          </div>
        </div>

        {/* Live Diagnostics Pills */}
        <div className="header-diagnostics">
          <div className="diag-pill-goa">
            <span className="status-dot-green"></span>
            <span>CHAIN: <strong>{health?.blockchain_network ? health.blockchain_network.toUpperCase() : 'SEPOLIA TESTNET'}</strong></span>
          </div>

          <div className="diag-pill-goa">
            <Globe style={{ width: 14, height: 14, color: '#0d5c36' }} />
            <span>SEARCH: <strong>{health?.serpapi_configured ? 'GOOGLE LENS (LIVE)' : 'PUBLIC WEB ENGINE'}</strong></span>
          </div>

          {hasAuditRecord && (
            <button onClick={onExportAudit} className="audit-export-btn">
              <FileText style={{ width: 14, height: 14 }} />
              <span>EXPORT PROOF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
