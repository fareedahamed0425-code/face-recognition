import React, { useRef } from 'react';
import { Upload, Scan, Hash, Sparkles, Check, Copy } from 'lucide-react';

export default function ImageInspector({
  imagePreview,
  onImageSelected,
  faceData,
  imageHash,
  isProcessing,
  fileMeta
}) {
  const fileInputRef = useRef(null);
  const [copiedHash, setCopiedHash] = React.useState(false);

  const handleCopyHash = () => {
    if (imageHash) {
      navigator.clipboard.writeText(imageHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  const primaryFace = faceData?.faces?.[0];

  return (
    <div className="tech-card p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#232d42] pb-3">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase font-mono">
            1. Input & Biometric Scan
          </h2>
        </div>
        {faceData?.face_detected && (
          <span className="tech-badge badge-success text-[10px]">
            {faceData.face_count} FACE{faceData.face_count > 1 ? 'S' : ''} DETECTED
          </span>
        )}
      </div>

      {/* Image Preview & Bounding Box Canvas */}
      <div className="relative aspect-square w-full rounded-lg bg-[#0b0e17] border border-[#232d42] overflow-hidden flex items-center justify-center group">
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Query Face"
              className="w-full h-full object-contain"
            />

            {/* Bounding Box Overlay if face detected */}
            {primaryFace && (
              <div
                className="absolute border-2 border-cyan-400/90 rounded-sm pointer-events-none transition-all duration-300"
                style={{
                  left: `${primaryFace.normalized_bbox.x * 100}%`,
                  top: `${primaryFace.normalized_bbox.y * 100}%`,
                  width: `${primaryFace.normalized_bbox.w * 100}%`,
                  height: `${primaryFace.normalized_bbox.h * 100}%`,
                  boxShadow: '0 0 14px rgba(6, 182, 212, 0.4)'
                }}
              >
                <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-[10px] font-mono text-cyan-300">
                  FACE 1 ({Math.round(primaryFace.confidence * 100)}%)
                </span>
              </div>
            )}

            {isProcessing && <div className="scan-overlay" />}
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-blue-500/50 transition-colors w-full h-full"
          >
            <div className="p-3 rounded-full bg-[#161c2b] border border-[#232d42] text-slate-400 mb-3 group-hover:text-cyan-400 group-hover:scale-110 transition-all">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-300">Click to Upload Subject Photo</p>
            <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP (Max 10MB)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload change button */}
      {imagePreview && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full py-1.5 px-3 rounded bg-[#161c2b] hover:bg-[#1c2336] border border-[#232d42] text-xs font-mono text-slate-300 transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          Replace Image
        </button>
      )}

      {/* File & Detection Metadata */}
      <div className="space-y-2.5 pt-1 text-xs">
        {/* SHA-256 Digest */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-mono">
              <Hash className="w-3 h-3 text-blue-400" /> INPUT SHA-256 HASH
            </span>
            {imageHash && (
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedHash ? 'COPIED' : 'COPY'}
              </button>
            )}
          </div>
          <div className="p-2 rounded bg-[#0b0e17] border border-[#232d42] font-mono text-[11px] text-slate-300 truncate">
            {imageHash ? imageHash : <span className="text-slate-600">Pending upload...</span>}
          </div>
        </div>

        {/* Biometric Feature Vector Preview */}
        {faceData?.primary_embedding_preview && (
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-cyan-400" /> 128D BIOMETRIC VECTOR
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {faceData.processing_time_ms}ms
              </span>
            </div>
            <div className="p-2 rounded bg-[#0b0e17] border border-[#232d42] font-mono text-[10px] text-cyan-300 grid grid-cols-4 gap-1">
              {faceData.primary_embedding_preview.map((val, i) => (
                <span key={i} className="px-1 py-0.5 rounded bg-cyan-950/40 border border-cyan-900/40 text-center">
                  {val.toFixed(3)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
