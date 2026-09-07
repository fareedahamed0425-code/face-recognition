import React, { useState } from 'react';
import { Blocks, ExternalLink, Check, Copy, CheckCircle2 } from 'lucide-react';

export default function BlockchainRecordCard({ blockchainData }) {
  const [copiedTx, setCopiedTx] = useState(false);

  if (!blockchainData) {
    return (
      <div className="mono-box" style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
        Blockchain transaction proof pending execution...
      </div>
    );
  }

  const handleCopyTx = () => {
    if (blockchainData.transaction_hash) {
      navigator.clipboard.writeText(blockchainData.transaction_hash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  return (
    <div className="blockchain-card-box">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
          <Blocks style={{ width: 14, height: 14, color: '#38bdf8' }} />
          <span>{blockchainData.network}</span>
        </div>
        <span className="stage-badge badge-success">
          <CheckCircle2 style={{ width: 10, height: 10 }} />
          <span>{blockchainData.status}</span>
        </span>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
          <span>TRANSACTION HASH:</span>
          <button
            onClick={handleCopyTx}
            style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem' }}
          >
            {copiedTx ? <Check style={{ width: 10, height: 10, color: '#10b981' }} /> : <Copy style={{ width: 10, height: 10 }} />}
            <span>{copiedTx ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
        <div className="mono-box" style={{ color: '#06b6d4', padding: '6px 10px', fontSize: '0.7rem' }}>
          {blockchainData.transaction_hash}
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-label">BLOCK NUMBER</div>
          <div className="stat-val">#{blockchainData.block_number}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">GAS CONSUMED</div>
          <div className="stat-val" style={{ color: '#10b981' }}>{blockchainData.gas_used.toLocaleString()}</div>
        </div>
      </div>

      <a
        href={blockchainData.explorer_url}
        target="_blank"
        rel="noopener noreferrer"
        className="explorer-btn"
      >
        <ExternalLink style={{ width: 14, height: 14 }} />
        <span>VIEW ON BLOCK EXPLORER</span>
      </a>
    </div>
  );
}
