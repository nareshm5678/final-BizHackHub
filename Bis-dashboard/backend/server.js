const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const profilesDir = path.join(uploadsDir, 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profilesDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/bisDashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  college: { type: String },
  profilePic: { type: String },
  points: { type: Number, default: 0 },
  completedTasks: { type: [String], default: [] },
  achievements: {
    type: [{
      title: String,
      description: String,
      badge: String,
      dateEarned: Date
    }],
    default: []
  },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username, age, college } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      username: username || email.split('@')[0],
      age: age || null,
      college: college || null,
      points: 0,
      completedTasks: [],
      achievements: [],
      lastActive: new Date()
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        email: user.email,
        username: user.username,
        age: user.age,
        college: user.college
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { email: user.email },
      'your-secret-key', // Replace with actual secret key
      { expiresIn: '24h' }
    );

    console.log('User logged in:', email);
    res.json({
      token,
      user: {
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username },
      'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        email: user.email,
        username: user.username,
        profilePic: user.profilePic || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get user stats
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching stats for user:', req.user.email);
    
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Invalid token data' });
    }

    let user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      console.log('User not found, creating new user');
      const username = req.user.username || req.user.email.split('@')[0];
      user = new User({
        email: req.user.email,
        username: username,
        password: 'placeholder', // This should be properly handled in registration
        points: 0,
        completedTasks: [],
        achievements: [],
        lastActive: new Date()
      });
      await user.save();
      console.log('Created new user:', user.email, 'with username:', username);
    }

    console.log('Returning user stats for:', user.email);
    res.json({
      points: user.points || 0,
      completedTasks: user.completedTasks || [],
      achievements: user.achievements || [],
      lastActive: user.lastActive || user.createdAt,
      profilePic: user.profilePic ? `/uploads/profiles/${user.profilePic}` : null,
      username: user.username || user.email.split('@')[0]
    });
  } catch (error) {
    console.error('Error in /api/user/stats:', error);
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching leaderboard');
    const users = await User.find({}, 'username email points achievements')
      .sort({ points: -1 })
      .limit(100);

    res.json(users);
  } catch (error) {
    console.error('Error in /api/leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

// Complete task endpoint
app.post('/api/tasks/complete', authenticateToken, async (req, res) => {
  try {
    console.log('Task completion request:', req.body);
    const { taskId, taskTitle, points } = req.body;
    
    if (!taskId || !taskTitle || points === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if task is already completed
    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Initialize arrays if they don't exist
    if (!Array.isArray(user.completedTasks)) user.completedTasks = [];
    if (!Array.isArray(user.achievements)) user.achievements = [];
    if (typeof user.points !== 'number') user.points = 0;

    // Update user points and completed tasks
    user.points += points;
    user.completedTasks.push(taskId);
    user.lastActive = new Date();

    // Check and award achievements based on points
    if (user.points >= 1000 && !user.achievements.some(a => a.title === 'Expert')) {
      user.achievements.push({
        title: 'Expert',
        description: 'Earned 1000 points',
        badge: 'expert',
        dateEarned: new Date()
      });
    } else if (user.points >= 500 && !user.achievements.some(a => a.title === 'Intermediate')) {
      user.achievements.push({
        title: 'Intermediate',
        description: 'Earned 500 points',
        badge: 'intermediate',
        dateEarned: new Date()
      });
    } else if (user.points >= 100 && !user.achievements.some(a => a.title === 'Beginner')) {
      user.achievements.push({
        title: 'Beginner',
        description: 'Earned 100 points',
        badge: 'beginner',
        dateEarned: new Date()
      });
    }

    await user.save();
    console.log('Task completed successfully:', taskId);

    // Get updated leaderboard
    const users = await User.find({}, 'username email points achievements')
      .sort({ points: -1 })
      .limit(10);

    const leaderboard = users.map((u, index) => ({
      username: u.username || u.email.split('@')[0],
      points: u.points || 0,
      rank: index + 1,
      achievements: u.achievements || []
    }));

    res.json({
      points: user.points,
      completedTasks: user.completedTasks,
      achievements: user.achievements,
      leaderboard
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ message: 'Error completing task', error: error.message });
  }
});

// Get user profile by email
app.get('/api/user/profile/:email', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching profile for:', req.params.email);
    const userEmail = decodeURIComponent(req.params.email);
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username || user.email.split('@')[0],
      email: user.email,
      points: user.points || 0,
      completedTasks: user.completedTasks || [],
      achievements: user.achievements || [],
      lastActive: user.lastActive || user.createdAt,
      profilePic: user.profilePic || null,
      college: user.college || '',
      age: user.age || null
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Updating profile for:', req.user.email);
    const { username, age, college } = req.body;
    
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (age !== undefined) user.age = age;
    if (college !== undefined) user.college = college;

    await user.save();
    res.json({
      username: user.username,
      email: user.email,
      age: user.age,
      college: user.college,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Change password endpoint
app.put('/api/user/change-password', authenticateToken, async (req, res) => {
  try {
    console.log('Changing password for:', req.user.email);
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

// Update profile picture
app.post('/api/user/profile-picture', authenticateToken, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture if it exists
    if (user.profilePic) {
      const oldPicPath = path.join(__dirname, 'uploads', 'profiles', user.profilePic);
      if (fs.existsSync(oldPicPath)) {
        fs.unlinkSync(oldPicPath);
      }
    }

    user.profilePic = req.file.filename;
    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePic: req.file.filename
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture', error: error.message });
  }
});

// Refresh badges endpoint
app.post('/api/user/refresh-badges', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Reset achievements and points
    user.achievements = [];
    user.points = 0;
    user.completedTasks = [];
    await user.save();

    res.json({ message: 'Badges refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing badges:', error);
    res.status(500).json({ message: 'Error refreshing badges' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
