// server.js
const express = require('express');
const mongoose = require('mongoose');

// Initialize express app
const app = express();
const port = 3000;

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection String
const dbPassword = 'quocanh123';  // Replace with your DB password
const dbURI = `mongodb+srv://anhitluxuryfi:${dbPassword}@minh-project.y4m4j.mongodb.net/test?retryWrites=true&w=majority`;


// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Define the schema for the data to be inserted into MongoDB
const schema = new mongoose.Schema({
  dayOfWeek: String,
  time: String,
  capacity: Number,
  duration: Number,
  price: Number,
  class_type: String,
  description: String,
  teacher: String,
  image: String,  // Store the image URL
});

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // Increase the timeout to 30 seconds
  socketTimeoutMS: 45000,          // 45 seconds socket timeout
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Create a model for the schema
const ClassModel = mongoose.model('Class', schema);

// POST route for uploading data (including image URL)
app.post('/upload', async (req, res) => {
  try {
    const { dayOfWeek, time, capacity, duration, price, class_type, description, teacher, image } = req.body.nameValuePairs;

    console.log(req.body);
    if (!image) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Create a new document in MongoDB
    const newClass = new ClassModel({
      dayOfWeek,
      time,
      capacity,
      duration,
      price,
      class_type,
      description,
      teacher,
      image,  // Directly store the image URL
    });

    await newClass.save();
    res.status(200).json({ message: 'Class data uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).json({ message: 'Failed to upload class data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
