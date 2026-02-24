# BlinkLean AWS Migration & Deployment Guide

This folder contains the necessary orchestration files to transition BlinkLean from local environments into a highly available **AWS ECS (Elastic Container Service) Fargate** stack.

## Architecture Highlights
- **Serverless Compute**: We utilize **AWS Fargate** inside the `ecs-task-definition.json` so you do not have to manage EC2 instances or SSH keys. It scales on demand.
- **Microservices Routing**: Traffic enters via an **Application Load Balancer (ALB)**, directing frontend operations to the NestJS Backend (`port 3000`) and the AI logic executing directly on the Python FastAPI container (`port 8000`).
- **Secret Integration**: The `.json` securely maps sensitive environment variables (`DATABASE_URL`, `JWT_SECRET`) directly using **AWS Systems Manager (SSM)** Parameter Store so passwords are never hardcoded in your image.

## Steps to Deploy

### 1. Prerequisites
Ensure you have the following installed on your machine:
- AWS CLI configured with valid credentials (`aws configure`)
- Docker Desktop (Running)

### 2. Push Images to AWS ECR
You must build and push your local codebase to AWS Elastic Container Registry so Fargate can fetch the images.

Run the provided PowerShell automation script:
```powershell
.\aws\build-and-push.ps1 -Region "ap-south-1" -AccountId "123456789012"
```

### 3. Register the Task Definition
Once your images are safely stored in ECR, register the Task Definition with ECS utilizing the blueprint generated for you:
```powershell
aws ecs register-task-definition --cli-input-json file://aws/ecs-task-definition.json
```

### 4. Update the ECS Service
Finally, trigger a rolling deployment on your ECS Service to swap out the old containers for the new ones with zero downtime:
```powershell
aws ecs update-service --cluster blinklean-production-cluster --service blinklean-backend-service --task-definition blinklean-production-cluster
```

## Production Docker Compose Backup
If you want to simulate this production isolated environment locally on your own machine without sending it to AWS yet, utilize the generated strictly isolated production compose file:

```powershell
docker compose -f docker-compose.prod.yml up -d --build
```
