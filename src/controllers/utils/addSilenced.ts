import User from '../../models/user';

export const addSilenced = async (idUser: string, idSilenced: string): Promise<boolean> => {
	try {
		const mod = await User.updateOne({ id: idUser }, { $push: { silenced: idSilenced } });
		return mod.modifiedCount == 1 ? true : false;
	} catch (error) {
		console.log(`AddFollower Internal server error: ${error}`);
		return false;
	}
};
