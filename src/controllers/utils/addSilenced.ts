import User from '../../models/user';

/**
 * addSilenced (async) tries to add silenced a user id
 * @param {String} idUser
 * @returns jwt / error
 */
export const addSilenced = async (idUser: string, idSilenced: any): Promise<boolean> => {
	try {
		const mod = await User.updateOne({ id: idUser }, { $push: { silenced: idSilenced } });
		return mod.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`addSilenced Internal server error: ${error}`);
		return false;
	}
};
