const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
// Middleware to parse JSON body
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const fixedsalt = "$2b$10$J9p8h1TEhTN6hjkf0p6f2O";

app.use(express.static(path.join(__dirname, 'public')));


app.get("/users", async (req, res) => {
  try {
    const client = new MongoClient("mongodb://127.0.0.1:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("bcrypt"); // Replace with your database name
    const collection = db.collection("user"); // Replace with your collection name

    const result = await collection.find({}).toArray(); // Retrieve all documents

    res.json(result); // Send the retrieved data as JSON response

    client.close();
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Error retrieving data", error);
  }
});



// Ajouter un utilisateur
app.post("/user", express.json(), async (req, res) => {
  try {
    const client = new MongoClient("mongodb://127.0.0.1:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("bcrypt"); // Replace with your database name
    const collection = db.collection("user"); // Replace with your collection name

    const { name, email, password } = req.body;

    const user = { name, email, password };

    const hashedPassword = await bcrypt.hash(user.password, fixedsalt); // Hash the password using bcrypt

    user.password = hashedPassword; // Update the document with the hashed password

    const result = await collection.insertOne(user); // Insert the document into the collection

    res.send("User inserted successfully"); // Send the inserted document as a JSON response

    client.close();
  } catch (error) {
    console.error("Error creating data:", error);
    res.status(500).send("Error creating data");
  }
});



// Login
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
