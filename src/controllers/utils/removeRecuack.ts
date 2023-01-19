import User from '../../models/user';

//HAY QUE PROBAR
export const cancelRecuack = async (
  idAuthorOrigin: string,
  idCuakOrigin: string,
  idRecuack: string
): Promise<boolean> => {
  try {
    const user = await User.findOne({ id: idAuthorOrigin }); //busco al autor del cuack
    if (!user) return false; //si no existe retorno eso, pero si existe entonces ⬇

    console.log('Soy el 1 mainCuack', user.cuacks);
    // @ts-ignore
    let mainCuack = user.cuacks.find((cuack) => cuack._id.toString() === idCuakOrigin); // busco el cuack
    console.log('Soy el 2 mainCuack', mainCuack);
    // @ts-ignore
    mainCuack = mainCuack.recuacks.filter((recuack) => {
      return recuack !== idRecuack;
    }); //filtro para sacar ese recuack de la lista
    console.log('Soy el 3 mainCuack', mainCuack);

    await User.updateOne(
      { id: idAuthorOrigin, 'cuacks._id': idCuakOrigin },
      { 'cuacks.$.recuacks': mainCuack }
    ); //modifico en la DB
    await user.save(); //guardo

    return true;
  } catch (error) {
    console.log(`Remove recuack internal server error: ${error}`);
    return false;
  }
};
