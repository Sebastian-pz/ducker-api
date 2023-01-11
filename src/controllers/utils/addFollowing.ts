import User from '../../models/user';

/**
 * addFollowing (async) tries to add following a user id
 * @param {String} idUserOne
 * @returns jwt / error
 */
export const addFollowing = async (idUserOne: string, idUserTwo: string): Promise<boolean> => {
	try {
		const user = await User.updateOne({ _id: idUserOne }, { $push: { following: idUserTwo } });

		return user.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`AddFollowing, Internal server error: ${error}`);
		return false;
	}
};
