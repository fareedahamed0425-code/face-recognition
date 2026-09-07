import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertCircle, Shield } from 'lucide-react';
import Header from './components/Header';
import PipelineTracker from './components/PipelineTracker';
import ImageInspector from './components/ImageInspector';
import SearchResultsView from './components/SearchResultsView';
import VerificationCard from './components/VerificationCard';
import BlockchainRecordCard from './components/BlockchainRecordCard';
import ActivityLog from './components/ActivityLog';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [health, setHealth] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStage, setActiveStage] = useState(null);

  const [stageStatus, setStageStatus] = useState({
    image: 'pending',
    face_id: 'pending',
    reverse_search: 'pending',
    verify: 'pending',
    blockchain: 'pending'
  });

  const [pipelineData, setPipelineData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.log('API health check pending...', err));
  }, []);

  const addLog = (stage, message, status = 'INFO') => {
    const now = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { timestamp: now, stage, message, status }]);
  };

  const handleImageSelected = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setPipelineData(null);
    setErrorMessage(null);
    setStageStatus({
      image: 'success',
      face_id: 'pending',
      reverse_search: 'pending',
      verify: 'pending',
      blockchain: 'pending'
    });
    addLog('IMAGE', `Image selected: ${file.name} (${Math.round(file.size / 1024)} KB)`);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setPipelineData(null);
    setIsProcessing(false);
    setActiveStage(null);
    setErrorMessage(null);
    setStageStatus({
      image: 'pending',
      face_id: 'pending',
      reverse_search: 'pending',
      verify: 'pending',
      blockchain: 'pending'
    });
    addLog('SYSTEM', 'Pipeline reset to idle state.');
  };

  const handleRunVerification = async () => {
    if (!selectedFile && !imagePreview) {
      setErrorMessage('Please upload or select an input image first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    addLog('SYSTEM', 'Initiating MINDBRIDGE Face ID + Blockchain verification pipeline...');

    setStageStatus({
      image: 'processing',
      face_id: 'pending',
      reverse_search: 'pending',
      verify: 'pending',
      blockchain: 'pending'
    });
    setActiveStage('image');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      setTimeout(() => {
        setStageStatus(s => ({ ...s, image: 'success', face_id: 'processing' }));
        setActiveStage('face_id');
      }, 300);

      setTimeout(() => {
        setStageStatus(s => ({ ...s, face_id: 'success', reverse_search: 'processing' }));
        setActiveStage('reverse_search');
      }, 900);

      setTimeout(() => {
        setStageStatus(s => ({ ...s, reverse_search: 'success', verify: 'processing' }));
        setActiveStage('verify');
      }, 1600);

      setTimeout(() => {
        setStageStatus(s => ({ ...s, verify: 'success', blockchain: 'processing' }));
        setActiveStage('blockchain');
      }, 2300);

      const response = await fetch(`${API_BASE}/api/verify`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Verification pipeline failed.');
      }

      const result = await response.json();
      setPipelineData(result);

      if (result.logs && result.logs.length > 0) {
        setLogs(prev => [...prev, ...result.logs]);
      }

      const searchSuccess = result.stages?.reverse_search?.success;
      const verifyStatus = result.stages?.verification?.status;

      setStageStatus({
        image: 'success',
        face_id: result.stages?.face_detection?.face_detected ? 'success' : 'failed',
        reverse_search: searchSuccess ? 'success' : 'warning',
        verify: verifyStatus === 'VERIFIED' ? 'success' : verifyStatus === 'NOT VERIFIED' ? 'failed' : 'warning',
        blockchain: result.stages?.blockchain?.is_confirmed ? 'success' : 'failed'
      });
      setActiveStage(null);

    } catch (err) {
      console.error('Verification error:', err);
      setErrorMessage(err.message || 'Verification failed unexpectedly.');
      setStageStatus(s => ({ ...s, [activeStage || 'verify']: 'failed' }));
      addLog('ERROR', `Pipeline aborted: ${err.message}`, 'ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportAudit = () => {
    if (!pipelineData) return;
    const exportObj = {
      team: 'MINDBRIDGE',
      event: 'Hacker House Goa 2026',
      title: 'Face ID + Blockchain Tamper-Evident Verification Audit',
      exported_at: new Date().toISOString(),
      audit_record: pipelineData.audit_record,
      blockchain_proof: pipelineData.stages?.blockchain,
      biometric_verification: pipelineData.stages?.verification,
      face_features: pipelineData.stages?.face_detection,
      execution_logs: logs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindbridge_audit_${pipelineData.audit_record?.record_id?.slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="console-app">
      <Header
        health={health}
        onExportAudit={handleExportAudit}
        hasAuditRecord={Boolean(pipelineData?.audit_record)}
      />

      <PipelineTracker
        stageStatus={stageStatus}
        activeStage={activeStage}
      />

      <main className="main-workspace">
        <div className="max-container">
          
          {/* Action Banner with Goa Theme */}
          <div className="action-banner-goa">
            <div className="action-banner-info">
              <h2>🌴 Single-Click Verification Pipeline</h2>
              <p>Extracts 128D facial embeddings, executes live Google Lens reverse-image search, verifies biometrics, and commits proof on-chain.</p>
            </div>

            <div className="action-btn-group">
              <button
                onClick={handleReset}
                disabled={isProcessing || (!imagePreview && !pipelineData)}
                className="secondary-btn-sand"
              >
                <RotateCcw style={{ width: 16, height: 16 }} />
                <span>Reset</span>
              </button>

              <button
                onClick={handleRunVerification}
                disabled={isProcessing || (!selectedFile && !imagePreview)}
                className="glow-btn-pink"
              >
                <Play style={{ width: 18, height: 18, fill: '#ffffff' }} />
                <span>{isProcessing ? 'VERIFYING...' : 'RUN VERIFICATION 🌴'}</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div style={{ padding: '14px 18px', borderRadius: '10px', background: '#fee2e2', border: '2px solid #ef4444', color: '#991b1b', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontFamily: 'var(--font-mono)', boxShadow: '3px 3px 0px #021a0e' }}>
              <AlertCircle style={{ width: 18, height: 18, color: '#ef4444', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 3-Column Workspace */}
          <div className="workspace-grid">
            <ImageInspector
              imagePreview={imagePreview}
              onImageSelected={handleImageSelected}
              faceData={pipelineData?.stages?.face_detection}
              imageHash={pipelineData?.stages?.input_image?.sha256}
              isProcessing={isProcessing}
            />

            <SearchResultsView
              searchData={pipelineData?.stages?.reverse_search}
              isProcessing={isProcessing}
            />

            <div className="goa-card">
              <div className="card-header-row">
                <div className="card-title-box">
                  <Shield style={{ width: 18, height: 18, color: '#0d5c36' }} />
                  <span className="card-title">3. Verification & Blockchain</span>
                </div>
                {pipelineData?.stages?.blockchain && (
                  <span className="stage-badge-goa badge-success">ON-CHAIN PROOF</span>
                )}
              </div>

              <VerificationCard
                verifyData={pipelineData?.stages?.verification}
              />

              <BlockchainRecordCard
                blockchainData={pipelineData?.stages?.blockchain}
              />
            </div>
          </div>

          {/* Forensic Activity Log */}
          <ActivityLog
            logs={logs}
            onClearLogs={() => setLogs([])}
          />
        </div>
      </main>

      <footer className="console-footer-goa">
        TEAM MINDBRIDGE • Hacker House Goa 2026 • Face ID + Blockchain Verification Pipeline
      </footer>
    </div>
  );
}
