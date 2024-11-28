
/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendSystem = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');
  const [friendError, setFriendError] = useState('');

  const userId=localStorage.getItem('userId')

  console.log(userId)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/friend-requests/${userId}`);
        setFriendRequests(response.data);
      } catch (err) {
        setError('Error fetching friend requests.');
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/friends/${userId}`);
        setFriends(response.data);
      } catch (err) {
        setFriendError('Error fetching friends.');
      }
    };

    fetchRequests();
    fetchFriends();
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      await axios.post('http://localhost:4000/accept-request', { requestId });
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
      alert('Friend request accepted');
    } catch (err) {
      alert('Error accepting friend request.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post('http://localhost:4000/decline-request', { requestId });
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
      alert('Friend request declined');
    } catch (err) {
      alert('Error declining friend request.');
    }
  };

  return (
    <div>
      <h1>Friend Management</h1>
      <div>
        <h2>Friend Requests</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {friendRequests.length === 0 ? (
          <p>No pending friend requests.</p>
        ) : (
          <ul>
            {friendRequests.map((request) => (
              <li key={request.id}>
                <span>{request.username}</span>
                <button
                  onClick={() => handleAccept(request.id)}
                  style={{
                    backgroundColor: 'green',
                    color: 'white',
                    marginLeft: '10px',
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(request.id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    marginLeft: '10px',
                  }}
                >
                  Decline
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2>Friends</h2>
        {friendError && <p style={{ color: 'red' }}>{friendError}</p>}
        {friends.length === 0 ? (
          <p>You have no friends yet.</p>
        ) : (
          <ul>
            {friends.map((friend) => (
              <li key={friend.id}>{friend.username}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendSystem;
*/


import React, { useState, useEffect } from 'react';
import ChatPage from '../Chat/ChatPage';
import axios  from 'axios';


const FriendSystem = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');
  const [friendError, setFriendError] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null); // Track selected friend for chat

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/friend-requests/${userId}`);
        setFriendRequests(response.data);
        console.log(setFriendRequests)
      } catch (err) {
        setError('Error fetching friend requests.');
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/friends/${userId}`);
        setFriends(response.data);
      } catch (err) {
        setFriendError('Error fetching friends.');
      }
    };

    fetchRequests();
    fetchFriends();
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      await axios.post('http://localhost:4000/accept-request', { requestId });
      setFriendRequests((prev) => prev.filter((request) => request.id !== requestId));
      alert('Friend request accepted');
    } catch (err) {
      alert('Error accepting friend request.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post('http://localhost:4000/decline-request', { requestId });
      setFriendRequests((prev) => prev.filter((request) => request.id !== requestId));
      alert('Friend request declined');
    } catch (err) {
      alert('Error declining friend request.');
    }
  };

  const openChat = (friend) => {
    setSelectedFriend(friend); // Set the selected friend for chat
  };

  const closeChat = () => {
    setSelectedFriend(null); // Close the chat box
  };

  console.log(selectedFriend)
  return (
    <div>
      {!selectedFriend ? (
        <>
          <h1>Friend Management</h1>
          <div>
            <h2>Friend Requests</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {friendRequests.length === 0 ? (
              <p>No pending friend requests.</p>
            ) : (
              <ul>
                {friendRequests.map((request) => (
                  <li key={request.id}>
                    <span>{request.username}</span>
                    <button
                      onClick={() => handleAccept(request.id)}
                      style={{
                        backgroundColor: 'green',
                        color: 'white',
                        marginLeft: '10px',
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(request.id)}
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        marginLeft: '10px',
                      }}
                    >
                      Decline
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2>Friends</h2>
            {friendError && <p style={{ color: 'red' }}>{friendError}</p>}
            {friends.length === 0 ? (
              <p>You have no friends yet.</p>
            ) : (
              <ul>
                {friends.map((friend) => (
                  <li key={friend.id} style={{ cursor: 'pointer', color: 'blue' }} onClick={() => openChat(friend)}>
                    {friend.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div>
          <button onClick={closeChat} style={{ marginBottom: '10px' }}>
            Back to Friend List
          </button>
          <ChatPage selectedFriend={selectedFriend} />
        </div>
      )}
    </div>
  );
};

export default FriendSystem;


