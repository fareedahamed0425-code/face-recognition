import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function VerificationCard({ verifyData }) {
  if (!verifyData) {
    return (
      <div className="mono-box" style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
        Biometric verification pending execution...
      </div>
    );
  }

  const status = verifyData.status;
  const isVerified = status === 'VERIFIED';
  const isRejected = status === 'NOT VERIFIED';

  const bannerClass = isVerified
    ? 'verdict-banner is-verified'
    : isRejected
    ? 'verdict-banner is-rejected'
    : 'verdict-banner is-nomatch';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className={bannerClass}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isVerified ? (
            <CheckCircle2 style={{ width: 22, height: 22, color: '#10b981' }} />
          ) : isRejected ? (
            <XCircle style={{ width: 22, height: 22, color: '#f43f5e' }} />
          ) : (
            <AlertTriangle style={{ width: 22, height: 22, color: '#f59e0b' }} />
          )}
          <div>
            <div className="verdict-title">{status}</div>
            <div className="verdict-sub">
              {isVerified
                ? 'Biometric & cryptographic proof valid'
                : isRejected
                ? 'Similarity below verification threshold'
                : 'No candidate match to compare'}
            </div>
          </div>
        </div>

        <div>
          <div className="verdict-score">{verifyData.similarity_percentage || '0.0%'}</div>
          <div style={{ fontSize: '0.62rem', color: '#94a3b8', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>SIMILARITY</div>
        </div>
      </div>

      <div className="mono-box" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b' }}>SOURCE PLATFORM:</span>
          <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{verifyData.source_platform || 'N/A'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b' }}>MATCHED SHA-256:</span>
          <span style={{ color: '#06b6d4', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {verifyData.matched_image_hash || '0x000000000000...'}
          </span>
        </div>
      </div>
    </div>
  );
}
