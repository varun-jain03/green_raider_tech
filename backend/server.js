// Dependencies
require('dotenv').config();

// File Imports
const app = require('./src/app.js');
const connectDB = require('./src/config/db.js');

const PORT = process.env.PORT || 5000;

// Start Server After DB Connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();