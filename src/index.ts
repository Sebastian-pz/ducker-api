import express from 'express';

import exampleRoutes from './routes/example';

const app = express();
app.use(express.json());

// Routes section
app.use('/api/example', exampleRoutes);

//Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(
    `🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄\nServer listening on port: ${PORT}\n🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄`
  );
});
