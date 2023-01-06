import User from '../models/user';

export const existEmail = async (email: string = '') => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Error(`Email ${email} already exists.`);
  }
};

export const existNickname = async (nickname: string = '') => {
  const user = await User.findOne({ nickname });
  if (user) {
    throw new Error(`${nickname} already exists.`);
  }
};

export const existUser = async (id: string = '') => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error(`User id: ${id} does not exist in database`);
  }
};
