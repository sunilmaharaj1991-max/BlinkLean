# ⚡ BlinKlean: The Future of Urban Hygiene & Recycling

[![Render Deployment](https://img.shields.io/badge/Deployment-Render-blueviolet?style=for-the-badge)](https://render.com)
[![Tech Stack](https://img.shields.io/badge/Stack-NestJS%20|%20FastAPI%20|%20Docker-blue?style=for-the-badge)](https://github.com)

BlinKlean is a smart, eco-friendly ecosystem designed to revolutionize home services and waste management. We combine professional cleaning, laundry, and vehicle care with a high-tech AI-powered Scrap & Recycling marketplace.

---

## 🌟 Core Value Proposition

- **Professional Convenience**: Premium cleaning services at your doorstep.
- **Sustainability First**: Monetize your household waste while ensuring responsible recycling.
- **AI Intelligence**: Real-time serviceability checks using geometric boundary logic and live market scrap pricing.
- **Unified Experience**: A seamless transition between a fast web catalog and a deep-service mobile app.

---

## 🛠️ Tech Stack & Architecture

BlinKlean is built using a modern, decoupled microservices architecture for high availability and performance.

### **1. Frontend (The Storefront)**
*   **Technology**: Vanilla HTML5, CSS3 (Modern Flex/Grid), and JavaScript.
*   **Design**: Premium "Catalogue Mode" aesthetic with rich micro-animations and responsive layouts.
*   **Features**: Pincode checker, service navigation, and Snabbit-inspired marketing sections.

### **2. API Backend (`/blinklean-backend`)**
*   **Framework**: [NestJS](https://nestjs.com/) (TypeScript).
*   **Database**: PostgreSQL (Production) / SQLite (Development) with TypeORM.
*   **Caching**: Managed Redis for high-speed OTP and availability lookups.
*   **Security**: JWT Authentication, Helmet, and throttled request limits.

### **3. AI Microservice (`/blinklean-ai`)**
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python).
*   **Intelligence**: 
    *   **Availability Engine**: Geometric checking via `Shapely` to strictly verify service zones.
    *   **Pricing Engine**: Real-time scrap value prediction based on daily market market rates.
    *   **Smart Assistant**: NLP-based FAQ and customer support routing.

---

## 🚀 Deployment (Production)

BlinKlean is cloud-native and ready for zero-downtime deployment via **Render** using GitHub-integrated Blueprints.

### **Infrastructure Components:**
- **Web Services**: NestJS API and Python AI Daemon (Dockerized).
- **Persistence**: Managed PostgreSQL Database.
- **Cache**: Fast Managed Redis Instance.

**Quick Deploy**:
The repository includes a `render.yaml` blueprint. Simply link your repo to Render and it will auto-provision all services, networking, and databases.

---

## 💻 Local Development Setup

### **Prerequisites**
- Docker & Docker Compose
- Node.js (v20+)
- Python (3.11+)

### **One-Command Startup (Recommended)**
Launch the entire ecosystem including databases and caches:
```bash
docker-compose up --build
```

### **Manual Backend Setup**
```bash
cd blinklean-backend
npm install
npm run start:dev
```

### **Manual AI Service Setup**
```bash
cd blinklean-ai
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🗺️ Service Coverage
We currently serve major zones in **Bengaluru**, including:
- **West**: Vijayanagar, Chandra Layout, Attiguppe.
- **North**: Rajajinagar.
- **Expansion**: Whitefield, Indiranagar, Koramangala (Launching Soon).

---

## 📄 License & Ownership
Copyright © 2026 BlinKlean. All rights reserved. Built as a high-tech solution for the modern urban household.

*Clean in a Blink. Save the Planet.*
