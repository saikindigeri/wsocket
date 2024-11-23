import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import ChatPage from './components/Chat/ChatPage';
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
          <Route path="/friends" element={<FriendSystem/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
