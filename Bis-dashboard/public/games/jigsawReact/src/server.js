import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Initialize Express app
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/quizDB';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// MongoDB Schemas and Models
const quizSchema = new mongoose.Schema({
  level: Number,
  question: String,
  options: [String],
  answer: String,
});

const resultSchema = new mongoose.Schema({
  user: String,
  timeTaken: Number,
  date: { type: Date, default: Date.now },
  isGameOver: { type: Boolean, default: false }
});

const Quiz = mongoose.model('Quiz', quizSchema);
const Result = mongoose.model('Result', resultSchema);

// API Endpoints

// Fetch quiz question by level
app.get('/api/quiz/:level', async (req, res) => {
  try {
    const level = req.params.level;
    const question = await Quiz.findOne({ level });
    if (question) {
      res.json({ success: true, question });
    } else {
      res.status(404).json({ success: false, message: 'Question not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save game time (for successful completion)
app.post('/api/save-time', async (req, res) => {
  try {
    const { timeTaken, user } = req.body;
    const result = new Result({
      user,
      timeTaken,
      date: new Date(),
      isGameOver: false
    });
    await result.save();
    res.json({ success: true, message: 'Time saved successfully' });
  } catch (err) {
    console.error('Error saving time:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save game over time
app.post('/api/gameover', async (req, res) => {
  try {
    const { timeTaken, username } = req.body;
    console.log('Received game over data:', { timeTaken, username }); // Debug log
    
    const result = new Result({
      user: username,
      timeTaken,
      date: new Date(),
      isGameOver: true
    });
    await result.save();
    console.log('Saved game over result:', result); // Debug log
    
    res.json({ success: true, message: 'Game over time saved successfully' });
  } catch (err) {
    console.error('Error saving game over time:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
