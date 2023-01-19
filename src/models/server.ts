import express from 'express';
import cors from 'cors';
import dbConnection from '../database/config';
import routerUsers from '../routes/user';
import routerAuth from '../routes/auth';
import routerCuack from '../routes/cuacks';
import routerSearch from '../routes/search';

class Server {
	port: string | undefined;
	app: any;
	paths: { users: string; auth: string; cuack: string; search: string };

	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		this.paths = {
			users: '/users',
			auth: '/auth',
			cuack: '/cuacks',
			search: '/search',
		};

		//conexion a base de datos
		this.conectarDB();

		//middlewares
		this.middlewares();

		//rutas
		this.routes();
	}

	conectarDB = async () => {
		await dbConnection();
	};

	middlewares() {
		this.app.use(express.json());

		//directorio publico
		this.app.use(express.static('public'));

		this.app.use(
			cors({
				origin: ['http://localhost:3000'],
			})
		);
	}

	routes() {
		this.app.use(this.paths.auth, routerAuth);
		this.app.use(this.paths.users, routerUsers);
		this.app.use(this.paths.cuack, routerCuack);
		this.app.use(this.paths.search, routerSearch);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Server listening on port: ${this.port} 🦆 `);
		});
	}
}

export default Server;
