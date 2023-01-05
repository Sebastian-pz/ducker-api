import { commentInterface } from '../../types/index';
import User from '../../models/user';

const addComment = async (
	id: string,
	cuack_id: string,
	comment: commentInterface
): Promise<any> => {
	try {
		const user = await User.findOne({ _id: id });
		const cuacks = user?.cuacks;
		if (!cuacks) return;

		// @ts-ignore
		const cuack = cuacks.find((cuack) => cuack._id == cuack_id);
		cuack?.comments.push(comment);
		await user.save();

		return true;
	} catch (error) {
		console.log(`Error pushing a comment: ${error}`);
		return false;
	}
};

export default addComment;
