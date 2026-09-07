"""
Unit Tests for Face Detection & Embedding Engine
"""
import pytest
import numpy as np
from PIL import Image, ImageDraw
import io
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from pipeline.face_engine import FaceEngine


def create_synthetic_face_image() -> bytes:
    """Create a simple synthetic image containing face-like features."""
    img = Image.new("RGB", (200, 200), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    # Face oval
    draw.ellipse([40, 40, 160, 170], fill=(220, 180, 150), outline=(150, 100, 80))
    # Eyes
    draw.ellipse([65, 80, 85, 95], fill=(255, 255, 255), outline=(0, 0, 0))
    draw.ellipse([72, 85, 78, 91], fill=(40, 40, 120))
    draw.ellipse([115, 80, 135, 95], fill=(255, 255, 255), outline=(0, 0, 0))
    draw.ellipse([122, 85, 128, 91], fill=(40, 40, 120))
    # Nose
    draw.line([(100, 95), (95, 120), (105, 120)], fill=(120, 80, 60), width=2)
    # Mouth
    draw.arc([75, 130, 125, 150], start=0, end=180, fill=(180, 50, 50), width=3)
    
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_face_engine_initialization():
    engine = FaceEngine()
    assert engine is not None
    assert engine.face_cascade is not None


def test_face_engine_processing():
    engine = FaceEngine()
    test_bytes = create_synthetic_face_image()
    res = engine.process_image(test_bytes)
    
    assert "face_detected" in res
    assert "processing_time_ms" in res
    assert res["processing_time_ms"] > 0
    assert "image_dimensions" in res
    assert res["image_dimensions"]["width"] == 200


def test_vector_similarity():
    engine = FaceEngine()
    vec1 = [0.1] * 128
    vec2 = [0.1] * 128
    sim = engine.compute_similarity(vec1, vec2)
    assert round(sim, 2) == 1.0

    vec_diff = [-0.1] * 128
    sim_diff = engine.compute_similarity(vec1, vec_diff)
    assert sim_diff < 0.5
