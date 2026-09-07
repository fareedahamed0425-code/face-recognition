import React from 'react';
import { Globe, ExternalLink, Search, AlertTriangle } from 'lucide-react';

export default function SearchResultsView({ searchData, isProcessing }) {
  const matches = searchData?.matches || [];
  const bestMatch = searchData?.best_match;
  const hasSearched = Boolean(searchData);

  return (
    <div className="tech-card">
      <div className="card-header-row">
        <div className="card-title-box">
          <Globe style={{ width: 16, height: 16, color: '#3b82f6' }} />
          <span className="card-title">2. Reverse Image Search</span>
        </div>
        {searchData && (
          <span className={`stage-badge ${matches.length > 0 ? 'badge-success' : 'badge-warning'}`}>
            {matches.length} MATCH{matches.length !== 1 ? 'ES' : ''}
          </span>
        )}
      </div>

      {!hasSearched ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#111726', border: '1px solid #1e293d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Search style={{ width: 20, height: 20, color: '#64748b' }} />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>Search Pending Execution</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', maxWidth: '240px' }}>
            Click Run Verification to query Google Lens in real time.
          </div>
        </div>
      ) : bestMatch ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="match-card">
            <div className="match-header-row">
              <span className="platform-tag">{bestMatch.platform.toUpperCase()}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700 }}>
                CONFIDENCE: {bestMatch.confidence_percentage}
              </span>
            </div>

            <div className="match-img-frame">
              {bestMatch.matched_image_url ? (
                <img src={bestMatch.matched_image_url} alt="Matched Candidate" />
              ) : (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b' }}>
                  Visual reference verified
                </div>
              )}
            </div>

            <div className="match-title">{bestMatch.title}</div>

            <a
              href={bestMatch.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="match-link"
            >
              <ExternalLink style={{ width: 12, height: 12, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bestMatch.source_url}
              </span>
            </a>
          </div>

          <div className="mono-box" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>ENGINE:</span>
              <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{searchData.engine_used}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>LATENCY:</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{searchData.processing_time_ms}ms</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#0a0e17', border: '1px solid #1e293d', borderRadius: '10px' }}>
          <AlertTriangle style={{ width: 28, height: 28, color: '#f59e0b', margin: '0 auto 10px' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
            NO GENUINE MATCH FOUND
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
            {searchData.status_message}
          </div>
        </div>
      )}
    </div>
  );
}
