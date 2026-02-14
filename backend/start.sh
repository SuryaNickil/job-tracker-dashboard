#!/bin/bash
set -e

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI server..."
python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
