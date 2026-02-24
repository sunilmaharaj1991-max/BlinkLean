# BlinkLean Crash-Proof Deployment & Cloud Architecture 🚀

This document outlines the production-ready, crash-resistant, and high-availability deployment strategy for BlinkLean utilizing **AWS** (Amazon Web Services). The architecture ensures zero-downtime operations, dynamic scalability handling heavy traffic loads flawlessly, while strictly segregating microservices gracefully.

---

## 🏗️ Architecture Overview

The system runs on independent decoupled microservices preventing single points of failure.

1. **Load Balancer**: AWS Application Load Balancer (ALB) acting as the single secure entry point.
2. **NestJS API Backend**: Deployed via container clusters (Amazon ECS or EKS). Handles authentication, payments, bookings, and zone verification routing.
3. **Python FastAPI (AI Service)**: Deployed dynamically handling high-compute zone boundary checks via Shapely math.
4. **PostgreSQL DB**: Managed Amazon RDS cluster ensuring multi-AZ high availability deployments.
5. **Redis Cache Layer**: Amazon ElastiCache providing fast read operations serving OTP verifications natively, and availability caching immediately minimizing DB IO operations.
6. **Storage**: Amazon S3 for system backups, file uploads, and log archiving.

---

## 📦 Containerization & Images

Both **BlinkLean Backend** (NestJS) and **BlinkLean AI** (FastAPI) applications have localized `Dockerfile` deployments. 

### Process:
1. CI/CD pipelines automatically build images via `docker build` sequentially running testing pipelines natively.
2. Images are successfully packaged as immutable artifacts mapping instantly to Amazon Elastic Container Registry (ECR).
3. ECR images serve directly into ECS Task definitions safely controlling deployment rollout logic safely.

---

## 🚦 Traffic Flow & Elastic Scaling

1. **Ingress**: SSL-encrypted user requests traverse Cloudflare (or AWS Shield) immediately blocking malicious actors or DDoS events before hitting ALB natively.
2. **Reverse Proxy & Routing**: The Application Load Balancer safely distributes connection loads over healthy running ECS instances using pre-defined healthchecks mapping strictly at `/health` returning HTTP 200 checks strictly.
3. **Scaling Strategy (Auto-Scaling)**:
    - **Trigger**: ECS Service Auto Scaling fires whenever average Node CPU limits breach `70%`, or Request Count boundaries scale quickly.
    - **Action**: AWS native configurations directly spin up horizontal nodes in sub-minute speeds mapping them instantly back onto ALB securely stabilizing high traffic load.

---

## 🔐 Security & Reliability Setup

- **HTTPS Mandatory**: Utilizing AWS Certificate Manager (ACM), wildcard certificates encrypt all communication natively ensuring PCI compliance dynamically against Razorpay requirements strictly.
- **Private Subnets**: `Amazon RDS`, `ElastiCache`, and internally running `AI Microservices` operate natively in isolated private VPC subnets with absolutely ZERO inbound public IPs maintaining critical data isolation implicitly.
- **Environment Parity**: AWS Systems Manager Parameter Store handles all sensitive environmental variable definitions, injected directly securely into runtimes inside `.aws` encrypted scopes avoiding disk leakage instantly.
- **Firewalls / WAF**: AWS Web Application Firewall handles deep packet inspections securely detecting patterns immediately filtering out unverified bad actors smoothly.

---

## 📊 Monitoring & Alerts (AWS CloudWatch)

We've configured strict observabilities tracking every node event directly capturing:
- **Error Rates**: Real-time triggering natively inside CloudWatch alarms querying 5XX Status codes spiking.
- **Database Strain**: Real-time Amazon RDS Query duration plotting automatically escalating on slow operations allowing DB tuning iteratively.
- **Payment Integrity**: Strict logging traces covering Razorpay handshakes successfully validating signature verification endpoints directly reporting unexpected tampering failures explicitly towards Admin channels (Slack / Email) immediately!

---

## 💾 Backups & Disaster Recovery

- **Automated Point-in-Time**: RDS cluster maintains strictly active snapshot histories ensuring precise granular restore states falling within minutes natively guaranteeing high operational up-time safely.
- **Fallback Clustering**: Database logic strictly provisions robust Master / Follower models seamlessly automatically swapping primary nodes whenever heartbeat failures are registered via Multi-AZ.

---

## 🚄 Quick Start Local Deployment (Docker Compose)

You can launch this entire architecture locally to simulate production environments using our comprehensive `docker-compose.yml` configuration:

```bash
docker-compose up --build -d
```
*Validates NestJS, AI Daemon, Postgres, and Redis inter-container connectivity perfectly matching production mappings.*

---
This deployment structure dynamically prepares BlinkLean for city-wide expansions gracefully supporting millions of end-users effectively.
