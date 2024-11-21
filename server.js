
/*
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import CORS

const app = express();
const server = http.createServer(app);

// Configure CORS for Express
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your React app
  methods: ['GET', 'POST'],        // Specify allowed HTTP methods
}));

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Match the frontend origin
    methods: ['GET', 'POST'],        // Specify allowed methods
  },
});

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat messages
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); // Broadcast message to all clients
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
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
