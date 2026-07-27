import 'dotenv/config';
import app from './app.js';
import { initializeDatabase, isDatabaseConfigured } from './services/databaseService.js';

const port = process.env.PORT || 5000;

if (isDatabaseConfigured()) {
  initializeDatabase()
    .then(() => {
      console.log('Database connected and schema ready.');
    })
    .catch((error) => {
      console.error(`Database initialization failed: ${error.message}`);
    });
}

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
