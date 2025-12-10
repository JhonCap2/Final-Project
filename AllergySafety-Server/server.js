import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import allergyRoutes from './routes/allergy.routes.js';
import contactRoutes from './routes/contact.routes.js';
import sosRoutes from './routes/sos.routes.js'; // Importa las rutas del SOS
import requestLogger from './middleware/requestLogger.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Request logger
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);        // <- nota: "users" plural
app.use('/api/allergies', allergyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api', sosRoutes); // Registra las rutas del SOS

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// --- DEBUG: Log the NODE_ENV value ---
console.log(`Current NODE_ENV: '${process.env.NODE_ENV}'`);

// --- SERVE FRONTEND IN PRODUCTION ---
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Set static folder
  app.use(express.static(path.join(__dirname, '../AllergySafety-Client/dist')));

  // For any route that is not an API route, send the index.html from the client build
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../AllergySafety-Client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('API is running in development mode...'));
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// Start server
app.listen(PORT, () => {
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  console.log(`🚀 AllergySafety API Server running on http://${host}:${PORT}`);
});
