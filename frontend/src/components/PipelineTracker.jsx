import React from 'react';
import { Image, ScanFace, Globe, CheckCircle2, Blocks, Loader2, XCircle, AlertTriangle } from 'lucide-react';

const STAGES = [
  { id: 'image', label: '1. IMAGE', icon: Image, desc: 'Ingestion & SHA-256' },
  { id: 'face_id', label: '2. FACE ID', icon: ScanFace, desc: '128D Feature Vector' },
  { id: 'reverse_search', label: '3. REVERSE SEARCH', icon: Globe, desc: 'Google Lens API' },
  { id: 'verify', label: '4. VERIFY', icon: CheckCircle2, desc: 'Biometric Match' },
  { id: 'blockchain', label: '5. BLOCKCHAIN', icon: Blocks, desc: 'On-Chain Proof' }
];

export default function PipelineTracker({ stageStatus, activeStage }) {
  const getBadgeInfo = (stageId) => {
    const status = stageStatus[stageId] || 'pending';
    switch (status) {
      case 'processing':
        return { cls: 'badge-processing', text: 'PROCESSING', icon: <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> };
      case 'success':
        return { cls: 'badge-success', text: 'SUCCESS', icon: <CheckCircle2 style={{ width: 12, height: 12 }} /> };
      case 'failed':
        return { cls: 'badge-failed', text: 'FAILED', icon: <XCircle style={{ width: 12, height: 12 }} /> };
      case 'warning':
        return { cls: 'badge-warning', text: 'NO MATCH', icon: <AlertTriangle style={{ width: 12, height: 12 }} /> };
      default:
        return { cls: 'badge-pending', text: 'PENDING', icon: null };
    }
  };

  return (
    <div className="pipeline-tracker-bar">
      <div className="max-container">
        <div className="stages-grid">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const badge = getBadgeInfo(stage.id);
            const isCurrent = activeStage === stage.id;

            return (
              <div key={stage.id} className={`stage-stamp-card ${isCurrent ? 'is-current' : ''}`}>
                <div className="stage-header-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon style={{ width: 16, height: 16, color: '#0d5c36' }} />
                    <span className="stage-title">{stage.label}</span>
                  </div>
                  <span className={`stage-badge-goa ${badge.cls}`}>
                    {badge.icon}
                    <span>{badge.text}</span>
                  </span>
                </div>
                <div className="stage-desc">{stage.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
