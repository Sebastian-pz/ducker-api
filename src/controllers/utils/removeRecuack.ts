import User from '../../models/user';
//HAY QUE PROBAR
const removeRecuack = async (idAuthorOrigin: string, idCuackOrigin: string, idRecuack: string) => {
	const response = await User.updateOne(
		{ _id: idAuthorOrigin, 'cuacks._id': idCuackOrigin },
		{ $pull: { 'cuacks.$.recuacks': idRecuack } }
	);
	return response.modifiedCount;
};

export default removeRecuack;
