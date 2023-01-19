import User from '../../models/user';

/**
 * removeSilenced (async) tries to remove silenced a user id
 * @param {String} idUser
 * @returns jwt / error
 */
export const removeSilenced = async (idUser: string, idSilenced: string): Promise<boolean> => {
	try {
		const mod = await User.updateOne({ id: idUser }, { $pull: { silenced: idSilenced } });
		return mod.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`removeSilenced Internal server error: ${error}`);
		return false;
	}
};
