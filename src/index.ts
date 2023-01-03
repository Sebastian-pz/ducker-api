import express from 'express';
import dbConnection from '../src/database/config';
import * as dotenv from 'dotenv';
dotenv.config();

import exampleRoutes from './routes/example';

const app = express();
app.use(express.json());

const conectarDB = async () => {
	await dbConnection();
};
conectarDB();

// Routes section
app.use('/api/example', exampleRoutes);

//Start server
let PORT = process.env.PORT ? process.env.PORT : 5000;
app.listen(PORT, () => {
	console.log(` 🦆 Server listening on port: ${PORT} 🦆 `);
});
