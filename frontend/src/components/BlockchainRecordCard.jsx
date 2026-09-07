import React, { useState } from 'react';
import { Blocks, ExternalLink, Check, Copy, CheckCircle2 } from 'lucide-react';

export default function BlockchainRecordCard({ blockchainData }) {
  const [copiedTx, setCopiedTx] = useState(false);

  if (!blockchainData) {
    return (
      <div className="mono-box-goa" style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
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
    <div className="blockchain-card-box-goa">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '0.88rem', color: '#0d5c36', fontWeight: 900 }}>
          <Blocks style={{ width: 18, height: 18, color: '#0d5c36' }} />
          <span>{blockchainData.network}</span>
        </div>
        <span className="stage-badge-goa badge-success">
          <CheckCircle2 style={{ width: 12, height: 12 }} />
          <span>{blockchainData.status}</span>
        </span>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
          <span>TRANSACTION HASH:</span>
          <button
            onClick={handleCopyTx}
            style={{ background: 'none', border: 'none', color: '#ff007f', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem' }}
          >
            {copiedTx ? <Check style={{ width: 12, height: 12, color: '#10b981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
            <span>{copiedTx ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
        <div className="mono-box-goa" style={{ color: '#0d5c36', padding: '8px 10px', fontSize: '0.74rem' }}>
          {blockchainData.transaction_hash}
        </div>
      </div>

      <div className="stat-grid-goa">
        <div className="stat-box-goa">
          <div className="stat-label">BLOCK NUMBER</div>
          <div className="stat-val">#{blockchainData.block_number}</div>
        </div>
        <div className="stat-box-goa">
          <div className="stat-label">GAS CONSUMED</div>
          <div className="stat-val" style={{ color: '#0d5c36' }}>{blockchainData.gas_used.toLocaleString()}</div>
        </div>
      </div>

      <a
        href={blockchainData.explorer_url}
        target="_blank"
        rel="noopener noreferrer"
        className="explorer-btn-goa"
      >
        <ExternalLink style={{ width: 16, height: 16 }} />
        <span>VIEW ON BLOCK EXPLORER</span>
      </a>
    </div>
  );
}
