# BattleGames Backend

A robust, scalable backend API for a multiplayer battle game platform built with Node.js, TypeScript, Express, and Socket.IO. This project provides comprehensive authentication, real-time game management, and secure session handling.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Multi-factor Authentication (2FA)** with TOTP support
- **Social Login** integration (Google OAuth)
- **JWT-based session management** with refresh tokens
- **Email verification** and password reset functionality
- **Role-based access control** (Admin/User)
- **Account status management** (Active/Inactive/Blocked)

### 🎮 Game Management
- **Real-time game rooms** with Socket.IO
- **Codenames-style game logic** with team-based gameplay
- **Game state management** with Redis caching
- **Room creation, joining, and management**
- **Game history tracking**

### 🛠 Technical Features
- **TypeScript** for type safety and better development experience
- **MongoDB** with Mongoose for data persistence
- **Redis** for session management and caching
- **Socket.IO** for real-time communication
- **Zod** for runtime type validation
- **Express.js** with middleware architecture
- **Docker** support for easy deployment
- **Rate limiting** and security middleware
- **Comprehensive error handling**

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis
- Docker & Docker Compose (optional)

## 🛠 Installation

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd llm-games
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Application
   APP_NAME=BattleGames Backend
   PORT=9000
   NODE_ENV=development
   API_KEY=your-api-key
   BACKEND_BASE_URL=http://localhost:9000
   SOCKET_API_KEY=your-socket-api-key

   # Database
   MONGO_URI=mongodb://localhost:27017/battlegames
   BCRYPT_SALT_ROUNDS=12

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your-redis-password

   # JWT
   JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
   JWT_ACCESS_TOKEN_EXPIRE_IN=15m
   JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
   JWT_REFRESH_TOKEN_EXPIRE_IN=7d

   # Email (Resend)
   RESEND_API_KEY=your-resend-api-key

   # Frontend URLs
   FRONTEND_RESET_PAGE_URL=http://localhost:3000/reset-password
   FRONTEND_VERIFY_PAGE_URL=http://localhost:3000/verify-email

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Option 2: Docker Deployment

1. **Clone and setup environment**
   ```bash
   git clone <repository-url>
   cd llm-games
   # Create .env file as shown above
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 📁 Project Structure

```
src/
├── App/
│   ├── main/                 # Game room management
│   │   ├── controller/       # Room controllers
│   │   ├── model/           # Game state models
│   │   ├── redisServices/   # Redis operations
│   │   ├── routes/          # Room routes
│   │   ├── services/        # Business logic
│   │   ├── sockerService/   # Socket.IO services
│   │   ├── types/           # TypeScript types
│   │   └── validations/     # Input validation
│   └── sso/                 # Authentication system
│       ├── Account/         # Account management
│       ├── Auth/            # Authentication logic
│       ├── Mail/            # Email services
│       └── Redis/           # Session management
├── Config/                  # Configuration files
├── Middlewares/             # Express middlewares
├── Routes/                  # Route configuration
├── Utils/                   # Utility functions
├── app.ts                   # Express app setup
├── index.ts                 # Server entry point
└── socketServer.ts          # Socket.IO server
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `docker-compose up -d` - Start all services with Docker

## 🔌 API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forget-password` - Password reset request
- `POST /auth/reset-password` - Password reset
- `POST /auth/resend-otp` - Resend verification OTP
- `POST /auth/validate-session` - Validate 2FA session
- `POST /auth/generate-2fa-session` - Generate 2FA session
- `POST /auth/enable-2fa` - Enable 2FA
- `POST /auth/disable-2fa` - Disable 2FA
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### Account Routes (`/accounts`)
- `GET /accounts` - Get all accounts (Admin)
- `GET /accounts/user/:id` - Get specific account
- `PUT /accounts/user/:id` - Update account information
- `DELETE /accounts/user/:id` - Delete account

### Game Room Routes (`/rooms`)
- `GET /rooms` - Get all active rooms
- `GET /rooms/:id` - Get specific room
- `POST /rooms/create` - Create new room
- `PATCH /rooms/:id` - Update room
- `DELETE /rooms/:id` - Delete room
- `GET /rooms/history` - Get game history

## 🔌 Socket.IO Events

### Client to Server
- `joinInRoom` - Join a game room
- `PING` - Health check

### Server to Client
- `joinRoomResponse` - Room join confirmation
- `gameStateUpdated` - Game state updates
- `updateRoomList` - Room list updates
- `PONG` - Health check response

## 🔒 Security Features

- **Rate limiting** on API endpoints
- **CORS** configuration for cross-origin requests
- **Input validation** with Zod schemas
- **Password hashing** with bcrypt
- **JWT token** authentication
- **2FA** with TOTP
- **Session management** with Redis
- **API key** authentication for Socket.IO

## 🗄 Database Schema

### User Model
- Basic info (name, email, password)
- Account status and verification flags
- 2FA settings and secrets
- Social login information
- Role-based permissions

### Game State Model
- Room validation keys
- Participant information
- Game cards and state
- Chat history
- Game winner tracking

## 🚀 Deployment

### Production Environment Variables
Ensure all environment variables are properly set for production:
- Use strong, unique secrets for JWT tokens
- Configure proper Redis and MongoDB connection strings
- Set up SSL certificates
- Configure proper CORS origins

### Docker Production
```bash
# Build and start production services
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation for detailed endpoint information

## 🔄 Version History

- **v1.0.0** - Initial release with authentication and game management
- Features: User registration, 2FA, real-time game rooms, Socket.IO integration

---

**Built with ❤️ using Node.js, TypeScript, Express, and Socket.IO**