import React, { useState, useEffect } from 'react';
import ChatPage from '../Chat/ChatPage';
import axios from 'axios';
// import './index.css';


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
        console.log(setFriendRequests);
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

  console.log(selectedFriend);

  return (
    <div>
     <h1 className='text-white text-center text-2xl'>Friends Management</h1>
      
      {!selectedFriend ? (
        <>
        
          <div  className="friend-system">
            <h2>Friend Requests</h2>
            {error && <p className="error">{error}</p>}
            {friendRequests.length === 0 ? (
              <p className="no-requests">No pending friend requests.</p>
            ) : (
              <ul>
                {friendRequests.map((request) => (
                  <li key={request.id}>
                    <span>{request.username}</span>
                    <button
                      onClick={() => handleAccept(request.request_id)}
                      className="request-button accept-button"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(request.id)}
                      className="request-button decline-button"
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
            {friendError && <p className="error">{friendError}</p>}
            {friends.length === 0 ? (
              <p className="no-friends">You have no friends yet.</p>
            ) : (
              <ul className="friends-list">
                {friends.map((friend) => (
                  <li key={friend.id} onClick={() => openChat(friend)}>
                    {friend.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div>
          <button onClick={closeChat} className="back-button">
            Back to Friend List
          </button>
          <ChatPage selectedFriend={selectedFriend} />
        </div>
      )}
    </div>
  );
};

export default FriendSystem;
