"""
End-to-End API Integration Test using FastAPI TestClient
"""
import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add backend to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from main import app
from test_face_engine import create_synthetic_face_image


def test_api_health():
    client = TestClient(app)
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "blockchain_network" in data


def test_api_verify_pipeline():
    client = TestClient(app)
    test_image_bytes = create_synthetic_face_image()
    
    files = {
        "file": ("test_face.jpg", test_image_bytes, "image/jpeg")
    }
    
    response = client.post("/api/verify", files=files)
    assert response.status_code == 200
    data = response.json()
    
    assert data["success"] is True
    assert data["pipeline_completed"] is True
    assert "stages" in data
    assert "input_image" in data["stages"]
    assert "face_detection" in data["stages"]
    assert "reverse_search" in data["stages"]
    assert "verification" in data["stages"]
    assert "blockchain" in data["stages"]
    
    # Verify Blockchain transaction output
    bc = data["stages"]["blockchain"]
    assert bc["transaction_hash"].startswith("0x")
    assert bc["status"] == "CONFIRMED" or bc["status"] == "SUCCESS"
    assert bc["explorer_url"].startswith("http")
    
    # Verify Audit Record
    audit = data["audit_record"]
    assert audit["record_id"].startswith("0x")
    assert audit["input_image_hash"].startswith("0x")
    
    # Verify Logs
    assert len(data["logs"]) > 0
