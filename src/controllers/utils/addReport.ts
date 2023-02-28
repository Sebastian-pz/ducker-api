import User from '../../models/user';

/**
 * addReport (async) tries to report a user id
 * @param {String} idUser
 * @returns jwt / error
 */
export const addReport = async (idUser: string, report: any): Promise<boolean> => {
	console.log(idUser);
	console.log(report);
	// Ruta
	// Params llega el id del que vamos a modificar
	// Por body llega report y el id del usuario que está reportando
	try {
		const mod = await User.updateOne({ _id: idUser }, { $push: { reports: report } });
		return mod.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`AddBlocked Internal server error: ${error}`);
		return false;
	}
};
