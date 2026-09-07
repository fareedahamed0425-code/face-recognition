import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function VerificationCard({ verifyData }) {
  if (!verifyData) {
    return (
      <div className="mono-box-goa" style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
        Biometric verification pending execution...
      </div>
    );
  }

  const status = verifyData.status;
  const isVerified = status === 'VERIFIED';
  const isRejected = status === 'NOT VERIFIED';

  const bannerClass = isVerified
    ? 'verdict-banner-goa is-verified'
    : isRejected
    ? 'verdict-banner-goa is-rejected'
    : 'verdict-banner-goa is-nomatch';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className={bannerClass}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isVerified ? (
            <CheckCircle2 style={{ width: 26, height: 26, color: '#166534' }} />
          ) : isRejected ? (
            <XCircle style={{ width: 26, height: 26, color: '#991b1b' }} />
          ) : (
            <AlertTriangle style={{ width: 26, height: 26, color: '#92400e' }} />
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
          <div style={{ fontSize: '0.65rem', fontWeight: 800, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>SIMILARITY</div>
        </div>
      </div>

      <div className="mono-box-goa" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#475569' }}>SOURCE PLATFORM:</span>
          <span style={{ color: '#021a0e', fontWeight: 900 }}>{verifyData.source_platform || 'N/A'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#475569' }}>MATCHED SHA-256:</span>
          <span style={{ color: '#ff007f', fontWeight: 800, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {verifyData.matched_image_hash || '0x000000000000...'}
          </span>
        </div>
      </div>
    </div>
  );
}
