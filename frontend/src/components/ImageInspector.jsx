import React, { useRef, useState } from 'react';
import { Scan, Upload, Copy, Check, Sparkles } from 'lucide-react';

export default function ImageInspector({
  imagePreview,
  onImageSelected,
  faceData,
  imageHash,
  isProcessing
}) {
  const fileInputRef = useRef(null);
  const [copiedHash, setCopiedHash] = useState(false);

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
    <div className="tech-card">
      <div className="card-header-row">
        <div className="card-title-box">
          <Scan style={{ width: 16, height: 16, color: '#06b6d4' }} />
          <span className="card-title">1. Input & Biometrics</span>
        </div>
        {faceData?.face_detected && (
          <span className="stage-badge badge-success">
            {faceData.face_count} FACE{faceData.face_count > 1 ? 'S' : ''} DETECTED
          </span>
        )}
      </div>

      {/* Image Dropzone Box */}
      <div className="dropzone-box" onClick={() => fileInputRef.current?.click()}>
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Query Face" className="preview-img" />

            {primaryFace && (
              <div
                className="bounding-box"
                style={{
                  left: `${primaryFace.normalized_bbox.x * 100}%`,
                  top: `${primaryFace.normalized_bbox.y * 100}%`,
                  width: `${primaryFace.normalized_bbox.w * 100}%`,
                  height: `${primaryFace.normalized_bbox.h * 100}%`
                }}
              >
                <span className="bbox-label">
                  FACE 1 ({Math.round(primaryFace.confidence * 100)}%)
                </span>
              </div>
            )}

            {isProcessing && <div className="scan-laser" />}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#111726', border: '1px solid #1e293d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Upload style={{ width: 20, height: 20, color: '#38bdf8' }} />
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>Click to Upload Subject Photo</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>PNG, JPG, WEBP</div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {imagePreview && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="secondary-btn"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Upload style={{ width: 14, height: 14, color: '#06b6d4' }} />
          <span>REPLACE SUBJECT PHOTO</span>
        </button>
      )}

      {/* SHA-256 Digest */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
          <span>INPUT SHA-256 DIGEST</span>
          {imageHash && (
            <button
              onClick={handleCopyHash}
              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}
            >
              {copiedHash ? <Check style={{ width: 12, height: 12, color: '#10b981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
              <span>{copiedHash ? 'COPIED' : 'COPY'}</span>
            </button>
          )}
        </div>
        <div className="mono-box">
          {imageHash || 'Pending upload...'}
        </div>
      </div>

      {/* Biometric Feature Vector Preview */}
      {faceData?.primary_embedding_preview && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles style={{ width: 12, height: 12, color: '#06b6d4' }} /> 128D BIOMETRIC VECTOR
            </span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>{faceData.processing_time_ms}ms</span>
          </div>
          <div className="vector-grid">
            {faceData.primary_embedding_preview.map((val, i) => (
              <div key={i} className="vector-cell">
                {val.toFixed(3)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
