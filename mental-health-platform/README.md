# 🧠 Mental Health Support Platform# Mental Health Support Platform



A full-stack web application for mental health support with mood tracking, exercises, and real-time chat.A comprehensive mental health support platform with real-time counselor chat, mood tracking, guided exercises, and analytics.



## 🚀 Features---



- **User Authentication** - Secure JWT-based authentication## 🚀 **New User? START HERE**

- **Mood Tracking** - Track daily moods with analytics

- **Mental Health Exercises** - Guided breathing, meditation, and journaling👉 **[START_HERE.md](START_HERE.md)** - Complete beginner's guide  

- **Real-time Chat** - Connect with counselors via WebSocket👉 **[VISUAL_GUIDE.md](VISUAL_GUIDE.md)** - Visual diagrams & flowcharts  

- **Dark/Light Mode** - Toggle between themes👉 **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - All documentation

- **Responsive UI** - Works on all devices

---

## 🛠️ Tech Stack

## Features

### Backend

- Spring Boot 3.2.0- 🔐 Secure Authentication with JWT

- MongoDB (Atlas)- 💬 Real-time Chat with Counselors (WebSocket)

- Spring Security + JWT- 📊 Mood Tracking & Analytics

- WebSocket- 🧘 Guided Exercises (Meditation, Breathing, CBT)

- Java 17- 📱 Responsive Design

- 🔒 End-to-End Encryption

### Frontend- 👤 Anonymous Mode Support

- React 18

- Vite## Tech Stack

- Material-UI

- Framer Motion### Frontend

- Chart.js- React 18

- Vite

## 📋 Prerequisites- React Router

- Material-UI

- Java 17 or higher- Chart.js

- Node.js 18+ and npm- WebSocket Client

- MongoDB Atlas account (or local MongoDB)- Framer Motion (Animations)



## 🏃 Quick Start### Backend

- Spring Boot 3.x

### 1. Clone the Repository- Spring Security (JWT)

```bash- Spring WebSocket

git clone https://github.com/Akshayguleria22/Fullstack-KRG3A.git- MongoDB

cd mental-health-platform- BCrypt Encryption

```

### Database

### 2. Backend Setup- MongoDB

```bash

cd backend## 🚀 Quick Start



# Create .env file**First time?** → See **[QUICKSTART_BEGINNER.md](QUICKSTART_BEGINNER.md)** for step-by-step visual guide

echo "SPRING_DATA_MONGODB_URI=your_mongodb_uri" > .env

echo "JWT_SECRET=your_jwt_secret_key" >> .env### Prerequisites

echo "ENCRYPTION_KEY=your_encryption_key" >> .env

echo "SERVER_PORT=8081" >> .env**Choose ONE deployment method:**



# Run backend (Windows)| Method | Requirements | Difficulty |

mvnw.cmd spring-boot:run|--------|-------------|------------|

| Docker (Recommended) | Docker Desktop only | ⭐ Easiest |

# Run backend (Mac/Linux)| Manual Setup | Java 17, Node.js 18, MongoDB 6 | ⭐⭐ Moderate |

./mvnw spring-boot:run| Cloud MongoDB | Java 17, Node.js 18, Atlas account | ⭐⭐⭐ Advanced |

```

### Option 1: Running with Docker (Recommended)

Backend will run on: `http://localhost:8081`

**Easiest path - everything auto-configured:**

### 3. Frontend Setup

```bash```bash

cd frontenddocker-compose up

```

# Install dependencies

npm installAccess: http://localhost:5173 | Login: `admin` / `admin123`



# Create .env file### Option 2: Running Manually

echo "VITE_API_URL=http://localhost:8081" > .env

**Step 1: Setup MongoDB** (See [MONGODB_SETUP.md](MONGODB_SETUP.md))

# Run frontend

npm run dev```bash

```# Start MongoDB first

mongod --dbpath C:\data\db   # Windows

Frontend will run on: `http://localhost:5173` or `http://localhost:5174`mongod --dbpath /usr/local/var/mongodb   # Mac/Linux

```

## 🔑 Default Credentials

**Step 2: Start Backend**

**Admin:**

- Username: `admin`#### Backend

- Password: `admin123````bash

cd backend

**Counselor:**./mvnw spring-boot:run

- Username: `counselor````

- Password: `counselor123`

#### Frontend

## 📁 Project Structure```bash

cd frontend

```npm install

mental-health-platform/npm run dev

├── backend/                    # Spring Boot backend```

│   ├── src/

│   │   ├── main/## Architecture

│   │   │   ├── java/com/mentalhealth/

│   │   │   │   ├── controller/     # REST endpointsFor detailed system architecture, see **[ARCHITECTURE.md](ARCHITECTURE.md)**

│   │   │   │   ├── model/          # MongoDB entities

│   │   │   │   ├── repository/     # Data access- **Module 1**: Frontend (React SPA)

│   │   │   │   ├── security/       # JWT & Auth- **Module 2**: Backend (Spring Boot Microservices)

│   │   │   │   └── service/        # Business logic- **Module 3**: Real-Time Communication (WebSocket)

│   │   │   └── resources/- **Module 4**: Database (MongoDB)

│   │   │       └── application.yml # Configuration- **Module 5**: Security & Privacy

│   │   └── test/- **Module 6**: Deployment & CI/CD

│   └── pom.xml

│## 📚 Documentation

├── frontend/                   # React frontend

│   ├── src/| Guide | Description |

│   │   ├── components/         # Reusable components|-------|-------------|

│   │   ├── context/            # Auth & Theme context| **[QUICKSTART_BEGINNER.md](QUICKSTART_BEGINNER.md)** | 🚀 Step-by-step setup for beginners |

│   │   ├── pages/              # Page components| **[MONGODB_SETUP.md](MONGODB_SETUP.md)** | 🗄️ MongoDB installation & configuration |

│   │   ├── services/           # API calls| **[ARCHITECTURE.md](ARCHITECTURE.md)** | 🏗️ System architecture & data flows |

│   │   └── styles/             # CSS & themes| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | 🔧 Common issues & solutions |

│   └── package.json| **[DEPLOYMENT.md](DEPLOYMENT.md)** | 🌐 Production deployment guide |

│| **[HOW_TO_RUN.md](HOW_TO_RUN.md)** | 📖 Detailed running instructions |

└── README.md

```## Default Accounts



## 🌐 API EndpointsAfter first startup, these accounts are automatically created:



### Authentication| Username | Password | Role |

- `POST /api/auth/register` - Register new user|----------|----------|------|

- `POST /api/auth/login` - Login user| admin | admin123 | ADMIN |

| counselor | counselor123 | COUNSELOR |

### Mood Tracking

- `POST /api/mood` - Log mood entry**⚠️ IMPORTANT:** Change these passwords before deploying to production!

- `GET /api/mood` - Get user's mood entries

- `GET /api/mood/analytics` - Get mood analytics## 🆘 Having Issues?



### Exercises1. **Can't start MongoDB?** → See [MONGODB_SETUP.md](MONGODB_SETUP.md)

- `GET /api/exercises` - Get all exercises2. **Port conflicts?** → See [TROUBLESHOOTING.md](TROUBLESHOOTING.md#port-already-in-use)

- `POST /api/exercises/{id}/start` - Start exercise3. **Login not working?** → See [TROUBLESHOOTING.md](TROUBLESHOOTING.md#authentication-issues)

- `POST /api/exercises/progress/{id}/complete` - Complete exercise4. **Other errors?** → Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions



### Chat## Contributing

- `POST /api/chat/session` - Create chat session

- `GET /api/chat/sessions` - Get user's sessions1. Fork the repository

- WebSocket: `/ws` - Real-time messaging2. Create feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit changes (`git commit -m 'Add AmazingFeature'`)

## 🎨 Features in Detail4. Push to branch (`git push origin feature/AmazingFeature`)

5. Open Pull Request

### Mood Tracker

- Daily mood logging with 5 emotion levels## License

- Weekly/Monthly analytics with charts

- Mood patterns visualizationMIT


### Exercises
- **Breathing Exercises** - Guided breathing patterns
- **Meditation** - Timed meditation sessions  
- **Journaling** - Reflective writing prompts

### Chat System
- Real-time messaging with counselors
- Session history
- Encrypted messages

### Profile & Settings
- User statistics
- Achievement badges
- Theme toggle (Dark/Light)
- Account settings

## 🔒 Security

- JWT token-based authentication
- Password encryption with BCrypt
- CORS configuration
- MongoDB SSL connection
- Encrypted chat messages

## 🚀 Deployment

### Backend (Render/Railway)
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd backend && ./mvnw clean package`
4. Set start command: `cd backend && java -jar target/*.jar`
5. Add environment variables from `.env`

### Frontend (Render/Vercel)
1. Create new Static Site
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/dist`
4. Add `VITE_API_URL` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- Akshay Guleria - [@Akshayguleria22](https://github.com/Akshayguleria22)

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Material-UI Components
- MongoDB Atlas

---

**Built with ❤️ for Mental Health Awareness**
