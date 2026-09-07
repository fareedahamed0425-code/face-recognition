import React from 'react';
import { Image, ScanFace, Globe, CheckCircle2, Blocks, ArrowRight, Loader2, XCircle, AlertTriangle } from 'lucide-react';

const STAGES = [
  { id: 'image', key: 'input_image', label: '1. IMAGE', icon: Image, desc: 'Ingestion & Hashing' },
  { id: 'face_id', key: 'face_detection', label: '2. FACE ID', icon: ScanFace, desc: '128D Embedding' },
  { id: 'reverse_search', key: 'reverse_search', label: '3. REVERSE SEARCH', icon: Globe, desc: 'Google Lens API' },
  { id: 'verify', key: 'verification', label: '4. VERIFY', icon: CheckCircle2, desc: 'Biometric Match' },
  { id: 'blockchain', key: 'blockchain', label: '5. BLOCKCHAIN', icon: Blocks, desc: 'On-Chain Proof' }
];

export default function PipelineTracker({ stageStatus, activeStage }) {
  const getStageBadge = (stageId) => {
    const status = stageStatus[stageId] || 'pending';
    switch (status) {
      case 'processing':
        return {
          badgeClass: 'badge-processing',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
          text: 'PROCESSING'
        };
      case 'success':
        return {
          badgeClass: 'badge-success',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          text: 'SUCCESS'
        };
      case 'failed':
        return {
          badgeClass: 'badge-failed',
          icon: <XCircle className="w-3.5 h-3.5" />,
          text: 'FAILED'
        };
      case 'warning':
        return {
          badgeClass: 'badge-warning',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          text: 'NO MATCH'
        };
      default:
        return {
          badgeClass: 'badge-pending',
          icon: <span className="w-2 h-2 rounded-full bg-slate-500"></span>,
          text: 'PENDING'
        };
    }
  };

  return (
    <div className="w-full bg-[#111622] border-y border-[#232d42] px-6 py-3.5 shadow-inner">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-center">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const { badgeClass, icon: statusIcon, text: statusText } = getStageBadge(stage.id);
            const isCurrent = activeStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`flex flex-col p-3 rounded-lg border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#1a2236] border-blue-500/70 shadow-lg shadow-blue-500/10'
                    : 'bg-[#141a29] border-[#232d42]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-mono font-bold tracking-wide text-slate-200">
                      {stage.label}
                    </span>
                  </div>
                  <span className={`tech-badge ${badgeClass}`}>
                    {statusIcon}
                    <span className="text-[10px]">{statusText}</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans truncate">
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
