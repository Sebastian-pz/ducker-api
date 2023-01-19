import User from '../../models/user';

export const addRecuacks = async (
	authorID: string,
	recuackID: string,
	cuack_id: string
): Promise<any> => {
	try {
		const user = await User.updateOne(
			{ id: authorID, 'cuacks._id': cuack_id },
			{ $push: { 'cuacks.$.recuacks': recuackID } }
		);

		return user.modifiedCount;
	} catch (error) {
		console.log(`Error in like post: ${error}`);
		return false;
	}
};
