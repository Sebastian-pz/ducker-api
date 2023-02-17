import User from '../../models/user';

/**
 * addFollower (async) tries to add follower a user id
 * @param {String} idUserTwo
 * @returns jwt / error
 */
export const addFollower = async (
  idUserTwo: string,
  idUserOne: string
): Promise<any> => {
  try {
    const mod = await User.findOneAndUpdate(
      { _id: idUserTwo },
      { $push: { followers: idUserOne } }
    );
    return mod;
  } catch (error) {
    console.log(`AddFollower Internal server error: ${error}`);
    return false;
  }
};
