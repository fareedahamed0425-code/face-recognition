import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertCircle, Sparkles, CheckCircle2, Shield } from 'lucide-react';
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

  // Pipeline Stage Status: pending | processing | success | failed | warning
  const [stageStatus, setStageStatus] = useState({
    image: 'pending',
    face_id: 'pending',
    reverse_search: 'pending',
    verify: 'pending',
    blockchain: 'pending'
  });

  // Pipeline Data State
  const [pipelineData, setPipelineData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch API Health on load
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

    // Reset pipeline state
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
    addLog('SYSTEM', 'Initiating complete Face ID + Blockchain verification pipeline...');

    // Progress through visual stages
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

      // Simulate sequential visual stage indicators while backend executes
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

      // Append backend logs
      if (result.logs && result.logs.length > 0) {
        setLogs(prev => [...prev, ...result.logs]);
      }

      // Set final stage states based on actual result
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
    downloadAnchor.setAttribute('download', `audit_proof_${pipelineData.audit_record?.record_id?.slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans">
      <Header
        health={health}
        onExportAudit={handleExportAudit}
        hasAuditRecord={Boolean(pipelineData?.audit_record)}
      />

      {/* Sequential Pipeline Tracker */}
      <PipelineTracker
        stageStatus={stageStatus}
        activeStage={activeStage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 flex flex-col gap-6">
        
        {/* Primary Action Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#111622] border border-[#232d42] shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/30 text-cyan-400 hidden sm:block">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-200">
                Single-Click Forensic Pipeline Execution
              </h2>
              <p className="text-xs text-slate-400">
                Detects face geometry, queries live web reverse-image sources, verifies biometrics, and anchors proof on-chain.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleReset}
              disabled={isProcessing || (!imagePreview && !pipelineData)}
              className="py-2.5 px-4 rounded-lg bg-[#161c2b] hover:bg-[#1f283d] text-slate-300 font-mono text-xs border border-[#232d42] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              onClick={handleRunVerification}
              disabled={isProcessing || (!selectedFile && !imagePreview)}
              className="glow-btn py-2.5 px-6 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              <Play className="w-4 h-4 fill-current" />
              {isProcessing ? 'VERIFYING PIPELINE...' : 'RUN VERIFICATION'}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Image & Face ID */}
          <ImageInspector
            imagePreview={imagePreview}
            onImageSelected={handleImageSelected}
            faceData={pipelineData?.stages?.face_detection}
            imageHash={pipelineData?.stages?.input_image?.sha256}
            isProcessing={isProcessing}
          />

          {/* Column 2: Reverse Image Search */}
          <SearchResultsView
            searchData={pipelineData?.stages?.reverse_search}
            isProcessing={isProcessing}
          />

          {/* Column 3: Verification & Blockchain Proof */}
          <div className="tech-card p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#232d42] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase font-mono">
                  3. Verification & Blockchain
                </h2>
              </div>
              {pipelineData?.stages?.blockchain && (
                <span className="tech-badge badge-success text-[10px]">
                  ON-CHAIN PROOF
                </span>
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

        {/* Activity / Technical Execution Log */}
        <ActivityLog
          logs={logs}
          onClearLogs={() => setLogs([])}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232d42] py-4 px-6 text-center text-xs text-slate-500 font-mono">
        Face ID + Blockchain Verification Pipeline • EVM Smart Contract Registry & Reverse-Image Biometrics
      </footer>
    </div>
  );
}
