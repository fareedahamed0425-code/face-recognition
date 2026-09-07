import React from 'react';
import { Globe, ExternalLink, Search, AlertTriangle } from 'lucide-react';

export default function SearchResultsView({ searchData, isProcessing }) {
  const matches = searchData?.matches || [];
  const bestMatch = searchData?.best_match;
  const hasSearched = Boolean(searchData);

  return (
    <div className="goa-card">
      <div className="card-header-row">
        <div className="card-title-box">
          <Globe style={{ width: 18, height: 18, color: '#0d5c36' }} />
          <span className="card-title">2. Reverse Image Search</span>
        </div>
        {searchData && (
          <span className={`stage-badge-goa ${matches.length > 0 ? 'badge-success' : 'badge-warning'}`}>
            {matches.length} MATCH{matches.length !== 1 ? 'ES' : ''}
          </span>
        )}
      </div>

      {!hasSearched ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#ffd000', border: '2px solid #021a0e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '2px 2px 0px #021a0e' }}>
            <Search style={{ width: 24, height: 24, color: '#021a0e' }} />
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#021a0e' }}>
            Search Pending Execution 🔍
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0d5c36', fontWeight: 700, marginTop: '4px', maxWidth: '240px' }}>
            Click Run Verification to query Google Lens in real time.
          </div>
        </div>
      ) : bestMatch ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="match-card-goa">
            <div className="match-header-row">
              <span className="platform-tag-goa">{bestMatch.platform.toUpperCase()}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#0d5c36', fontWeight: 900 }}>
                CONFIDENCE: {bestMatch.confidence_percentage}
              </span>
            </div>

            <div className="match-img-frame-goa">
              {bestMatch.matched_image_url ? (
                <img src={bestMatch.matched_image_url} alt="Matched Candidate" />
              ) : (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#e2f0d9', fontWeight: 700 }}>
                  Visual reference verified
                </div>
              )}
            </div>

            <div className="match-title">{bestMatch.title}</div>

            <a
              href={bestMatch.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="match-link-goa"
            >
              <ExternalLink style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bestMatch.source_url}
              </span>
            </a>
          </div>

          <div className="mono-box-goa" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569' }}>ENGINE:</span>
              <span style={{ color: '#021a0e', fontWeight: 800 }}>{searchData.engine_used}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569' }}>LATENCY:</span>
              <span style={{ color: '#0d5c36', fontWeight: 900 }}>{searchData.processing_time_ms}ms</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', border: '2px solid #021a0e', borderRadius: '10px', boxShadow: '2px 2px 0px #021a0e' }}>
          <AlertTriangle style={{ width: 32, height: 32, color: '#f59e0b', margin: '0 auto 10px' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 900, color: '#021a0e' }}>
            NO GENUINE MATCH FOUND
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginTop: '6px' }}>
            {searchData.status_message}
          </div>
        </div>
      )}
    </div>
  );
}
