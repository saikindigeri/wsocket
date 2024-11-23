import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FriendRequest() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null); // State for errors
  const [filteredUsers, setFilteredUsers] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token'); // Assume token is stored in localStorage

      if (!token) {
        setError('Authentication token is missing.');
      
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/users', {
          headers: {
            Authorization: token, // Send token in the Authorization header
          },
        });

        setUsers(response.data); // Update state with users
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Invalid or expired token.');
        } else {
          setError('Failed to fetch users.');
        }
      } 
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const sendFriendRequest = async (receiverId) => {
    try {
      await axios.post('http://localhost:4000/send-request', {
        senderId: userId,
        receiverId,
      });
      alert('Friend request sent!');
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  return (
    <div>
      <h3>Find Users</h3>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            {user.username}{' '}
            <button onClick={() => sendFriendRequest(user.id)}>Send Request</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendRequest;
