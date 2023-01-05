import User from '../../models/user';

const addRecuacks = async (authorID: string, recuackID: string, cuack_id: string): Promise<any> => {
	try {
		const user = await User.findOne({ _id: authorID });
		const cuacks = user?.cuacks;
		if (!cuacks) return;

		// @ts-ignore
		const cuack = cuacks.find((cuack) => cuack._id == cuack_id);
		cuack?.recuacks.push(recuackID);
		await user.save();

		return true;
	} catch (error) {
		console.log(`Error in like post: ${error}`);
		return false;
	}
};

export default addRecuacks;

// Seba vende empanadas
// 🥟🥟
