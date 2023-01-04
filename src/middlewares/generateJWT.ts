import jwt from 'jsonwebtoken';

export const generateJWT = (id = '') => {
	return new Promise((resolve, reject) => {
		const payload = { id };
		const key: string | undefined = process.env.SECRETORPRIVATEKEY;
		if (!key) throw Error(`Valiendo madres, no estoy leyendo el secret key del JWT`);

		jwt.sign(
			payload,
			key,
			{
				expiresIn: '4h',
			},

			(err: Error | null, token: string | undefined) => {
				if (err) {
					console.log(err);
					reject('JSON web token is not generated.');
				} else {
					resolve(token);
				}
			}
		);
	});
};
// jsonwebtoken
