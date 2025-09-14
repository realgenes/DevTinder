# DevTinder 💻❤️

A full-stack dating application for developers, built with Node.js, Express, MongoDB, and React. Connect with fellow developers, build meaningful connections, and find your coding partner!

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Create and edit your developer profile
- **Feed System**: Browse through other developers' profiles
- **Connection Requests**: Send interested/ignored requests to other users
- **Connections**: View your matched connections
- **Request Management**: Accept or reject incoming connection requests
- **Real-time Updates**: Dynamic UI with Redux state management
- **Responsive Design**: Built with Tailwind CSS and DaisyUI

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and development server
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **DaisyUI** - UI components

## 📁 Project Structure

```
DevTinder/
├── Backend/
│   ├── src/
│   │   ├── app.js              # Express application entry point
│   │   ├── config/
│   │   │   └── database.js     # MongoDB connection config
│   │   ├── middlewares/
│   │   │   └── auth.js         # Authentication middleware
│   │   ├── models/
│   │   │   ├── user.js         # User schema
│   │   │   └── connectionRequest.js  # Connection request schema
│   │   ├── routers/
│   │   │   ├── auth.js         # Authentication routes
│   │   │   ├── profile.js      # Profile management routes
│   │   │   ├── request.js      # Connection request routes
│   │   │   └── user.js         # User-related routes
│   │   └── utils/
│   │       └── validation.js   # Input validation utilities
│   ├── package.json
│   └── api_list.md            # API documentation
├── frontEnd/
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── components/        # React components
│   │   │   ├── Body.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Connections.jsx
│   │   │   ├── Request.jsx
│   │   │   ├── UserCard.jsx
│   │   │   └── navbar.jsx
│   │   └── utils/             # Redux store and slices
│   │       ├── appStore.js
│   │       ├── userSlice.js
│   │       ├── feedSlice.js
│   │       ├── connectionSlice.js
│   │       └── requestSlice.js
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/realgenes/DevTinder.git
   cd DevTinder
   ```

2. **Backend Setup**

   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontEnd
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the Backend directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/devtinder
   JWT_SECRET=your_jwt_secret_key
   PORT=7777
   ```

5. **Database Setup**
   - Make sure MongoDB is running on your system
   - The application will connect to MongoDB automatically

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend Server**

   ```bash
   cd Backend
   npm run dev
   ```

   Backend server will run on `http://localhost:7777`

2. **Start the Frontend Development Server**
   ```bash
   cd frontEnd
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Production Mode

1. **Backend**

   ```bash
   cd Backend
   npm start
   ```

2. **Frontend**
   ```bash
   cd frontEnd
   npm run build
   npm run preview
   ```

## 📚 API Documentation

### Authentication Routes

- `POST /signup` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout

### Profile Routes

- `GET /profile/view` - Get user profile
- `PATCH /profile/edit` - Update user profile
- `PATCH /profile/password` - Change password

### Connection Request Routes

- `POST /request/send/interested/:userID` - Send interested request
- `POST /request/send/ignored/:userID` - Send ignored request
- `POST /request/review/accepted/:requestID` - Accept connection request
- `POST /request/review/rejected/:requestID` - Reject connection request

### User Routes

- `GET /user/connections` - Get user connections
- `GET /user/request` - Get pending requests
- `GET /user/feed` - Get feed of potential matches

## 🎯 Key Features Breakdown

### User Authentication

- Secure JWT-based authentication
- Password hashing with bcrypt
- Cookie-based session management

### Profile System

- Comprehensive user profiles
- Profile picture upload
- Skills and bio sections
- Profile editing capabilities

### Matching Algorithm

- Browse through developer profiles
- Express interest or pass on profiles
- Mutual interest creates connections

### Connection Management

- View all your connections
- Manage incoming requests
- Real-time request notifications

## 🔧 Development

### Code Style

- ESLint configuration for consistent code style
- Proper component organization
- Redux for predictable state management

### Project Scripts

**Backend:**

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Frontend:**

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**realgenes**

- GitHub: [@realgenes](https://github.com/realgenes)

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js community
- MongoDB team
- All contributors and developers who made this project possible

---

**Happy Coding and Happy Matching! 💻❤️**
