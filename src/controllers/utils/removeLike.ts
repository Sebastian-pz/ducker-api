import User from '../../models/user';

//HAY QUE PROBAR
export async function removeLike(idAuthorOrigin: string, idCuackOrigin: string, idLike: string) {
	const response = await User.updateOne(
		{ _id: idAuthorOrigin, 'cuacks._id': idCuackOrigin },
		{ $pull: { 'cuacks.$.likes': idLike } }
	);

	return response.modifiedCount;
}
