import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment'
import './ChatPage.css';

const socket = io('http://localhost:4000'); // Connect to the backend server

function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
  const token = localStorage.getItem('token'); // Fetch the token for authentication

  // Fetch old messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:4000/messages'); // Fetch old messages from the backend
        setMessages(response.data); // Set the fetched messages in the state
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    // Real-time socket message handling
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]); // Update the state with the new message
    });

    return () => {
      socket.off('chat message'); // Clean up socket listener when the component unmounts
    };
  }, []);

  // Handle sending new messages
  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', { token, text: message }); // Emit message to the backend
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user === username ? 'my-message' : 'other-message'}>
            <strong>{msg.username}</strong>: {msg.message}
            <small>{moment(msg.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update the message state
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default ChatPage;
