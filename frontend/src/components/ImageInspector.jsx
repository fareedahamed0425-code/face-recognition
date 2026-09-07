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
    <div className="goa-card">
      <div className="card-header-row">
        <div className="card-title-box">
          <Scan style={{ width: 18, height: 18, color: '#0d5c36' }} />
          <span className="card-title">1. Input & Biometrics</span>
        </div>
        {faceData?.face_detected && (
          <span className="stage-badge-goa badge-success">
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
                className="bounding-box-goa"
                style={{
                  left: `${primaryFace.normalized_bbox.x * 100}%`,
                  top: `${primaryFace.normalized_bbox.y * 100}%`,
                  width: `${primaryFace.normalized_bbox.w * 100}%`,
                  height: `${primaryFace.normalized_bbox.h * 100}%`
                }}
              >
                <span className="bbox-label-goa">
                  FACE 1 ({Math.round(primaryFace.confidence * 100)}%)
                </span>
              </div>
            )}

            {isProcessing && <div className="scan-laser-goa" />}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#ffd000', border: '2px solid #021a0e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '2px 2px 0px #021a0e' }}>
              <Upload style={{ width: 24, height: 24, color: '#021a0e' }} />
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#021a0e' }}>
              Upload Subject Photo 📸
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0d5c36', fontWeight: 700, marginTop: '4px' }}>
              PNG, JPG, WEBP (Max 10MB)
            </div>
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
          className="secondary-btn-sand"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Upload style={{ width: 16, height: 16, color: '#0d5c36' }} />
          <span>REPLACE PHOTO</span>
        </button>
      )}

      {/* SHA-256 Digest */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#094528', fontWeight: 800, marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
          <span>INPUT SHA-256 DIGEST</span>
          {imageHash && (
            <button
              onClick={handleCopyHash}
              style={{ background: 'none', border: 'none', color: '#ff007f', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
            >
              {copiedHash ? <Check style={{ width: 12, height: 12, color: '#10b981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
              <span>{copiedHash ? 'COPIED' : 'COPY'}</span>
            </button>
          )}
        </div>
        <div className="mono-box-goa">
          {imageHash || 'Pending upload...'}
        </div>
      </div>

      {/* Biometric Feature Vector Preview */}
      {faceData?.primary_embedding_preview && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#094528', fontWeight: 800, marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles style={{ width: 13, height: 13, color: '#ff007f' }} /> 128D BIOMETRIC VECTOR
            </span>
            <span style={{ color: '#0d5c36', fontWeight: 900 }}>{faceData.processing_time_ms}ms</span>
          </div>
          <div className="vector-grid-goa">
            {faceData.primary_embedding_preview.map((val, i) => (
              <div key={i} className="vector-cell-goa">
                {val.toFixed(3)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
