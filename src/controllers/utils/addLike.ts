import User from '../../models/user';

const addLike = async (authorID: string, likeID: string, cuack_id: string): Promise<any> => {
	try {
		const user = await User.findOne({ _id: authorID });
		const cuacks = user?.cuacks;
		if (!cuacks) return;

		// @ts-ignore
		const cuack = cuacks.find((cuack) => cuack._id == cuack_id);
		cuack?.likes.push(likeID);
		await user.save();

		return true;
	} catch (error) {
		console.log(`Error in like post: ${error}`);
		return false;
	}
};

export default addLike;

// Seba vende empanadas
// 🥟🥟
