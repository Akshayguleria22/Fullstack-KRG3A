# Mental Health Support Platform

This repo contains a Vite + React frontend (under `mental-health/`) and a Spring Boot backend (under `backend/`).

## Frontend
- React Router based SPA with pages: Login, Dashboard, Mood Tracker, Exercises, Chat
- JWT-based authentication stored in localStorage
- Charts via Recharts
- WebSocket chat at `/ws/chat`

## Backend
- Spring Boot 3, MongoDB, Security (JWT), WebSocket
- Endpoints under `/api/**`

## Run locally
1. Start MongoDB on localhost:27017
2. Backend (Java 17+ and Maven):
   - `mvn spring-boot:run` in `backend/`
3. Frontend:
   - `npm install` in `mental-health/`
   - `npm run dev`

The frontend dev server proxies `/api` and `/ws` to the backend.
