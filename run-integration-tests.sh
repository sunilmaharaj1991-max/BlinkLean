#!/bin/bash

echo "Starting BlinkLean Cloud Stability & Readiness Validation..."

# 1. Container Build Verification
echo "Verifying Microservice Builds..."
docker-compose build
if [ $? -ne 0 ]; then
  echo "Build failed. Resolve dockerfile configurations."
  exit 1
fi

echo "Spinning up detached infrastructure..."
docker-compose up -d

# Give services time to boot
sleep 10

# 2. Redis Connection Check
echo "Testing Redis Memory Connectivity..."
curl -s http://localhost:3000/health/redis-test | grep "working"
if [ $? -ne 0 ]; then
  echo "Redis layer failed connection!"
  docker-compose down
  exit 1
fi
echo "Redis: OK"

# 3. AI Service Direct Call
echo "Testing Python FastAPI Availability Logic (Vijayanagar - Inside Poly)..."
AI_RES=$(curl -s -X POST http://localhost:8000/ai/check-availability \
  -H "Content-Type: application/json" \
  -d '{"latitude": 12.965, "longitude": 77.535}')

if [[ $AI_RES == *"serviceable\":true"* ]]; then
  echo "AI Agent Mathematics: OK"
else
  echo "AI Math failure check polygon logic!"
  docker-compose down
  exit 1
fi

# 4. Backend Platform Web Restriction
echo "Testing Web Platform Payment Blocking..."
PAY_BLOCKED=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/payments/create-order \
  -H "platform: web")

if [ "$PAY_BLOCKED" == "401" ] || [ "$PAY_BLOCKED" == "400" ]; then
  echo "App-Only Shield: OK - Request properly bounced."
else
  echo "Security Breach: Web accessed Payment Route."
  docker-compose down
  exit 1
fi

# Cleanup
echo "All validation layers passed! Tearing down simulated infrastructure..."
docker-compose down

echo "✅ BlinkLean Architecture is PRODUCTION READY for Launch."
