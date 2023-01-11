import User from '../../models/user';

/**
 * addFollower (async) tries to add follower a user id
 * @param {String} idUserTwo
 * @returns jwt / error
 */
export const addFollower = async (idUserTwo: string, idUserOne: string): Promise<boolean> => {
	try {
		const mod = await User.updateOne({ _id: idUserTwo }, { $push: { followers: idUserOne } });
		return mod.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`AddFollower Internal server error: ${error}`);
		return false;
	}
};
