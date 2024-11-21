import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './ChatPage.css';

const socket = io('http://localhost:4000');

function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');


  const toke=localStorage.getItem('token')
  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', { token: toke, text: message });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user === username ? 'my-message' : 'other-message'}>
            <strong>{msg.user}</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default ChatPage;
