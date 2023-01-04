import User from '../models/user';

export const existEmail = async (email: string = '') => {
	const user = await User.findOne({ email });
	if (user) {
		throw new Error(`The email ${email} already exists.`);
	}
};

export const existNickName = async (nickname: string = '') => {
	const user = await User.findOne({ nickname });
	if (user) {
		throw new Error(`${nickname} already exists.`);
	}
};

export const existUser = async (id: string = '') => {
	const user = await User.findById(id);
	if (!user) {
		throw new Error(`The users ${id} don´t exists in database.`);
	}
};
