const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017'; // Replace with your MongoDB server URL
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(url, options);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    // Your code here
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connect();

const db = client.db('bcrypt'); // Replace with your database name

// // Example: Insert a document into a collection
// const collection = db.collection('user'); // Replace with your collection name
// const document = { email: "oussama@example.com", password: 'oussama@523' };

// collection.insertOne(document);
// console.log('document inserted successfuly');



