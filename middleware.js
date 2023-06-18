const express = require('express');
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to parse JSON body
app.use(express.json());
const fixedsalt = "$2b$10$J9p8h1TEhTN6hjkf0p6f2O";

// Mock User Model
const users = [
  {
    id: 1,
    name: 'karimi',
    email: 'karimi@example.com',
    password: '$2b$10$J9p8h1TEhTN6hjkf0p6f2Of5WV3ISvw7CFVzuHHYhwMsG6hnr3Lc6' // Hashed password: "password"
  }
];

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  // Retrieve the token from the request headers
  const token = req.headers.authorization;
  //res.send(token);
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, fixedsalt);
    
    // Check if the decoded token contains the necessary user data
    if (!decoded.userId) {
      throw new Error('Invalid token: User ID missing');
    }
  
    // Set the user data in the request object
    req.user = decoded;
  
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(403).json({ error: 'Invalid token' });
  }
  
};

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email);

  try {
    const client = new MongoClient("mongodb://127.0.0.1:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db("bcrypt");
    const collection = db.collection("user");

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password!" });
    }

    const token = jwt.sign({ userId: user._id }, fixedsalt, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Successful authentication", token });

    client.close();
  } catch (error) {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
});

// Protected Route
//to test in in postman => n the request header section, add a new header with the key : 'Authorization' and the value : 'your_token_here'; 'your_token_here' => the string in token object
app.get('/protected', authenticateToken, (req, res) => {
  // Access the authenticated user's data from req.user
  const userId = req.user.userIdentifier;
  //res.json(req.user); => {"userIdentifier": "karimi@example.com","iat": 1686074481,"exp": 1686078081}
  res.json({ message: 'Access granted to protected route', userId });
});

// Unprotected Route
app.get('/unprotected', (req, res) => {
  res.json({ message: 'Access granted to unprotected route' });
});

// Start the server
app.listen(3005, () => {
  console.log('Server started on port 3005');
});