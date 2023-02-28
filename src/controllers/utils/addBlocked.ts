import User from '../../models/user';

/**
 * addBlocked (async) tries to block a user id
 * @param {String} idUser
 * @returns jwt / error
 */
export const addBlocked = async (idUser: string, idOtherUser: any): Promise<boolean> => {
	try {
		const mod = await User.updateOne({ _id: idUser }, { $push: { blocked: idOtherUser } });
		return mod.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`AddBlocked Internal server error: ${error}`);
		return false;
	}
};
