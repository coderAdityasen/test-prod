const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const myname = 'aditya sen';

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend server!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/echo', (req, res) => {
  res.json({ echo: req.body });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const tellmmyname = "my name is feature/name";