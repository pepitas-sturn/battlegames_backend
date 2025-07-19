# BattleGames Backend API Documentation

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Authentication Endpoints](#authentication-endpoints)
- [Account Management Endpoints](#account-management-endpoints)
- [Game Room Endpoints](#game-room-endpoints)
- [Socket.IO Events](#socketio-events)
- [Data Models](#data-models)

## 🌐 Base URL

```
Development: http://localhost:9000
Production: https://api.shiftlayer.ai
```

## 🔐 Authentication

### JWT Token Authentication
Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Session-based Authentication
For 2FA and session management, cookies are used:
- `auth-session-id`: Main authentication session
- `2fa-session-id`: Two-factor authentication session

### API Key Authentication (Socket.IO)
Socket.IO connections require an API key in the handshake:

```javascript
const socket = io('http://localhost:9000', {
  auth: {
    apiKey: 'your-socket-api-key'
  }
});
```

## ⚠️ Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errorMessages": [
    {
      "path": "field_name",
      "message": "Field validation error"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔐 Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification instructions.",
  "data": {
    "sessionId": "email-verification-session-id"
  }
}
```

**Notes:**
- Email verification OTP will be sent to the provided email
- Password must be at least 6 characters
- Role defaults to "user" if not specified

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and create session

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (2FA Disabled):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "sessionId": "auth-session-id",
    "is2FaEnabled": false
  }
}
```

**Response (2FA Enabled):**
```json
{
  "success": true,
  "message": "2FA enabled. Enter a code from your authenticator app to login.",
  "data": {
    "sessionId": "2fa-session-id",
    "is2FaEnabled": true
  }
}
```

---

### 3. Validate Session (2FA/Email Verification)

**Endpoint:** `POST /auth/validate-session`

**Description:** Validate OTP for 2FA or email verification

**Request Body:**
```json
{
  "otp": "123456",
  "sessionType": "LOGIN_2FA"
}
```

**Session Types:**
- `LOGIN_2FA` - Two-factor authentication
- `ACCOUNT_VERIFICATION` - Email verification
- `EMAIL_VERIFICATION` - Email verification
- `FORGET_PASSWORD` - Password reset

**Response:**
```json
{
  "success": true,
  "message": "Session validated successfully",
  "data": {
    "validated": true,
    "sessionId": "new-auth-session-id",
    "nextAction": "login"
  }
}
```

---

### 4. Generate 2FA Session

**Endpoint:** `POST /auth/generate-2fa-session`

**Description:** Generate a new 2FA session for enabling/disabling 2FA

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "_id": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA session generated successfully",
  "data": {
    "sessionId": "2fa-session-id",
    "qrCode": "data:image/png;base64,...",
    "secret": "JBSWY3DPEHPK3PXP"
  }
}
```

---

### 5. Enable 2FA

**Endpoint:** `POST /auth/enable-2fa`

**Description:** Enable two-factor authentication for user account

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "otp": "123456",
  "sessionId": "2fa-session-id",
  "_id": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA enabled successfully"
}
```

---

### 6. Disable 2FA

**Endpoint:** `POST /auth/disable-2fa`

**Description:** Disable two-factor authentication for user account

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "otp": "123456",
  "_id": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

---

### 7. Forget Password

**Endpoint:** `POST /auth/forget-password`

**Description:** Request password reset via email

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

---

### 8. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Description:** Reset password using session token

**Request Body:**
```json
{
  "sessionId": "reset-session-id",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 9. Resend OTP

**Endpoint:** `POST /auth/resend-otp`

**Description:** Resend verification OTP

**Request Body:**
```json
{
  "email": "john@example.com",
  "sessionType": "ACCOUNT_VERIFICATION"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

---

### 10. Google OAuth Login

**Endpoint:** `GET /auth/google`

**Description:** Initiate Google OAuth login flow

**Response:** Redirects to Google OAuth consent screen

---

### 11. Google OAuth Callback

**Endpoint:** `GET /auth/google/callback`

**Description:** Handle Google OAuth callback

**Response:** Redirects to frontend with session data

---

### 12. Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user and invalidate session

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 👤 Account Management Endpoints

### 1. Get All Accounts (Admin)

**Endpoint:** `GET /accounts`

**Description:** Retrieve all user accounts (Admin only)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Accounts retrieved successfully",
  "data": [
    {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true,
      "accountStatus": "ACTIVE",
      "is2FaEnabled": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Specific Account

**Endpoint:** `GET /accounts/user/:id`

**Description:** Retrieve specific user account

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Account retrieved successfully",
  "data": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": true,
    "accountStatus": "ACTIVE",
    "is2FaEnabled": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Update Account Information

**Endpoint:** `PUT /accounts/user/:id`

**Description:** Update user account information

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account updated successfully"
}
```

---

### 4. Delete Account

**Endpoint:** `DELETE /accounts/user/:id`

**Description:** Delete user account

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🎮 Game Room Endpoints

### 1. Get All Rooms

**Endpoint:** `GET /rooms`

**Description:** Retrieve all active game rooms

**Response:**
```json
{
  "success": true,
  "message": "All rooms fetched successfully",
  "data": [
    {
      "_id": "room-id",
      "validatorKey": "unique-room-key",
      "cards": [...],
      "chatHistory": [...],
      "currentTeam": "red",
      "currentRole": "spymaster",
      "remainingRed": 8,
      "remainingBlue": 8,
      "participants": [...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Room

**Endpoint:** `GET /rooms/:id`

**Description:** Retrieve specific game room

**Response:**
```json
{
  "success": true,
  "message": "Room fetched successfully",
  "data": {
    "_id": "room-id",
    "validatorKey": "unique-room-key",
    "cards": [...],
    "chatHistory": [...],
    "currentTeam": "red",
    "currentRole": "spymaster",
    "remainingRed": 8,
    "remainingBlue": 8,
    "participants": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Create Room

**Endpoint:** `POST /rooms/create`

**Description:** Create a new game room

**Request Body:**
```json
{
  "validatorKey": "unique-room-key",
  "cards": [
    {
      "word": "example",
      "color": "red",
      "isRevealed": false,
      "wasRecentlyRevealed": false
    }
  ],
  "chatHistory": [],
  "currentTeam": "red",
  "currentRole": "spymaster",
  "previousTeam": null,
  "previousRole": null,
  "remainingRed": 8,
  "remainingBlue": 8,
  "currentClue": null,
  "currentGuesses": null,
  "gameWinner": null,
  "participants": [
    {
      "name": "Player 1",
      "hotKey": "A",
      "team": "red"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Created successfully",
  "data": {
    "id": "room-id",
    "validatorKey": "unique-room-key",
    "cards": [...],
    "participants": [...]
  }
}
```

---

### 4. Update Room

**Endpoint:** `PATCH /rooms/:id`

**Description:** Update game room state

**Request Body:** Same as create room with updated values

**Response:**
```json
{
  "success": true,
  "message": "Room updated successfully"
}
```

---

### 5. Delete Room

**Endpoint:** `DELETE /rooms/:id`

**Description:** Delete game room

**Response:**
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

---

### 6. Get Game History

**Endpoint:** `GET /rooms/history`

**Description:** Retrieve game history with pagination and filtering

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc/desc, default: desc)
- `search` - Search term
- `filter` - Filter criteria

**Response:**
```json
{
  "success": true,
  "message": "History fetched successfully",
  "data": {
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPage": 10
    },
    "data": [
      {
        "_id": "room-id",
        "validatorKey": "unique-room-key",
        "gameWinner": "red",
        "participants": [...],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 🔌 Socket.IO Events

### Client to Server Events

#### 1. Join Room
```javascript
socket.emit('joinInRoom', 'room-id');
```

#### 2. Health Check
```javascript
socket.emit('PING');
```

### Server to Client Events

#### 1. Join Room Response
```javascript
socket.on('joinRoomResponse', (data) => {
  console.log(data);
  // { _id: 'room-id', message: 'Successfully joined in room' }
});
```

#### 2. Game State Update
```javascript
socket.on('gameStateUpdated', (data) => {
  console.log(data);
  // { gameState: {...} }
});
```

#### 3. Room List Update
```javascript
socket.on('updateRoomList', (rooms) => {
  console.log(rooms);
  // Array of room objects
});
```

#### 4. Health Check Response
```javascript
socket.on('PONG', (message) => {
  console.log(message);
  // 'Server is alive'
});
```

---

## 📊 Data Models

### User Model
```typescript
interface IAuth {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  is2FaEnabled: boolean;
  twoFactorSecret?: string;
  phone?: string;
  userId?: string;
  statusNote?: string;
  isSocialLogin?: boolean;
  socialLoginProvider?: 'GOOGLE' | 'FACEBOOK' | 'APPLE' | 'EMAIL';
  profilePicture?: string;
  socialLoginId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Game State Model
```typescript
interface TGameState {
  _id: string;
  validatorKey: string;
  cards: ICardType[];
  chatHistory: IChatMessage[];
  currentTeam: 'red' | 'blue';
  currentRole: 'spymaster' | 'operative';
  previousTeam: 'red' | 'blue' | null;
  previousRole: 'spymaster' | 'operative' | null;
  remainingRed: number;
  remainingBlue: number;
  currentClue: IClue | null;
  currentGuesses: string[] | null;
  gameWinner: 'red' | 'blue' | null;
  participants: TParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

interface ICardType {
  word: string;
  color: 'red' | 'blue' | 'bystander' | 'assassin' | null;
  isRevealed: boolean;
  wasRecentlyRevealed: boolean;
}

interface IChatMessage {
  sender: 'spymaster' | 'operative';
  message: string;
  team: 'red' | 'blue';
}

interface IClue {
  clueText: string;
  number: number;
}

interface TParticipant {
  name: string;
  hotKey: string;
  team: 'red' | 'blue';
}
```

---

## 🔒 Rate Limiting

API endpoints are protected with rate limiting:
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- Socket.IO connections: 10 connections per minute

---

## 📝 Notes

1. **Session Management**: Sessions are stored in Redis with configurable TTL
2. **2FA**: Uses TOTP (Time-based One-Time Password) with QR code generation
3. **Email Verification**: OTP-based email verification with Resend service
4. **Game Rooms**: Rooms are cached in Redis with 5-minute TTL
5. **Real-time Updates**: Socket.IO provides real-time game state updates
6. **CORS**: Configured for specific origins in production

---

**For additional support or questions, please refer to the main README or contact the development team.** 