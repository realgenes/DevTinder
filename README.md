# DevTinder 💻❤️

> A modern, full-stack dating application for developers. Connect with fellow coders, build meaningful connections, and find your perfect coding partner!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://devfronten.netlify.app)
[![Backend](https://img.shields.io/badge/backend-render-blue)](https://devtinder-backend-i79q.onrender.com)
[![License](https://img.shields.io/badge/license-ISC-green)](LICENSE)

---

## 🌟 Features

### 👤 User Management
- **Secure Authentication** - JWT-based signup/login with httpOnly cookies
- **Profile Creation** - Comprehensive developer profiles with photo, bio, skills, and more
- **Profile Editing** - Update your information anytime
- **Password Management** - Secure password hashing with bcrypt

### 🔍 Discovery & Matching
- **Smart Feed** - Browse through developer profiles tailored for you
- **Interest System** - Express interest or pass on profiles with a simple swipe-like interface
- **Connection Requests** - Send and receive connection requests
- **Request Management** - Accept or reject incoming requests

### 💬 Real-time Communication
- **Live Chat** - Real-time messaging with Socket.IO
- **Chat History** - Persistent message storage
- **Connection Profiles** - View detailed profiles of your connections

### 🎨 User Experience
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark/Light Mode** - Theme support with DaisyUI
- **Smooth Animations** - Powered by Framer Motion
- **Redux State Management** - Predictable and efficient state updates

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **Socket.IO** | Real-time bidirectional communication |
| **JWT** | Secure authentication tokens |
| **bcrypt** | Password hashing |
| **CORS** | Cross-origin resource sharing |
| **Cookie Parser** | Cookie handling middleware |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite** | Next-generation build tool |
| **Redux Toolkit** | State management |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client |
| **Socket.IO Client** | Real-time communication |
| **Tailwind CSS** | Utility-first CSS framework |
| **DaisyUI** | Tailwind CSS component library |
| **Framer Motion** | Animation library |

---

## 📁 Project Structure

```
DevTinder/
├── Backend/
│   ├── src/
│   │   ├── app.js                    # Express app setup & configuration
│   │   ├── socket.js                 # Socket.IO configuration
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── middlewares/
│   │   │   └── auth.js               # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── user.js               # User schema & methods
│   │   │   ├── connectionRequest.js  # Connection request schema
│   │   │   └── message.js            # Message schema for chat
│   │   ├── routers/
│   │   │   ├── auth.js               # Authentication routes
│   │   │   ├── profile.js            # Profile management routes
│   │   │   ├── request.js            # Connection request routes
│   │   │   ├── user.js               # User-related routes
│   │   │   └── chat.js               # Chat/messaging routes
│   │   └── utils/
│   │       └── validation.js         # Input validation utilities
│   ├── package.json
│   ├── api_list.md                   # API documentation
│   └── .env                          # Environment variables
│
├── frontEnd/
│   ├── src/
│   │   ├── App.jsx                   # Main application component
│   │   ├── main.jsx                  # Entry point
│   │   ├── components/
│   │   │   ├── Body.jsx              # Layout wrapper with routing
│   │   │   ├── Feed.jsx              # User feed/discovery
│   │   │   ├── Login.jsx             # Login & signup forms
│   │   │   ├── Profile.jsx           # User profile view
│   │   │   ├── EditProfile.jsx       # Profile editing
│   │   │   ├── Connections.jsx       # User connections list
│   │   │   ├── Request.jsx           # Connection requests
│   │   │   ├── Chat.jsx              # Real-time chat interface
│   │   │   ├── ConnectionProfile.jsx # Connection user profile
│   │   │   ├── UserCard.jsx          # User profile card component
│   │   │   ├── navbar.jsx            # Navigation bar
│   │   │   └── Footer.jsx            # Footer component
│   │   └── utils/
│   │       ├── appStore.js           # Redux store configuration
│   │       ├── userSlice.js          # User state management
│   │       ├── feedSlice.js          # Feed state management
│   │       ├── connectionSlice.js    # Connections state management
│   │       ├── requestSlice.js       # Requests state management
│   │       └── constants.js          # API URL constants
│   ├── public/
│   │   └── _redirects                # Netlify SPA routing
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   └── .env                          # Environment variables
│
├── DEPLOYMENT_GUIDE.md               # Deployment instructions
├── DEPLOYMENT_FIXES.md               # Deployment troubleshooting
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/realgenes/DevTinder.git
cd DevTinder
```

#### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/devtinder
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devtinder

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=7777
NODE_ENV=development
```

#### 3. Frontend Setup

```bash
cd ../frontEnd
npm install
```

Create a `.env` file in the frontEnd directory:

```env
VITE_API_URL=http://localhost:7777
```

---

## 🏃‍♂️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
Backend runs on `http://localhost:7777`

**Terminal 2 - Frontend:**
```bash
cd frontEnd
npm run dev
```
Frontend runs on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`

### Production Mode

**Backend:**
```bash
cd Backend
npm start
```

**Frontend:**
```bash
cd frontEnd
npm run build
npm run preview
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | User login | ❌ |
| POST | `/logout` | User logout | ✅ |

### Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile/view` | Get current user profile | ✅ |
| PATCH | `/profile/edit` | Update user profile | ✅ |
| PATCH | `/profile/password` | Change password | ✅ |

### Connection Request Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/request/send/interested/:userId` | Send interested request | ✅ |
| POST | `/request/send/ignored/:userId` | Ignore user | ✅ |
| POST | `/request/review/accepted/:requestId` | Accept connection request | ✅ |
| POST | `/request/review/rejected/:requestId` | Reject connection request | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/connections` | Get all connections | ✅ |
| GET | `/requests/received` | Get pending requests | ✅ |
| GET | `/feed` | Get user feed | ✅ |
| GET | `/user/:userId` | Get specific user profile | ✅ |

### Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/chat/messages/:userId` | Get chat history with user | ✅ |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Server | User connected to socket |
| `joinRoom` | Client → Server | Join user's personal room |
| `sendMessage` | Client → Server | Send a message |
| `receiveMessage` | Server → Client | Receive a message |
| `disconnect` | Server | User disconnected |

---

## 🎯 Core Features Explained

### 1. Authentication Flow
- User signs up with email, password, and basic info
- Password is hashed using bcrypt (10 salt rounds)
- JWT token is generated and stored in httpOnly cookie
- Token expires after 7 days
- Cookie settings support cross-origin (for deployment)

### 2. User Feed Algorithm
- Shows profiles user hasn't interacted with
- Excludes users already connected
- Excludes users with pending requests
- Shuffled for variety

### 3. Connection System
- **Interested**: User A sends interest to User B
- **Accepted**: User B accepts → Both become connections
- **Rejected**: User B rejects → Request removed
- **Ignored**: User A passes on User B

### 4. Real-time Chat
- Socket.IO for bidirectional communication
- Each user joins their personal room (user ID)
- Messages are stored in MongoDB
- Real-time delivery to online users
- Message history persists

---

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start production server
```

**Frontend:**
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

### Code Quality

- **ESLint** for code linting
- **Mongoose validation** for data integrity
- **JWT middleware** for route protection
- **Input validation** utilities
- **Error handling** across all routes

---

## 🌐 Deployment

### Live Application

- **Frontend**: [https://devfronten.netlify.app](https://devfronten.netlify.app)
- **Backend**: [https://devtinder-backend-i79q.onrender.com](https://devtinder-backend-i79q.onrender.com)

### Deployment Guides

Comprehensive deployment guides are available:
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions
- `DEPLOYMENT_FIXES.md` - Common issues and solutions

### Quick Deployment Checklist

**Backend (Render):**
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB URI
- [ ] Set JWT_SECRET
- [ ] Configure CORS origins
- [ ] Enable auto-deploy from GitHub

**Frontend (Netlify):**
- [ ] Set `VITE_API_URL` environment variable
- [ ] Add `_redirects` file for SPA routing
- [ ] Enable auto-deploy from GitHub
- [ ] Configure custom domain (optional)

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User signup and login
- [ ] Profile creation and editing
- [ ] Browsing feed
- [ ] Sending connection requests
- [ ] Accepting/rejecting requests
- [ ] Viewing connections
- [ ] Real-time chat functionality
- [ ] Logout and session management

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Ideas

- 🐛 Bug fixes
- ✨ New features (video chat, advanced matching, etc.)
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage

---

## 📝 License

This project is licensed under the ISC License.

---

## 👤 Author

**Realgenes**

- GitHub: [@realgenes](https://github.com/realgenes)
- Project Link: [DevTinder](https://github.com/realgenes/DevTinder)

---

## 🙏 Acknowledgments

- [React Team](https://react.dev) - For the amazing React library
- [Express.js](https://expressjs.com) - For the robust web framework
- [MongoDB](https://www.mongodb.com) - For the flexible database
- [Socket.IO](https://socket.io) - For real-time communication
- [Tailwind CSS](https://tailwindcss.com) & [DaisyUI](https://daisyui.com) - For beautiful styling
- [Vite](https://vitejs.dev) - For lightning-fast development
- All contributors and the open-source community

---

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Deployment Guide](DEPLOYMENT_GUIDE.md)
2. Review [Common Fixes](DEPLOYMENT_FIXES.md)
3. Open an [Issue](https://github.com/realgenes/DevTinder/issues)

---

<div align="center">

**Made with ❤️ by developers, for developers**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/realgenes/DevTinder/issues) · [Request Feature](https://github.com/realgenes/DevTinder/issues)

</div>
