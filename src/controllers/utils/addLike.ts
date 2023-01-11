import User from '../../models/user';

export const addLike = async (authorID: string, likeID: string, cuackID: string): Promise<any> => {
	try {
		const response = await User.updateOne(
			{ _id: authorID, 'cuacks._id': cuackID },
			{ $push: { 'cuacks.$.likes': likeID } }
		);
		return response.modifiedCount;
	} catch (error) {
		console.log(`Error in like post: ${error}`);
		return false;
	}
};

// Seba vende empanadas
// 🥟🥟
