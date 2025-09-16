
const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const searchRoutes = require('./routes/searchRoutes');
const AiChatRoutes = require('./routes/AiChatRoutes');



require('./config/Passport'); // loads Google Strategy
const authRoutes = require('./routes/auth');

const app = express();

// Proxy trust
app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
}));

// Body + Cookies
app.use(express.json());
app.use(cookieParser());

// Passport
app.use(passport.initialize());
// If using sessions: app.use(passport.session());

// DB
connectDB();

// Routes
app.use('/auth', authRoutes); // Page routes 

app.use('/api/chat', AiChatRoutes);     // AI models route

app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
