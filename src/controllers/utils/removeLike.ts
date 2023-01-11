import User from '../../models/user';

//HAY QUE PROBAR
export const cancelLike = async (
  idAuthorOrigin: string,
  idCuackOrigin: string,
  idLike: string
): Promise<boolean> => {
  try {
    const user = await User.findOne({ id: idAuthorOrigin });
    if (!user) return false;

    // @ts-ignore
    let mainCuack = user.cuacks.find((cuack) => cuack._id.toString() === idCuackOrigin);
    // @ts-ignore
    mainCuack = mainCuack.likes.filter((like) => like._id.toString() !== idLike);

    await User.updateOne(
      { _id: idAuthorOrigin, 'cuacks._id': idCuackOrigin },
      { 'cuacks.$.likes': mainCuack }
    );
    await user.save();

    return true;
  } catch (error) {
    console.log(`Remove like internal server error: ${error}`);
    return false;
  }
};
