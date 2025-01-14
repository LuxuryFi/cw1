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
  position: String,
  teacher: String,
  image: String,  // Store the image URL
});

const cartSchema = new mongoose.Schema({
  dayOfWeek: String,
  time: String,
  capacity: Number,
  duration: Number,
  price: Number,
  position: String,
  class_type: String,
  description: String,
  teacher: String,
  image: String,  // Store
});


const orderSchema = new mongoose.Schema({
  dayOfWeek: String,
  time: String,
  capacity: Number,
  duration: Number,
  courseId: String,
  price: Number,
  class_type: String,
  position: String,
  description: String,
  teacher: String,
  image: String,  // Stor
  email: String,
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

    const abc = await CartModel.deleteOne({ _id: _id });
    console.log('abc')
    res.status(200).json(abc)
  } catch (err) {
    console.log('err', err);
  }
})

app.post('/cart', async (req, res) => {
  try {
    const { dayOfWeek, time, capacity, duration, price, class_type, description, position, teacher, image } = req.body;

    console.log(req.body);

    // Create a new document in MongoDB
    const newClass = new CartModel({
      dayOfWeek,
      time,
      capacity,
      duration,
      position,
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

app.get('/cart', async (req, res) => {
  try {
    const newClass = await CartModel.find();
    res.status(200).json(newClass)
  } catch (err) {
    console.log('err', err);
  }
})

app.get('/orders', async (req, res) => {
  try {
    const newClass = await OrderModel.find();

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
    const { email } = req.body; // Assuming 'gmail' is passed in the request body.

    console.log('email', email);
    // Fetch all cart entries
    const allCarts = await CartModel.find();

    if (!allCarts.length) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Process each cart item one by one
    for (const cartItem of allCarts) {
      // Convert the cart item to a plain object to ensure all fields are included
      const cartData = cartItem.toObject();

      // Create a new order document with the cart item details
      const newOrder = new OrderModel({
        email,
        courseId: cartData._id,
        ...cartData, // Spread all cart item fields into the order document
      });

      // Save the order
      await newOrder.save();

      // Delete the cart item after saving the order
      await CartModel.deleteOne({ _id: cartItem._id });
    }

    res.status(200).json({ message: 'Order placed successfully and cart cleared' });
  } catch (err) {
    console.error('Error processing order:', err);
    res.status(500).json({ error: 'Failed to place the order' });
  }
});


app.put('/:id', async (req, res) => {
  try {
    const _id = req.params.id; // Extract the id from the URL
    // Extract the data from the request body directly
    const { dayOfWeek, time, capacity, duration, price, class_type, position, description, teacher, image } = req.body.nameValuePairs;

    // Log the received data to verify
    console.log('_id', _id);
    console.log('Updated data', { dayOfWeek, time, capacity, duration, price, class_type, description, teacher, image });

    // Use _id in the filter to find the document to update
    const result = await ClassModel.updateOne(
      { _id }, // The filter to find the document
      {
        $set: { dayOfWeek, time, capacity, duration, price, class_type, description, teacher, image, position } // The data to update
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
    const { dayOfWeek, time, capacity, duration, price, class_type, description, teacher,position, image } = req.body.nameValuePairs;

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
      position,
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
