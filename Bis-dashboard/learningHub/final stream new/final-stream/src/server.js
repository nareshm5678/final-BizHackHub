import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors()); // Enable CORS for all routes (important if your frontend is running on a different port)

// MongoDB Schema for Category Progress
const categoryProgressSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  video1: { type: Boolean, default: false },
  video2: { type: Boolean, default: false },
  video3: { type: Boolean, default: false },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

const CategoryProgress = mongoose.model('CategoryProgress', categoryProgressSchema);

// Route to update category progress
app.post('/api/progress/updateProgress', async (req, res) => {
  try {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    const { categoryId, videoId, completed } = req.body;
    console.log('Parsed Data:', { categoryId, videoId, completed });
  
    if (!categoryId || !videoId || typeof completed !== 'boolean') {
      console.error('Invalid request payload:', req.body);
      return res.status(400).json({ message: 'Invalid request payload', received: req.body });
    }
  
    // Find the progress document for this category
    let categoryProgress = await CategoryProgress.findOne({ id: categoryId });
    console.log('Existing Category Progress:', categoryProgress);
  
    if (!categoryProgress) {
      console.log('Creating new category progress document');
      // Create a new document if none exists
      categoryProgress = new CategoryProgress({
        id: categoryId,
        title: `Category ${categoryId}`,
        category: `Category ${categoryId}`,
        video1: false,
        video2: false,
        video3: false,
        progress: 0
      });
    }
  
    // Update video status
    const previousState = { ...categoryProgress.toObject() };
    
    if (videoId === 'qms-1' || videoId === 'env-1' || videoId === 'cert-1' || videoId === 'lab-1') {
      categoryProgress.video1 = completed;
    } else if (videoId === 'qms-2' || videoId === 'env-2' || videoId === 'cert-2' || videoId === 'lab-2') {
      categoryProgress.video2 = completed;
    } else if (videoId === 'qms-3' || videoId === 'env-3' || videoId === 'cert-3' || videoId === 'lab-3') {
      categoryProgress.video3 = completed;
    }
  
    console.log('Previous State:', previousState);
    console.log('Updated State:', categoryProgress);
  
    // Update overall progress
    const completedVideos = [categoryProgress.video1, categoryProgress.video2, categoryProgress.video3].filter(Boolean).length;
    categoryProgress.progress = Math.round((completedVideos / 3) * 100);
  
    // Save the updated progress
    console.log('Attempting to save:', categoryProgress);
    const savedProgress = await categoryProgress.save();
    console.log('Save operation completed. Saved data:', savedProgress);
  
    res.status(200).json(savedProgress);
  } catch (err) {
    console.error('Error in updateProgress:', err);
    res.status(500).json({ 
      message: 'Error updating progress', 
      error: err.message,
      stack: err.stack
    });
  }
});

// Route to fetch category progress
app.get('/api/progress/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    console.log('Fetching progress for category:', categoryId);
    
    const progress = await CategoryProgress.findOne({ id: categoryId });
    console.log('Found progress:', progress);
    
    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this category' });
    }
    
    res.status(200).json(progress);
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ message: 'Error fetching progress', error: err.message });
  }
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/videoProgressDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);  // Exit if we can't connect to database
});

// Add connection error handler
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
