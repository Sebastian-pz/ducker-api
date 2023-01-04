import express from 'express';
import dbConnection from '../database/config';
import router from '../routes/user';

class Server {
	port: string | undefined;
	app: any;
	paths: { users: string; auth: string; cuack: string };

	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		this.paths = {
			users: '/users',
			auth: '/auth',
			cuack: '/cuack',
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
	}

	routes() {
		// 	this.app.use(this.paths.auth, require('../routes/auth'));
		this.app.use(this.paths.users, router);
		// 	this.app.use(this.paths.cuack, require('../routes/cuack'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(` 🦆 Server listening on port: ${this.port} 🦆 `);
		});
	}
}

export default Server;
