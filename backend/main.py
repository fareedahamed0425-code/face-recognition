"""
Face ID + Blockchain Verification Pipeline Backend Server
FastAPI Server orchestrating the 5-stage verification workflow:
1. Input Image Ingestion
2. Face Detection & Feature Extraction
3. Genuine Reverse-Image Search
4. Biometric Match Verification
5. Tamper-Evident Blockchain Record Commitment
"""

import os
import io
import time
import json
import base64
import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from pipeline.face_engine import FaceEngine
from pipeline.search_engine import ReverseSearchEngine
from pipeline.verifier import MatchVerifier
from pipeline.blockchain_engine import BlockchainEngine

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("api")

app = FastAPI(
    title="Face ID + Blockchain Verification Console API",
    description="Genuine reverse-image biometric verification with tamper-evident blockchain proof.",
    version="1.0.0"
)

# Enable CORS for frontend Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize pipeline singletons
face_engine = FaceEngine()
search_engine = ReverseSearchEngine()
verifier = MatchVerifier(face_engine=face_engine)
blockchain_engine = BlockchainEngine()

# In-memory execution log queue for SSE streaming
log_subscribers: List[asyncio.Queue] = []


def emit_log(stage: str, message: str, status: str = "INFO", details: Optional[Dict[str, Any]] = None):
    """
    Format and broadcast a real-time execution log event.
    """
    now = time.strftime("%H:%M:%S", time.localtime())
    event_payload = {
        "timestamp": now,
        "stage": stage,
        "message": message,
        "status": status,
        "details": details or {}
    }
    logger.info(f"[{now}] [{stage}] {message}")
    
    # Broadcast to all SSE listeners
    for q in list(log_subscribers):
        try:
            q.put_nowait(event_payload)
        except Exception:
            pass
    return event_payload


@app.get("/api/health")
def health_check():
    """
    Health check and environment configuration diagnostics.
    """
    return {
        "status": "ONLINE",
        "service": "Face ID + Blockchain Verification Pipeline",
        "version": "1.0.0",
        "serpapi_configured": bool(os.getenv("SERPAPI_API_KEY")),
        "blockchain_network": blockchain_engine.network_name,
        "chain_id": blockchain_engine.network_config.get("chain_id"),
        "signer_configured": bool(blockchain_engine.private_key),
        "contract_address": blockchain_engine.contract_address or "Auto / Testnet Mode",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    }


@app.get("/api/logs/stream")
async def stream_logs():
    """
    Server-Sent Events endpoint for real-time technical execution log streaming.
    """
    async def event_generator():
        q = asyncio.Queue()
        log_subscribers.append(q)
        try:
            # Send initial connection heartbeat
            yield f"data: {json.dumps({'timestamp': time.strftime('%H:%M:%S'), 'stage': 'SYSTEM', 'message': 'Log stream connected to verification engine.', 'status': 'READY'})}\n\n"
            while True:
                data = await q.get()
                yield f"data: {json.dumps(data)}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            if q in log_subscribers:
                log_subscribers.remove(q)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/verify")
async def run_verification_pipeline(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    """
    Main verification pipeline endpoint.
    Executes all 5 stages in sequence:
    1. Input Validation
    2. Face Detection & 128D Embedding
    3. Reverse Image Search (Google Lens)
    4. Match Verification & Biometrics
    5. Blockchain Transaction & Explorer Proof
    """
    execution_start = time.perf_counter()
    logs: List[Dict[str, Any]] = []

    def log(stage: str, msg: str, st: str = "INFO", d: Optional[Dict] = None):
        entry = emit_log(stage, msg, st, d)
        logs.append(entry)

    # -------------------------------------------------------------
    # STAGE 1: IMAGE INGESTION & VALIDATION
    # -------------------------------------------------------------
    log("IMAGE", "Initializing verification pipeline...", "PENDING")
    
    image_bytes = None
    filename = "input.jpg"

    if file:
        log("IMAGE", f"Reading uploaded file: {file.filename} ({file.content_type})")
        image_bytes = await file.read()
        filename = file.filename
    elif sample_id:
        log("IMAGE", f"Loading sample reference image: {sample_id}")
        sample_path = Path(__file__).parent / "samples" / f"{sample_id}.jpg"
        if sample_path.exists():
            image_bytes = sample_path.read_bytes()
            filename = f"{sample_id}.jpg"
        else:
            raise HTTPException(status_code=400, detail=f"Sample {sample_id} not found.")
    else:
        log("IMAGE", "Verification failed: No image provided.", "ERROR")
        raise HTTPException(status_code=400, detail="No image file or sample provided.")

    if len(image_bytes) < 100:
        log("IMAGE", "Validation failed: Image data is empty or corrupted.", "ERROR")
        raise HTTPException(status_code=400, detail="Uploaded file is empty or corrupted.")

    # Image metadata
    b64_image = base64.b64encode(image_bytes).decode("utf-8")
    data_uri = f"data:image/jpeg;base64,{b64_image}"
    file_size_kb = round(len(image_bytes) / 1024, 2)
    log("IMAGE", f"Image ingested successfully ({file_size_kb} KB). File verified.", "SUCCESS")

    # -------------------------------------------------------------
    # STAGE 2: FACE DETECTION & BIOMETRIC ENCODING
    # -------------------------------------------------------------
    log("FACE_ID", "Scanning image for facial geometry and biometric landmarks...", "PENDING")
    face_result = face_engine.process_image(image_bytes)

    if not face_result["face_detected"]:
        log("FACE_ID", "No human faces detected in the provided image.", "FAILED", {
            "processing_time_ms": face_result["processing_time_ms"]
        })
    else:
        face_cnt = face_result["face_count"]
        emb_preview = face_result.get("primary_embedding_preview")
        log("FACE_ID", f"Detected {face_cnt} face(s) in {face_result['processing_time_ms']}ms. Generated 128D biometric vector.", "SUCCESS", {
            "face_count": face_cnt,
            "embedding_sample": emb_preview,
            "embedding_hash": face_result.get("embedding_hash")
        })

    # -------------------------------------------------------------
    # STAGE 3: GENUINE REVERSE IMAGE SEARCH
    # -------------------------------------------------------------
    log("REVERSE_SEARCH", "Submitting query to public reverse-image search engine...", "PENDING")
    search_result = search_engine.search(image_bytes, filename)

    if search_result.get("success") and search_result.get("total_matches", 0) > 0:
        best = search_result["best_match"]
        log("REVERSE_SEARCH", f"Discovered {search_result['total_matches']} matching public result(s) via {search_result['engine_used']}.", "SUCCESS", {
            "platform": best.get("platform"),
            "source_url": best.get("source_url"),
            "match_title": best.get("title"),
            "search_time_ms": search_result["processing_time_ms"]
        })
    else:
        status_msg = search_result.get("status_message", "No matching results discovered.")
        log("REVERSE_SEARCH", f"Reverse search complete: {status_msg}", "WARNING" if not search_result.get("success") else "SUCCESS", {
            "engine": search_result.get("engine_used"),
            "matches_found": 0
        })

    # -------------------------------------------------------------
    # STAGE 4: MATCH VERIFICATION & CRYPTOGRAPHIC HASHING
    # -------------------------------------------------------------
    log("VERIFY", "Comparing query face against reverse-search candidate...", "PENDING")
    verify_result = verifier.verify(
        input_image_bytes=image_bytes,
        input_face_data=face_result,
        search_result=search_result
    )

    verdict = verify_result["status"]
    sim_pct = verify_result.get("similarity_percentage", "0%")
    
    if verdict == "VERIFIED":
        log("VERIFY", f"Biometric Match VERIFIED ({sim_pct} similarity) on {verify_result.get('source_platform')}.", "SUCCESS", {
            "similarity": verify_result.get("similarity_score"),
            "input_hash": verify_result["input_image_hash"][:16] + "...",
            "matched_hash": verify_result["matched_image_hash"][:16] + "..." if verify_result.get("matched_image_hash") else None
        })
    elif verdict == "NOT VERIFIED":
        log("VERIFY", f"Biometric Match NOT VERIFIED: Similarity {sim_pct} below threshold.", "FAILED")
    else:
        log("VERIFY", "Verification Status: NO MATCH FOUND.", "INFO")

    # -------------------------------------------------------------
    # STAGE 5: BLOCKCHAIN ANCHORING & TRANSACTION PROOF
    # -------------------------------------------------------------
    log("BLOCKCHAIN", f"Broadcasting tamper-evident verification record to {blockchain_engine.network_name}...", "PENDING")
    
    audit_record = verify_result["audit_record"]
    blockchain_result = blockchain_engine.commit_verification_record(audit_record)

    tx_hash = blockchain_result["transaction_hash"]
    block_num = blockchain_result["block_number"]
    explorer_url = blockchain_result["explorer_url"]
    
    log("BLOCKCHAIN", f"Transaction confirmed in Block #{block_num} | Tx: {tx_hash[:18]}...", "SUCCESS", {
        "network": blockchain_result["network"],
        "transaction_hash": tx_hash,
        "block_number": block_num,
        "explorer_url": explorer_url
    })

    total_pipeline_time_ms = round((time.perf_counter() - execution_start) * 1000, 2)
    log("SYSTEM", f"Pipeline execution completed successfully in {total_pipeline_time_ms}ms.", "DONE")

    return {
        "success": True,
        "pipeline_completed": True,
        "total_time_ms": total_pipeline_time_ms,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "stages": {
            "input_image": {
                "filename": filename,
                "file_size_kb": file_size_kb,
                "data_uri": data_uri,
                "sha256": verify_result["input_image_hash"]
            },
            "face_detection": face_result,
            "reverse_search": search_result,
            "verification": verify_result,
            "blockchain": blockchain_result
        },
        "audit_record": audit_record,
        "logs": logs
    }


# Create sample test images folder
samples_dir = Path(__file__).parent / "samples"
samples_dir.mkdir(exist_ok=True, parents=True)
