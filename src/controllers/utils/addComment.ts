import { commentInterface } from '../../types/index';
import User from '../../models/user';

export const addComment = async (
	id: string,
	cuackID: string,
	comment: commentInterface
): Promise<any> => {
	try {
		const response = await User.updateOne(
			{ id, 'cuacks._id': cuackID },
			{ $push: { 'cuacks.$.comments': comment } }
		);

		return response.modifiedCount;
	} catch (error) {
		console.log(`Error pushing a comment: ${error}`);
		return false;
	}
};
