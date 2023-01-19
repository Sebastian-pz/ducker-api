import bcrypt from 'bcrypt';

/**
 * generatePass (async) tries to generate a password
 * @param {String} fullname
 * @returns jwt / error
 */
export const generatePass = (fullname: string): string => {
	let password: string = '';

	const [name, lastname] = fullname.trim().split(' ');

	while (password.length < 8) {
		let charA = name[Math.floor(Math.random() * name.length - 1)];
		let charB = name[Math.floor(Math.random() * lastname.length - 1)];

		password += charA;
		password += charB;
	}
	const salt = bcrypt.genSaltSync();
	return bcrypt.hashSync(password, salt);
};

/**
 * generateNickname (async) tries to generate a nickname
 * @param {String} fullname
 * @returns jwt / error
 */
export const generateNickname = (fullname: string): string => {
	const [name, lastname] = fullname.trim().split(' ');
	const max = 10000;
	return `@${name}${lastname[0]}${lastname[lastname.length - 1]}${Math.floor(
		Math.random() * max
	)}`.toLowerCase();
};
