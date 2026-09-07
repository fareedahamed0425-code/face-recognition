import React from 'react';
import { Globe, ExternalLink, ShieldAlert, Sparkles, Clock, Share2, Search } from 'lucide-react';

export default function SearchResultsView({ searchData, isProcessing }) {
  const matches = searchData?.matches || [];
  const bestMatch = searchData?.best_match;
  const hasSearched = Boolean(searchData);

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'X (Twitter)':
        return 'bg-slate-900 border-slate-700 text-sky-400';
      case 'Instagram':
        return 'bg-pink-950/60 border-pink-800/60 text-pink-300';
      case 'LinkedIn':
        return 'bg-blue-950/60 border-blue-800/60 text-blue-300';
      case 'Reddit':
        return 'bg-orange-950/60 border-orange-800/60 text-orange-300';
      case 'Wikipedia':
        return 'bg-slate-800 border-slate-600 text-slate-200';
      default:
        return 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300';
    }
  };

  return (
    <div className="tech-card p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#232d42] pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase font-mono">
            2. Web Reverse-Image Search
          </h2>
        </div>
        {searchData && (
          <span className={`tech-badge ${matches.length > 0 ? 'badge-success' : 'badge-warning'} text-[10px]`}>
            {matches.length} MATCH{matches.length !== 1 ? 'ES' : ''}
          </span>
        )}
      </div>

      {/* Main Content Area */}
      {!hasSearched ? (
        <div className="aspect-square w-full rounded-lg bg-[#0b0e17] border border-[#232d42] flex flex-col items-center justify-center p-6 text-center text-slate-500">
          <Search className="w-8 h-8 text-slate-600 mb-2" />
          <p className="text-xs font-semibold text-slate-400">Search Pending</p>
          <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
            Execute verification to query public web & social sources in real-time.
          </p>
        </div>
      ) : bestMatch ? (
        <div className="flex flex-col gap-3">
          {/* Best Match Discovered Card */}
          <div className="rounded-lg bg-[#0e131f] border border-blue-500/40 p-3 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getPlatformColor(bestMatch.platform)}`}>
                {bestMatch.platform}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                CONFIDENCE: {bestMatch.confidence_percentage}
              </span>
            </div>

            {/* Matched Image Preview */}
            <div className="aspect-video w-full rounded bg-[#070a10] border border-[#232d42] overflow-hidden mb-2.5 flex items-center justify-center">
              {bestMatch.matched_image_url ? (
                <img
                  src={bestMatch.matched_image_url}
                  alt="Matched post"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[11px] text-slate-600 font-mono">Image reference verified</div>
              )}
            </div>

            {/* Title & Link */}
            <h3 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
              {bestMatch.title}
            </h3>

            <a
              href={bestMatch.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline truncate"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{bestMatch.source_url}</span>
            </a>
          </div>

          {/* Search Engine Diagnostic Info */}
          <div className="p-2.5 rounded bg-[#0b0e17] border border-[#232d42] text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>ENGINE:</span>
              <span className="text-slate-200">{searchData.engine_used}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>LATENCY:</span>
              <span className="text-emerald-400">{searchData.processing_time_ms}ms</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>TIMESTAMP:</span>
              <span className="text-slate-300 text-[10px]">{searchData.search_timestamp}</span>
            </div>
          </div>
        </div>
      ) : (
        /* No Match Found State */
        <div className="rounded-lg bg-[#0e131f] border border-[#232d42] p-5 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="w-8 h-8 text-amber-400/80 mb-2" />
          <h3 className="text-xs font-bold text-slate-300 font-mono">NO GENUINE MATCH FOUND</h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">
            {searchData.status_message}
          </p>
          <div className="mt-3 p-2 rounded bg-[#070a10] border border-[#232d42] w-full text-[10px] font-mono text-slate-500">
            ENGINE: {searchData.engine_used} ({searchData.processing_time_ms}ms)
          </div>
        </div>
      )}
    </div>
  );
}
