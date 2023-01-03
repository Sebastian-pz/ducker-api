import * as dotenv from 'dotenv';
dotenv.config();

import Server from './models/server';

const server = new Server();

server.listen();
