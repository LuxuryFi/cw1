// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize express app
const app = express();
const port = 3000;
app.use(cors({
  origin: '*', // Allows requests from any origin. Replace '*' with your specific origin (e.g., 'http://localhost:61875') for more security.
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Allow these HTTP methods.
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers.
}));
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

const cartSchema = new mongoose.Schema({
  dayOfWeek: String,
  time: String,
  capacity: Number,
  duration: Number,
  price: Number,
  class_type: String,
  description: String,
  teacher: String,
  image: String,  // Store
});

const orderSchema = new mongoose.Schema({
  gmail: String,
  courseId: String// Store the image URL
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
const CartModel = mongoose.model('Cart', cartSchema);
const OrderModel = mongoose.model('Order', orderSchema);


// POST route for uploading data (including image URL)
app.get('/', async (req, res) => {
  try {
    const abc = await ClassModel.find();
    console.log('abc')
    res.status(200).json(abc)
  } catch (err) {

  }
})

app.delete('/:id', async (req, res) => {
  try {

    const _id = req.params.id;
    console.log('_id', _id);

    const abc = await ClassModel.deleteOne({ _id: _id });
    console.log('abc')
    res.status(200).json(abc)
  } catch (err) {
    console.log('err', err);
  }
})

app.post('/cart', async (req, res) => {
  try {
    const { dayOfWeek, time, capacity, duration, price, class_type, description, teacher, image } = req.body.nameValuePairs;

    console.log(req.body);
    if (!image) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Create a new document in MongoDB
    const newClass = new CartModel({
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

app.get('/cart', async (req, res) => {
  try {
    const { gmail, courseId } = req.body;
    console.log('_id', _id);
    const newClass = await CartModel.find();
    res.status(200).json(newClass)
  } catch (err) {
    console.log('err', err);
  }
})

app.delete('/:id', async (req, res) => {
  try {

    const _id = req.params.id;
    console.log('_id', _id);

    const abc = await CartModel.deleteOne({ _id: _id });
    console.log('abc')
    res.status(200).json(abc)
  } catch (err) {
    console.log('err', err);
  }
})


app.post('/order', async (req, res) => {
  try {
    const { gmail } = req.body;  // Assuming you are passing 'gmail' and 'courseId' in the request body.

    // Fetch all cart entries
    const allCarts = await CartModel.find();

    // Loop through each cart item and insert it with the additional info (gmail)
    const updatedCarts = allCarts.map(cartItem => ({
      ...cartItem.toObject(),  // Convert Mongoose document to a plain object
      email: gmail,            // Add the email info
      courseId: courseId       // Optionally, add the courseId if you want to associate this with each item
    }));

    // Insert updated cart items back into the database or perform the desired operation
    await CartModel.insertMany(updatedCarts);  // This will insert multiple new records

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/cart', async (req, res) => {
  try {
    const { gmail, courseId } = req.body;
    console.log('_id', _id);
    res.status(200).json(newClass)
  } catch (err) {
    console.log('err', err);
  }
})



app.put('/:id', async (req, res) => {
  try {
    const _id = req.params.id; // Extract the id from the URL
    // Extract the data from the request body directly
    const { dayOfWeek, time, capacity, duration, price, class_type, description, teacher, image } = req.body.nameValuePairs;

    // Log the received data to verify
    console.log('_id', _id);
    console.log('Updated data', { dayOfWeek, time, capacity, duration, price, class_type, description, teacher, image });

    // Use _id in the filter to find the document to update
    const result = await ClassModel.updateOne(
      { _id }, // The filter to find the document
      {
        $set: { dayOfWeek, time, capacity, duration, price, class_type, description, teacher, image } // The data to update
      }
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No document found with the given ID or no changes were made.' });
    }

    res.status(200).json({ message: 'Class details updated successfully', result });
  } catch (err) {
    console.error('Error updating class details:', err);
    res.status(500).json({ message: 'An error occurred while updating class details.' });
  }
});


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
