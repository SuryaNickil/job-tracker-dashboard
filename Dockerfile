FROM python:3.11-slim

WORKDIR /app

# Copy requirements from backend directory
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app code
COPY backend/app ./app

# Run the application
CMD python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
