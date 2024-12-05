
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';
// import './ChatPage.css';

const socket = io('https://wsocket-5.onrender.com');

function ChatPage({ selectedFriend }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token'); // Authentication token
  const userId = localStorage.getItem('userId'); // Logged-in user's ID
  const username = localStorage.getItem('username'); // Logged-in user's username

  useEffect(() => {
    // Join user's room on component load


    // Fetch chat history when selectedFriend changes
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://wsocket-5.onrender.com/messages/${selectedFriend.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data); // Populate chat history
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
      if (
        (msg.senderId == userId && msg.receiverId == selectedFriend.id) ||
        (msg.senderId == selectedFriend.id && msg.receiverId ==userId)
      ) {
        setMessages((prev) => [...prev, msg]); // Append new messages to the state
      }
    });

    // Cleanup socket listener on component unmount
    return () => {
      socket.off('chat message');
    };
  }, [selectedFriend, userId, token,messages]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (message.trim()) {
      const msg = {
        senderId: userId,
        receiverId: selectedFriend.id,
        text: message,
      };

      // Emit message through socket
      socket.emit('chat message', msg);

      // Update local state for immediate feedback
      setMessages((prev) => [
        ...prev,
        { ...msg, timestamp: new Date().toISOString() },
      ]);
      setMessage(''); // Clear input field
    }
  };
console.log(messages,userId)
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl rounded-lg overflow-hidden">
  <div className="bg-blue-600 p-4 shadow-md">
        <h2 className="text-2xl font-bold text-white text-center">
          Chat with {selectedFriend.username}
        </h2>
      </div>


  <div className=" flex-1 overflow-y-auto p-4 space-y-4 ">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`flex ${msg.sender_id == userId ? 'justify-end self-start rounded-bl-none' : 'justify-start'}`}
      >
        <div
        className={`max-w-[70%] break-words rounded-2xl px-4 py-3 shadow-md ${
          msg.sender_id == userId
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-900 rounded-bl-none'
        }`}

        >
          
         
          <p className="text-sm mb-1">{msg.text}</p>
          <p className={`text-xs ${
                msg.sender_id == userId ? 'text-white' : 'text-gray-500'
              }`}>
                {moment(msg.created_at).format('DD/MM/YYYY h:mm A')}
              </p>

        </div>
      </div>
    ))}
  </div>

  <div className="p-4 bg-white border-t border-gray-200">
  <div className="flex space-x-2">

    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <button
      onClick={handleSendMessage}
      className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
    >
      Send
    </button>
  </div>
</div>
</div>

  );
}

export default ChatPage;
