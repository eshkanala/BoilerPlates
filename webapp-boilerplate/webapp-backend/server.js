// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // Example route

dotenv.config(); // Load environment variables
connectDB();    // Connect to MongoDB

const app = express();

app.use(cors());         // Enable CORS for all origins (for development)
app.use(express.json()); // Parse JSON request bodies

// backend/server.js
// ... other imports and setup ...
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); // Serve static files from 'uploads' folder

// Define API routes here
app.use('/api/users', userRoutes); // Example user routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});