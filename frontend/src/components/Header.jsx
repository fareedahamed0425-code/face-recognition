import React from 'react';
import { Globe, FileText } from 'lucide-react';

export default function Header({ health, onExportAudit, hasAuditRecord }) {
  return (
    <header className="console-header">
      <div className="max-container header-inner">
        {/* Brand & Logo */}
        <div className="brand-wrapper">
          <div className="brand-logo-frame">
            <img src="/logo.svg" alt="Face ID Blockchain Logo" />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <h1 className="brand-title">
                Face ID <span className="accent">+</span> Blockchain Verification
              </h1>
              <span className="brand-badge">v1.0.0-PROD</span>
            </div>
            <p className="brand-subtitle">
              <span className="pulse-dot"></span>
              Reverse-image forensic verification with tamper-evident blockchain records
            </p>
          </div>
        </div>

        {/* Live Diagnostics Pills */}
        <div className="header-diagnostics">
          <div className="diag-pill">
            <span className="status-live"></span>
            <span>NETWORK: <strong>{health?.blockchain_network ? health.blockchain_network.toUpperCase() : 'SEPOLIA TESTNET'}</strong></span>
          </div>

          <div className="diag-pill">
            <Globe style={{ width: 14, height: 14, color: '#06b6d4' }} />
            <span>SEARCH: <strong>{health?.serpapi_configured ? 'GOOGLE LENS (LIVE)' : 'PUBLIC WEB ENGINE'}</strong></span>
          </div>

          {hasAuditRecord && (
            <button onClick={onExportAudit} className="audit-export-btn">
              <FileText style={{ width: 14, height: 14 }} />
              <span>EXPORT AUDIT PROOF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
