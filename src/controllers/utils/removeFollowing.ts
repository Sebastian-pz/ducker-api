import User from '../../models/user';

/**
 * addFollowing (async) tries to add following a user id
 * @param {String} idUserOne
 * @returns jwt / error
 */
export const removeFollowing = async (idUserOne: string, idUserTwo: string): Promise<boolean> => {
	try {
		const user = await User.updateOne({ _id: idUserOne }, { $pull: { following: idUserTwo } });

		return user.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`RemoveFollowing, Internal server error: ${error}`);
		return false;
	}
};
