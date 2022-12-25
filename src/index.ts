import express from 'express';

import exampleRoutes from './routes/example';

const app = express();
app.use(express.json());

// Routes section
app.use('/api/example', exampleRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
