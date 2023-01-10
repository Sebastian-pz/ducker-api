import User from '../../models/user';

//HAY QUE PROBAR
export const remove = async (
	idAuthorOrigin: string,
	idComment: string,
	idCuakOrigin: string
): Promise<boolean> => {
	try {
		const user = await User.findOne({ id: idAuthorOrigin });
		if (!user) return false;
		let mainCuack = user.cuacks;

		// @ts-ignore
		mainCuack = mainCuack.find((cuack) => cuack._id.toString() === idCuakOrigin);

		// @ts-ignore
		mainCuack = mainCuack.comments.filter((comment) => {
			return comment.id.toString() !== idComment;
		});

		await User.updateOne(
			{ id: idAuthorOrigin, 'cuacks._id': idCuakOrigin },
			{ 'cuacks.$.comments': mainCuack }
		);

		await user.save();
		return true;
	} catch (error) {
		console.log(`remove comment internal server error ${error}`);
		return false;
	}
};
