<#
.SYNOPSIS
Builds and pushes the Docker images for BlinkLean to AWS Elastic Container Registry (ECR).

.DESCRIPTION
This script authenticates with AWS ECR, builds the Node.js backend and Python AI microservices, tags them aggressively for production load balancing, and pushes them straight into your AWS ECR namespace.

.PARAMETER Region
The AWS region to deploy into (e.g., ap-south-1).

.PARAMETER AccountId
Your 12-digit AWS Account ID.
#>

param (
    [string]$Region = "ap-south-1",
    [string]$AccountId = "123456789012"
)

$EcrUrl = "$AccountId.dkr.ecr.$Region.amazonaws.com"

Write-Host "Logging into AWS ECR at: $EcrUrl" -ForegroundColor Cyan
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $EcrUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host "ECR login failed. Ensure your AWS CLI is configured via 'aws configure'." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Building Backend Container..." -ForegroundColor Yellow
docker build -t blinklean/backend:latest ../blinklean-backend

Write-Host "Tagging Backend Image..." -ForegroundColor Cyan
docker tag blinklean/backend:latest "$EcrUrl/blinklean/backend:latest"

Write-Host "Pushing Backend Image to ECR..." -ForegroundColor Green
docker push "$EcrUrl/blinklean/backend:latest"


Write-Host "Building AI Service Container..." -ForegroundColor Yellow
docker build -t blinklean/ai-service:latest ../blinklean-ai

Write-Host "Tagging AI Service Image..." -ForegroundColor Cyan
docker tag blinklean/ai-service:latest "$EcrUrl/blinklean/ai-service:latest"

Write-Host "Pushing AI Service Image to ECR..." -ForegroundColor Green
docker push "$EcrUrl/blinklean/ai-service:latest"

Write-Host "✅ Docker deployment completed successfully!" -ForegroundColor Green
Write-Host "👉 You can now register 'ecs-task-definition.json' and spin up the Fargate service!" -ForegroundColor Magenta
