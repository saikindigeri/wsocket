
/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';

import FriendRequests from './components/FriendRequests';
import FriendSystem from './components/FriendSystem';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        
          <Route path="/" element={<FriendRequests />} />
          <Route path="/friend-requests" element={<FriendSystem/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
*/

/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import ChatPage from './components/Chat/ChatPage';
import FriendRequests from './components/FriendRequests';
import FriendSystem from './components/FriendSystem';
import Header from './components/Header'; // Import Header component

function AppContent() {
  const location = useLocation();

  // Check if the current route is for login or register
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      {!isAuthRoute && <Header />} {/* Show Header unless on login/register }
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<FriendRequests />} />
        <Route path="/friends" element={<FriendSystem />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import ChatPage from './components/Chat/ChatPage';
import FriendRequests from './components/FriendRequests';
import FriendSystem from './components/FriendSystem';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function AppContent() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      {/* Conditionally render the header only for protected routes */}
      {!isAuthRoute && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <ProtectedRoute isLoginRoute={isLoginRoute}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isLoginRoute={false}>
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isLoginRoute={false}>
              <FriendRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute isLoginRoute={false}>
              <FriendSystem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute isLoginRoute={false}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
