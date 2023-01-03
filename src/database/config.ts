import mongoose from 'mongoose';

const dbConnection = async () => {
	try {
		mongoose.set('strictQuery', true);
		mongoose.connect(process.env.MONGO_CNN ? process.env.MONGO_CNN : 'No uri');

		console.log('Base de datos arriba!!!');
	} catch (error) {
		console.log(error);
		throw new Error('Error en la base de datos');
	}
};

export default dbConnection;
