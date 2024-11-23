/*
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

const SECRET_KEY = 'your_secret_key'; // Use an environment variable in production

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'sockets',
});
 
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Register Endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    // Insert user into database
    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err, result) => {
        if (err) return res.status(400).json({ message: 'User already exists' });
        res.json({ message: 'User registered successfully' });
      }
    );
  });
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ message: 'Invalid credentials' });

      const user = results[0];

      // Compare passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user.id }, SECRET_KEY);
        res.json({ message: 'Login successful', token });
      });
    }
  );
});

// Save Messages Endpoint
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('chat message', ({ token, text }) => {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
  
        // Fetch username from the database using userId
        db.query('SELECT username FROM users WHERE id = ?', [userId], (err, results) => {
          if (err) {
            console.error(err);
            return;
          }
          if (results.length === 0) {
            console.error('User not found');
            return;
          }
  
          const username = results[0].username;
  
          // Save message to database along with the timestamp
          const timestamp = new Date().toISOString(); // Get current timestamp
          db.query(
            'INSERT INTO messages (user_id, username, message, created_at) VALUES (?, ?, ?, ?)',
            [userId, username, text, timestamp],
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
              // Emit the message to all clients
              io.emit('chat message', { userId, username, text, timestamp });
            }
          );
        });
      } catch (err) {
        console.error('Invalid token');
      }
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  

// Fetch all messages
app.get('/messages', (req, res) => {
    db.query('SELECT * FROM messages ORDER BY created_at ASC', (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching messages' });
      }
      res.json(results);
    });
  });
  

// Start Server
server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

*/


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

const SECRET_KEY = 'your_secret_key'; // Replace with env variable in production

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'sockets',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// User registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });
    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err) => {
        if (err) return res.status(400).json({ message: 'User already exists' });
        res.json({ message: 'User registered successfully' });
      }
    );
  });
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const userId=user.id
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id }, SECRET_KEY);
      res.json({ token, username, userId});
    });
  });
});
 
// Fetch all registered users
app.get('/users', (req, res) => {
  const token = req.headers.authorization; // Get token from request headers
  const decoded = jwt.verify(token, SECRET_KEY);
  const currentUserId = decoded.id;

  db.query(
    'SELECT id, username FROM users WHERE id != ?',
    [currentUserId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching users' });
      }
      res.json(results);
    }
  );
});


// Send friend request
app.post('/send-request', (req, res) => {
  const { senderId, receiverId } = req.body;
  db.query(
    'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)',
    [senderId, receiverId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error sending request' });
      res.json({ message: 'Friend request sent' });
    }
  );
});

// Accept friend request
app.post('/accept-request', (req, res) => {
  const { requestId } = req.body;
  db.query(
    'UPDATE friend_requests SET status = "accepted" WHERE id = ?',
    [requestId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error accepting request' });
      res.json({ message: 'Friend request accepted' });
    }
  );
});

// Decline friend request
app.post('/decline-request', (req, res) => {
  const { requestId } = req.body;
  db.query(
    'UPDATE friend_requests SET status = "declined" WHERE id = ?',
    [requestId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error declining request' });
      res.json({ message: 'Friend request declined' });
    }
  );
});

// Fetch friend requests
app.get('/friend-requests/:userId', (req, res) => {
  const { userId } = req.params;
  db.query(
    'SELECT * FROM friend_requests WHERE receiver_id = ? AND status = "pending"',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching requests' });
      res.json(results);
    }
  );
});

// Fetch accepted friends
app.get('/friends/:userId', (req, res) => {
  const { userId } = req.params;
  db.query(
    `SELECT users.id, users.username FROM friend_requests 
     JOIN users ON users.id = friend_requests.sender_id OR users.id = friend_requests.receiver_id
     WHERE (sender_id = ? OR receiver_id = ?) AND status = "accepted" AND users.id != ?`,
    [userId, userId, userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching friends' });
      res.json(results);
    }
  );
});

// Real-time messaging
/*
io.on('connection', (socket) => {
  socket.on('chat message', ({ senderId, receiverId, text }) => {
    const timestamp = new Date().toISOString();
    db.query(
      'INSERT INTO messages (sender_id, receiver_id, text, created_at) VALUES (?, ?, ?, ?)',
      [senderId, receiverId, text, timestamp],
      (err) => {
        if (err) return console.error(err);
        io.emit('chat message', { senderId, receiverId, text, timestamp });
      }
    );
  });
});

*/



io.on('connection', (socket) => {
  

  // Join user-specific room on connection

  // Listen for chat messages
  socket.on('chat message', ({ senderId, receiverId, text }) => {
    const timestamp = new Date().toISOString();

    // Insert the message into the database
    db.query(
      'INSERT INTO messages (sender_id, receiver_id, text, created_at) VALUES (?, ?, ?, ?)',
      [senderId, receiverId, text, timestamp],
      (err) => {
        if (err) {
          console.error('Error storing message:', err);
          return;
        }

        // Emit the message only to the sender and receiver
        io.to(senderId).to(receiverId).emit('chat message', {
          senderId,
          receiverId,
          text,
          timestamp,
        });
      }
    );
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


// Fetch messages between the logged-in user and selected friend
app.get('/messages/:friendId', (req, res) => {

  const { friendId } = req.params;
  const token = req.headers.authorization.split(" ")[1]; // Get token from request headers
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;
  if (!friendId) {
    return res.status(400).json({ error: 'Friend ID is required' });
  }

  // Query to fetch messages between the logged-in user and the friend
  db.query(
    `SELECT * FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC`,
    [userId, friendId, friendId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching messages' });
      }
      res.json(results); // Return the messages in the response
    }
  );
});

 
// Start server
server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
 