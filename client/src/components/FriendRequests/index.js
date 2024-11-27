
/*
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


import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FriendRequest() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null); // State for errors
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]); // List of current friends
  const [pendingRequests, setPendingRequests] = useState([]); // List of pending friend requests

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Assume token is stored in localStorage

      if (!token) {
        setError('Authentication token is missing.');
        return;
      }

      try {
        // Fetch all users
        const response = await axios.get('http://localhost:4000/users', {
          headers: {
            Authorization: token, // Send token in the Authorization header
          },
        });

        setUsers(response.data);

        // Fetch friends
        const friendsResponse = await axios.get(`http://localhost:4000/friends/${userId}`, {
       
        });

        // Fetch pending friend requests
        const requestsResponse = await axios.get(`http://localhost:4000/pending-requests/${userId}`, {
      
        });

       // Update state with all users
        setFriends(friendsResponse.data); // Update state with current friends
        setPendingRequests(requestsResponse.data); // Update state with pending requests
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Invalid or expired token.');
        } else {
         
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const isFriendOrRequested = (userIdToCheck) => {
    return (
      friends.some((friend) => friend.id === userIdToCheck) || // Check if already friends
      pendingRequests.some((request) => request.senderId === userIdToCheck) // Check if request is pending
    );
  };


  console.log(pendingRequests)

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
            {!isFriendOrRequested(user.id) ? (
              <button onClick={() => sendFriendRequest(user.id)}>Send Request</button>
            ) : (
              <span style={{ color: 'gray' }}>Request Sent or Already Friends</span>
            )}
          </li>
        ))}
      </ul>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FriendRequest;
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FriendRequest() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null); // State for errors
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]); // List of current friends
  const [pendingRequests, setPendingRequests] = useState([]); // List of pending friend requests

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Assume token is stored in localStorage

      if (!token) {
        setError('Authentication token is missing.');
        return;
      }

      try {
        // Fetch all users
        const response = await axios.get('http://localhost:4000/users', {
          headers: {
            Authorization: token, // Send token in the Authorization header
          },
        });

        setUsers(response.data);

        // Fetch friends
        const friendsResponse = await axios.get(`http://localhost:4000/friends/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        // Fetch pending friend requests
        const requestsResponse = await axios.get(`http://localhost:4000/pending-requests/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        // Update state
        setFriends(friendsResponse.data);
        setPendingRequests(requestsResponse.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access. Invalid or expired token.');
        } else {
          setError('An error occurred while fetching data.');
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const isFriendOrRequested = (userIdToCheck) => {
    return (
      friends.some((friend) => friend.id === userIdToCheck) || // Check if already friends
      pendingRequests.some((request) => request.receiverId === userIdToCheck) // Check if request is pending
    );
  };

  const sendFriendRequest = async (receiverId) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/send-request',
        { senderId: userId, receiverId },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );

      alert(response.data.message);

      // Update the pendingRequests state to reflect the new request
      setPendingRequests((prev) => [
        ...prev,
        { senderId: userId, receiverId, status: 'pending' },
      ]);
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message); // Show the error message from the backend
      } else {
        alert('An error occurred while sending the friend request.');
      }
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
            {!isFriendOrRequested(user.id) ? (
              <button onClick={() => sendFriendRequest(user.id)}>Send Request</button>
            ) : (
              <span style={{ color: 'gray' }}>
                {friends.some((friend) => friend.id === user.id)
                  ? 'Already Friends'
                  : 'Request Sent'}
              </span>
            )}
          </li>
        ))}
      </ul>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FriendRequest;
