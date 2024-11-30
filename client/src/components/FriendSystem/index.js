import React, { useState, useEffect } from 'react';
import ChatPage from '../Chat/ChatPage';
import axios from 'axios';
import Header from '../Header';

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
        const response = await axios.get(`https://wsocket-3.onrender.com/friend-requests/${userId}`);
        setFriendRequests(response.data);
      } catch (err) {
        setError('Error fetching friend requests.');
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await axios.get(`https://wsocket-3.onrender.com/friends/${userId}`);
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
      await axios.post('https://wsocket-3.onrender.com/accept-request', { requestId });
      setFriendRequests((prev) => prev.filter((request) => request.id !== requestId));
      alert('Friend request accepted');
    } catch (err) {
      alert('Error accepting friend request.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post('https://wsocket-3.onrender.com/decline-request', { requestId });
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

  return (
    <>
      <Header />
      <div className="min-h-screen mt-14 bg-white-100 text-gray-800 py-10 px-4">
     

        {!selectedFriend ? (
          <>
            <div className="mb-10 p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
              {error && <p className="text-red-600 mb-4">{error}</p>}
              {friendRequests.length === 0 ? (
                <p className="text-gray-400">No pending friend requests.</p>
              ) : (
                <ul className="space-y-4">
                  {friendRequests.map((request) => (
                    <li key={request.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                      <span className="font-semibold">{request.username}</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAccept(request.request_id)}
                          className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(request.id)}
                          className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                        >
                          Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-10 p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Friends</h2>
              {friendError && <p className="text-red-600 mb-4">{friendError}</p>}
              {friends.length === 0 ? (
                <p className="text-gray-400">You have no friends yet.</p>
              ) : (
                <ul className="space-y-4">
                  {friends.map((friend) => (
                    <li
                      key={friend.id}
                      onClick={() => openChat(friend)}
                      className="cursor-pointer bg-blue-100 hover:bg-blue-200 p-4 rounded-lg flex justify-between items-center"
                    >
                      <h3 className="text-black font-semibold">{friend.username}</h3>
                      <p className="text-gray-500">Chat Now</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div>
           
            <ChatPage selectedFriend={selectedFriend} />
          </div>
        )}
      </div>
    </>
  );
};

export default FriendSystem;
