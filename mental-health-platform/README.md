# 🧠 Mental Health Support Platform

A comprehensive full-stack web application designed to support mental wellness through mood tracking, mindfulness exercises, and real-time counselor chat support.

![Mental Health Platform](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Docker Implementation](#docker-implementation)
- [API Endpoints](#api-endpoints)
- [Workflow](#workflow)
- [Security](#security)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

The Mental Health Support Platform is a modern web application that empowers users to take control of their mental wellness journey. It provides tools for mood tracking, mindfulness exercises, journaling, and real-time support from counselors—all in a beautiful, intuitive interface.

### Why This Platform?

- **Track Mental Wellness**: Monitor mood patterns over time with visual analytics
- **Guided Exercises**: Access breathing exercises, meditation, and mindfulness techniques
- **Real-time Support**: Connect with counselors through secure WebSocket chat
- **Data-Driven Insights**: View trends, streaks, and progress visualizations
- **Privacy-First**: Secure JWT authentication with encrypted data storage

---

## ✨ Features

### 🎨 User Interface
- **Beautiful UI/UX**: Modern gradient designs with dark/light mode support
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile
- **Animated Components**: Smooth animations using Framer Motion
- **Professional Logo**: Custom-designed brain logo with gradient effects
- **Custom Fonts**: Google Fonts (Poppins) for enhanced typography

### 📊 Mood Tracking
- Interactive mood selector with emoji feedback (5 levels: Very Bad to Very Good)
- Daily mood logging with notes and journal entries
- Visual analytics with line charts and doughnut charts
- Mood distribution analysis showing percentage across mood types
- Historical mood entries with delete functionality
- 7-day streak counter with fire animation
- Average mood calculation over time periods

### 💪 Wellness Features
- **Physical Exercises**: Breathing exercises, body scans, progressive muscle relaxation
- **Mental Exercises**: Visualization, meditation, mindfulness practices
- **Progress Tracking**: Monitor completed exercises and stats
- **Wellness Dashboard**: Comprehensive view of overall progress combining mood and exercise data
- **Exercise Timer**: Track exercise duration and completion
- **Exercise Ratings**: Rate and provide feedback on completed exercises

### 💬 Chat Support
- Real-time WebSocket communication using STOMP protocol
- Connect with counselors instantly
- Message history and session management
- Typing indicators and message timestamps
- Secure, encrypted conversations
- Multiple concurrent chat sessions support

### 👤 User Management
- JWT-based authentication (24-hour token expiration)
- Secure registration and login
- User profiles with customizable preferences
- Anonymous mode option for privacy
- Role-based access control (USER, COUNSELOR, ADMIN)
- BCrypt password hashing

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI Framework |
| **Vite** | 5.0.8 | Build Tool & Dev Server |
| **Material-UI (MUI)** | 5.14.19 | Component Library |
| **Framer Motion** | 10.16.16 | Animation Library |
| **Chart.js** | 4.4.0 | Data Visualization |
| **React Router** | 6.20.1 | Client-side Routing |
| **Axios** | 1.6.2 | HTTP Client |
| **STOMP.js** | 7.0.0 | WebSocket Protocol |
| **SockJS** | 1.6.1 | WebSocket Fallback |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Spring Boot** | 3.2.0 | Application Framework |
| **Java** | 17 | Programming Language |
| **Spring Security** | 3.2.0 | Authentication & Authorization |
| **Spring WebSocket** | 3.2.0 | Real-time Communication |
| **MongoDB** | 6.0 | NoSQL Database |
| **JWT (JJWT)** | 0.12.3 | Token-based Auth |
| **Lombok** | Latest | Reduce Boilerplate Code |
| **Maven** | 3.8+ | Build Tool |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container Orchestration |
| **Nginx** | Frontend Web Server |
| **MongoDB Docker** | Database Container |
| **Git** | Version Control |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Frontend (Vite + Material-UI)          │   │
│  │  • Dashboard  • Mood Tracker  • Exercises  • Chat    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS (REST)
                            │ WebSocket (STOMP)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Spring Boot Backend (Java 17)              │   │
│  │  • REST Controllers  • WebSocket Handlers            │   │
│  │  • JWT Security      • Business Logic                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Driver
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB (NoSQL Database)                │   │
│  │  • Users  • Moods  • Exercises  • Chat Sessions      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Flow

```
Frontend (React)
├── Pages
│   ├── LoginPage.jsx (Auth UI)
│   ├── Dashboard.jsx (Analytics & Overview)
│   ├── MoodTracker.jsx (Mood Logging)
│   ├── Exercises.jsx (Wellness Activities)
│   ├── WellnessProgress.jsx (Progress Overview)
│   └── Chat.jsx (Real-time Messaging)
├── Components
│   ├── Logo.jsx (Brand Identity)
│   ├── Layout.jsx (App Shell)
│   └── Charts (Visualizations)
├── Context
│   ├── AuthContext.jsx (Auth State)
│   └── ThemeContext.jsx (Theme State)
└── Services
    └── api.js (API Client)

Backend (Spring Boot)
├── Controller Layer
│   ├── AuthController (Login/Register)
│   ├── MoodController (Mood CRUD)
│   ├── ExerciseController (Exercise CRUD)
│   └── ChatController (WebSocket)
├── Service Layer
│   ├── AuthService (Business Logic)
│   ├── MoodService (Mood Analytics)
│   ├── ExerciseService (Exercise Stats)
│   └── ChatService (Message Handling)
├── Repository Layer
│   ├── UserRepository (MongoDB)
│   ├── MoodRepository (MongoDB)
│   ├── ExerciseRepository (MongoDB)
│   └── ChatRepository (MongoDB)
├── Security
│   ├── JwtTokenProvider (Token Generation)
│   ├── JwtAuthenticationFilter (Token Validation)
│   ├── CustomUserDetailsService (User Loading)
│   └── SecurityConfig (Security Rules)
└── Model Layer
    ├── User (Entity)
    ├── MoodEntry (Entity)
    ├── Exercise (Entity)
    └── ChatMessage (Entity)
```

---

## 📁 Project Structure

```
mental-health-platform/
│
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mentalhealth/
│   │   │   │   ├── config/           # Configuration Classes
│   │   │   │   │   ├── DataInitializer.java
│   │   │   │   │   ├── WebConfig.java
│   │   │   │   │   └── WebSocketConfig.java
│   │   │   │   ├── controller/       # REST Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── MoodController.java
│   │   │   │   │   ├── ExerciseController.java
│   │   │   │   │   └── ChatController.java
│   │   │   │   ├── model/            # Entity Models
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── MoodEntry.java
│   │   │   │   │   ├── Exercise.java
│   │   │   │   │   └── ChatSession.java
│   │   │   │   ├── repository/       # MongoDB Repositories
│   │   │   │   ├── security/         # Security Components
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   │   └── service/          # Business Logic
│   │   │   └── resources/
│   │   │       └── application.yml   # Application Config
│   │   └── test/                     # Unit Tests
│   ├── Dockerfile                    # Backend Docker Image
│   ├── pom.xml                       # Maven Dependencies
│   └── mvnw.cmd                      # Maven Wrapper
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/               # Reusable Components
│   │   │   └── Logo.jsx
│   │   ├── context/                  # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/                    # Page Components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MoodTracker.jsx
│   │   │   ├── Exercises.jsx
│   │   │   ├── WellnessProgress.jsx
│   │   │   └── Chat.jsx
│   │   ├── services/                 # API Services
│   │   │   └── api.js
│   │   ├── App.jsx                   # Main App Component
│   │   ├── main.jsx                  # Entry Point
│   │   └── index.css                 # Global Styles
│   ├── Dockerfile                    # Frontend Docker Image
│   ├── nginx.conf                    # Nginx Configuration
│   ├── package.json                  # NPM Dependencies
│   └── vite.config.js                # Vite Configuration
│
├── docker-compose.yml                # Docker Orchestration
└── README.md                         # This File
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** - [Download](https://adoptium.net/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB 6+** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Maven 3.8+** - Included via Maven Wrapper
- **Docker & Docker Compose** (Optional) - [Download](https://www.docker.com/get-started)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Akshayguleria22/Fullstack-KRG3A.git
cd Fullstack-KRG3A/mental-health-platform
```

#### 2. Backend Setup

```bash
cd backend

# Create .env file (or configure application.yml)
# Add your MongoDB URI and JWT secret

# Using Maven Wrapper (Recommended)
./mvnw clean install
./mvnw spring-boot:run

# OR using installed Maven
mvn clean install
mvn spring-boot:run
```

**Backend Configuration** (`backend/src/main/resources/application.yml`):
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/mentalhealth
      # Or MongoDB Atlas:
      # uri: mongodb+srv://username:password@cluster.mongodb.net/mentalhealth

server:
  port: 8081

jwt:
  secret: YourSuperSecretKeyForJWTTokenGeneration256Bits
  expiration: 86400000  # 24 hours

app:
  cors:
    allowed-origins: http://localhost:5174
```

Backend runs on: **http://localhost:8081**

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend Configuration** (`.env`):
```env
VITE_API_URL=http://localhost:8081
```

Frontend runs on: **http://localhost:5174**

#### 4. Access the Application

Open your browser and navigate to: **http://localhost:5174**

**Default Credentials:**
- **Admin**: username: `admin` / password: `admin123`
- **Counselor**: username: `counselor` / password: `counselor123`
- **Or register a new account**

---

## 🐳 Docker Implementation

### Docker Architecture

The application uses a **multi-container Docker setup** with three main services:

1. **MongoDB Container**: NoSQL database for data persistence
2. **Backend Container**: Spring Boot application (Java 17)
3. **Frontend Container**: React app served via Nginx

### Docker Files Explained

#### 1. Backend Dockerfile (Multi-stage Build)

```dockerfile
# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Benefits:**
- **Smaller image size**: Uses JRE instead of JDK in final image (~150MB vs ~300MB)
- **Faster builds**: Maven dependencies are cached between builds
- **Security**: Minimal attack surface with Alpine Linux base
- **Production-ready**: Only runtime dependencies included

#### 2. Frontend Dockerfile (Multi-stage Build)

```dockerfile
# Stage 1: Build React app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- **Production-ready**: Optimized build served by Nginx
- **Fast**: Static files served efficiently with gzip compression
- **Secure**: Nginx handles HTTPS, security headers, rate limiting
- **Small footprint**: Final image is only ~25MB

#### 3. Docker Compose Configuration

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: mental-health-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: mentalhealth
    volumes:
      - mongodb_data:/data/db      # Persistent storage
    networks:
      - mental-health-network

  backend:
    build: ./backend
    container_name: mental-health-backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongodb:27017/mentalhealth
      JWT_SECRET: YourSuperSecretKey
    depends_on:
      - mongodb                     # Wait for MongoDB
    networks:
      - mental-health-network

  frontend:
    build: ./frontend
    container_name: mental-health-frontend
    restart: always
    ports:
      - "5173:5173"
    depends_on:
      - backend                     # Wait for Backend
    networks:
      - mental-health-network

volumes:
  mongodb_data:                     # Named volume for data persistence

networks:
  mental-health-network:            # Custom bridge network
    driver: bridge
```

### Running with Docker

#### Quick Start (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Check specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

#### Individual Container Management

```bash
# Build specific service
docker-compose build backend
docker-compose build frontend

# Start specific service
docker-compose up backend
docker-compose up frontend

# Restart a service
docker-compose restart backend

# View running containers
docker ps

# Execute commands in container
docker exec -it mental-health-backend bash
docker exec -it mental-health-mongodb mongosh

# View container resource usage
docker stats
```

### Docker Network Benefits

- **Service Discovery**: Containers communicate using service names (e.g., `mongodb:27017`)
- **Isolation**: Separate network for application security
- **Persistence**: MongoDB data persists across container restarts
- **Portability**: Run anywhere Docker is installed (dev, staging, production)
- **Scalability**: Easy to scale services with `docker-compose up --scale`

### Docker Best Practices Used

1. **Multi-stage builds**: Reduce final image size
2. **Layer caching**: Speed up builds by ordering commands efficiently
3. **Named volumes**: Persist data between container lifecycles
4. **Health checks**: Monitor container health (can be added)
5. **Environment variables**: Configure containers without rebuilding
6. **Alpine images**: Minimal base images for security and size
7. **Non-root user**: Run containers as non-root (production recommendation)

### Production Deployment

For production, consider adding:

```yaml
# docker-compose.prod.yml
services:
  backend:
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    environment:
      - NODE_ENV=production
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
```

Additional production considerations:
- SSL/TLS certificates for HTTPS
- Reverse proxy (Traefik/Nginx) for load balancing
- Container orchestration (Kubernetes/Docker Swarm)
- Monitoring and logging (Prometheus, Grafana, ELK stack)
- Backup strategies for MongoDB data
- Secrets management (Docker secrets, HashiCorp Vault)

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Example Request:**
```bash
# Register
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "john",
    "password": "password123"
  }'
```

### Mood Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/mood` | Create mood entry | Yes |
| GET | `/api/mood` | Get user's mood entries | Yes |
| GET | `/api/mood/range` | Get entries by date range | Yes |
| GET | `/api/mood/analytics` | Get mood analytics (avg, trend) | Yes |
| DELETE | `/api/mood/{id}` | Delete mood entry | Yes |

**Example Request:**
```bash
# Create mood entry
curl -X POST http://localhost:8081/api/mood \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-10",
    "moodScore": 4,
    "moodLabel": "Good",
    "notes": "Had a productive day!",
    "journalEntry": "Completed all my tasks and felt accomplished."
  }'

# Get analytics
curl -X GET http://localhost:8081/api/mood/analytics?days=30 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Exercise Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/exercises` | Get all exercises | Yes |
| GET | `/api/exercises/{id}` | Get exercise by ID | Yes |
| GET | `/api/exercises/type/{type}` | Get by type (BREATHING, MEDITATION) | Yes |
| POST | `/api/exercises/{id}/start` | Start exercise | Yes |
| POST | `/api/exercises/progress/{id}/complete` | Complete exercise | Yes |
| GET | `/api/exercises/progress` | Get user progress | Yes |
| GET | `/api/exercises/stats` | Get user stats | Yes |

### Chat Endpoints (WebSocket)

| Endpoint | Description | Protocol |
|----------|-------------|----------|
| `/ws` | WebSocket connection | STOMP over WebSocket |
| `/app/chat.send` | Send message | STOMP |
| `/topic/messages` | Subscribe to messages | STOMP |
| `/api/chat/session` | Create chat session | HTTP |
| `/api/chat/sessions` | Get user sessions | HTTP |

---

## 🔄 Workflow

### 1. User Registration & Authentication Flow

```
User → Frontend (Register Form)
  ↓
  POST /api/auth/register
  {username, email, password, fullName}
  ↓
Backend → Validate Input
  ↓
Backend → Hash Password (BCrypt)
  ↓
Backend → Save to MongoDB
  ↓
Backend → Generate JWT Token
  ↓
Backend → Return {token, user}
  ↓
Frontend → Store token in localStorage
  ↓
Frontend → Redirect to Dashboard
```

### 2. Mood Tracking Workflow

```
User → Select Mood (1-5 scale)
  ↓
User → Add Notes & Journal Entry
  ↓
Frontend → POST /api/mood (JWT in header)
  ↓
Backend → Validate JWT
  ↓
Backend → Extract User ID from Token
  ↓
Backend → Save Mood Entry to MongoDB
  ↓
Backend → Return Saved Entry
  ↓
Frontend → Update UI with New Entry
  ↓
Frontend → GET /api/mood/analytics
  ↓
Backend → Calculate Average, Trend, Distribution
  ↓
Backend → Return Analytics Data
  ↓
Frontend → Update Charts (Line + Doughnut)
```

### 3. Real-time Chat Workflow

```
User → Open Chat Page
  ↓
Frontend → Connect to WebSocket (/ws)
  ↓
Backend → Establish WebSocket Connection
  ↓
Frontend → Subscribe to /topic/messages
  ↓
User → Type Message
  ↓
Frontend → Send to /app/chat.send
  ↓
Backend → Receive Message via STOMP
  ↓
Backend → Save to MongoDB
  ↓
Backend → Broadcast to /topic/messages
  ↓
All Connected Clients → Receive Message
  ↓
Frontend → Display Message in Chat UI
```

### 4. Exercise Completion Workflow

```
User → Browse Exercises
  ↓
User → Select Exercise (e.g., Deep Breathing)
  ↓
Frontend → POST /api/exercises/{id}/start
  ↓
Backend → Create ExerciseProgress Record
  ↓
Backend → Set startTime
  ↓
Frontend → Show Exercise Instructions + Timer
  ↓
User → Complete Exercise
  ↓
Frontend → POST /api/exercises/progress/{id}/complete
  ↓
Backend → Update ExerciseProgress (endTime, completed=true)
  ↓
Backend → Calculate Exercise Stats
  ↓
Backend → Return Updated Stats
  ↓
Frontend → Refresh Dashboard
  ↓
Frontend → Show Updated Exercise Count & Streak
```

---

## 🔐 Security

### Implemented Security Measures

1. **JWT Authentication**
   - 24-hour token expiration
   - HS256 algorithm with 256-bit secret key
   - Token validation on every API request

2. **Password Encryption**
   - BCrypt hashing with salt (10 rounds)
   - Passwords never stored in plain text

3. **CORS Configuration**
   - Restricted origins: `http://localhost:5174`
   - Configured allowed methods and headers

4. **Role-Based Access Control**
   - Three roles: USER, COUNSELOR, ADMIN
   - Endpoint-level authorization checks

5. **Input Validation**
   - Backend validation for all inputs
   - Null checks and data sanitization

6. **HTTPS Ready**
   - Nginx configuration supports SSL/TLS
   - Easy to add Let's Encrypt certificates

7. **XSS Protection**
   - React automatically escapes user input
   - Prevents cross-site scripting attacks

8. **CSRF Protection**
   - Disabled for stateless JWT auth
   - No session cookies used

### Security Best Practices

```java
// JWT Token Generation
String token = Jwts.builder()
    .setSubject(userId)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
    .signWith(SignatureAlgorithm.HS256, secretKey)
    .compact();

// Password Encoding
String hashedPassword = passwordEncoder.encode(rawPassword);

// Role-Based Access
@PreAuthorize("hasRole('ADMIN')")
public void adminOnlyMethod() { }
```

---

## 📊 Database Schema

### Collections

1. **users**
```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (BCrypt hashed),
  fullName: String,
  roles: [String],           // USER, COUNSELOR, ADMIN
  isAnonymous: Boolean,
  active: Boolean,
  preferences: {},
  createdAt: Date,
  updatedAt: Date
}
```

2. **mood_entries**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  date: Date (indexed),
  moodScore: Number (1-5),
  moodLabel: String,         // Very Bad, Bad, Okay, Good, Very Good
  notes: String,
  journalEntry: String,
  createdAt: Date
}
```

3. **exercises**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  type: String,              // BREATHING, MEDITATION, VISUALIZATION
  duration: Number,          // minutes
  difficulty: String,        // BEGINNER, INTERMEDIATE, ADVANCED
  instructions: [String],
  benefits: [String]
}
```

4. **exercise_progress**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  exerciseId: ObjectId (indexed),
  startTime: Date,
  endTime: Date,
  completed: Boolean,
  rating: Number (1-5),
  feedback: String
}
```

---

## 🚀 Future Enhancements

### Planned Features

- [ ] **Mobile App**: React Native for iOS and Android
- [ ] **AI-Powered Insights**: Mood predictions and personalized recommendations
- [ ] **Video Counseling**: WebRTC-based video sessions
- [ ] **Group Therapy**: Multi-user chat rooms with moderation
- [ ] **Push Notifications**: Reminders for mood tracking and exercises
- [ ] **Social Features**: Support groups and community forums
- [ ] **Gamification**: Achievements, badges, and leaderboards
- [ ] **Wearables Integration**: Sync with Fitbit, Apple Watch, etc.
- [ ] **Multi-language Support**: i18n for global reach
- [ ] **Advanced Analytics**: ML-based trend analysis
- [ ] **Export Data**: Download mood history as PDF/CSV
- [ ] **Offline Mode**: Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow existing code style
- Write unit tests for new features
- Update documentation as needed
- Use meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Akshay Guleria**
- GitHub: [@Akshayguleria22](https://github.com/Akshayguleria22)
- Project: [Fullstack-KRG3A](https://github.com/Akshayguleria22/Fullstack-KRG3A)

---

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **Framer Motion** for smooth animations
- **Spring Boot** for the robust backend framework
- **MongoDB** for flexible data storage
- **Chart.js** for data visualizations
- **Docker** for simplifying deployment
- The **open-source community** for inspiration and tools

---

## 📞 Support

For support, open an issue in the GitHub repository or contact via the repository discussions.

---

<div align="center">

**Made with ❤️ for Mental Health Awareness**

⭐ **Star this repo if you find it helpful!**

</div>
