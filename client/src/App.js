import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import ChatPage from './components/Chat/ChatPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ChatPage />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
