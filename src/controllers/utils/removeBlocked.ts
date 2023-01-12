import User from '../../models/user';

/**
 * removeBlocked (async) tries to removed block a user id
 * @param {String} idUser
 * @returns jwt / error
 */
export const removeBlocked = async (idUser: string, idOtherUser: any): Promise<boolean> => {
	try {
		const mod = await User.updateOne({ id: idUser }, { $pull: { blocked: idOtherUser } });
		return mod.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`removeBlocked Internal server error: ${error}`);
		return false;
	}
};
