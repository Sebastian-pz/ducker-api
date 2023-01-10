import User from '../models/user';

/**
 * existEmail (async) checks if an email is already registered in the database
 * @param {String} email
 * @throws if email already exist throws an error
 */
export const existEmail = async (email: string = '') => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Error(`Email ${email} already exists.`);
  }
};

/**
 * existNickname (async) checks if a nickname is already registered in the database
 * @param {String} nickname
 * @throws if nickname already exist throws an error
 */
export const existNickname = async (nickname: string = '') => {
  const user = await User.findOne({ nickname: `@${nickname}` });
  if (user) {
    throw new Error(`${nickname} already exists.`);
  }
};

/**
 * existUser (async) checks if a user id exists in db
 * @param {String} id
 * @throws if user id does not exist in db throws an error
 */
export const existUser = async (id: string = '') => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error(`User id: ${id} does not exist in database`);
  }
};
