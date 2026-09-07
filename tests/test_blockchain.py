"""
Unit Tests for Blockchain Engine and Verifier Audit Manifests
"""
import pytest
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from pipeline.blockchain_engine import BlockchainEngine
from pipeline.verifier import MatchVerifier
from pipeline.face_engine import FaceEngine


def test_blockchain_engine_record_commit():
    engine = BlockchainEngine()
    audit_record = {
        "record_id": "0x" + "a" * 64,
        "input_image_hash": "0x" + "1" * 64,
        "matched_image_hash": "0x" + "2" * 64,
        "source_url": "https://x.com/example/status/123456",
        "platform": "X (Twitter)",
        "similarity_score_basis_points": 9450,
        "status_code": 1,
        "pipeline_version": "v1.0.0-prod"
    }

    result = engine.commit_verification_record(audit_record)
    
    assert result is not None
    assert result["is_confirmed"] is True
    assert result["transaction_hash"].startswith("0x")
    assert result["network"] != ""
    assert result["block_number"] > 0
    assert "explorer_url" in result
    assert result["explorer_url"].startswith("http")


def test_audit_record_builder():
    face_engine = FaceEngine()
    verifier = MatchVerifier(face_engine)
    
    audit = verifier._build_audit_record(
        input_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        matched_hash="ca978112ca1bbdcdaf83792e4282367d383921319c5c249a5b3a388b1f54d682",
        source_url="https://linkedin.com/in/test",
        platform="LinkedIn",
        similarity_score=0.925,
        status="VERIFIED",
        status_code=1,
        timestamp="2026-09-07 14:00:00 UTC"
    )

    assert audit["record_id"].startswith("0x")
    assert audit["similarity_score_basis_points"] == 9250
    assert audit["status"] == "VERIFIED"
    assert audit["platform"] == "LinkedIn"
