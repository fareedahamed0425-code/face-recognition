import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

export default function VerificationCard({ verifyData }) {
  if (!verifyData) {
    return (
      <div className="rounded-lg bg-[#0b0e17] border border-[#232d42] p-4 text-center text-slate-500 text-xs">
        <p className="font-mono">Verification verdict pending execution...</p>
      </div>
    );
  }

  const status = verifyData.status; // VERIFIED, NOT VERIFIED, NO MATCH FOUND
  const isVerified = status === 'VERIFIED';
  const isRejected = status === 'NOT VERIFIED';

  return (
    <div className="flex flex-col gap-3">
      {/* Verdict Header Banner */}
      <div
        className={`p-3 rounded-lg border flex items-center justify-between ${
          isVerified
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
            : isRejected
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isVerified ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isRejected ? (
            <XCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <div>
            <div className="text-xs font-bold font-mono tracking-wider">
              {status}
            </div>
            <div className="text-[10px] opacity-80 font-sans">
              {isVerified
                ? 'Biometric & cryptographic validation passed'
                : isRejected
                ? 'Biometric similarity below threshold'
                : 'No online match to compare'}
            </div>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-lg font-extrabold">
            {verifyData.similarity_percentage || '0%'}
          </span>
          <div className="text-[9px] uppercase tracking-wider opacity-75">SIMILARITY</div>
        </div>
      </div>

      {/* Verification Metrics Details */}
      <div className="p-3 rounded-lg bg-[#0b0e17] border border-[#232d42] space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>SOURCE PLATFORM:</span>
          <span className="text-slate-200 font-semibold">{verifyData.source_platform || 'N/A'}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>BIOMETRIC THRESHOLD:</span>
          <span className="text-slate-300">65.00% (Cosine Dist)</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>MATCHED SHA-256:</span>
          <span className="text-cyan-400 text-[10px] truncate max-w-[170px]" title={verifyData.matched_image_hash}>
            {verifyData.matched_image_hash ? verifyData.matched_image_hash.slice(0, 16) + '...' : '0x0000000000...'}
          </span>
        </div>
      </div>
    </div>
  );
}
