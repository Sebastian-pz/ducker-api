import bcrypt from 'bcrypt';
import User from '../models/user';
import { generateJWT } from '../middlewares/generateJWT';
import { Request, Response } from 'express';
import { googleVerify } from '../middlewares/googleVerify';
import { generatePass, generateNickname } from './utils';

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		//Verify email
		const user = await User.findOne({ email });
		if (!user) return res.status(400).send({ msg: `Email: ${email} is not registered.` });

		//Verifiy state
		if (user.state === false) return res.status(400).send({ msg: `User is not active.` });

		//Verify password
		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) return res.status(400).send({ msg: 'Wrong password.' });

		//Generate JWT
		const token = await generateJWT(user.id);
		return res.status(200).send({ user: user.id, token });
	} catch (error) {
		console.log(`Login internal server error ${error}`);
		return res.status(500).send({ msg: 'Internal server error' });
	}
};

export const googleSignIn = async (req: Request, res: Response) => {
	const { id_token } = req.body;

	try {
		const { email, fullname, img } = await googleVerify(id_token);
		let user = await User.findOne({ email });

		if (!user) {
			// Create in db
			const data = {
				fullname,
				email,
				password: generatePass(fullname),
				img,
				google: true,
				role: 'USER_ROLE',
				nickname: generateNickname(fullname),
			};

			user = new User(data);
			await user.save();
		}

		// Case blocked user
		if (!user.state) {
			return res.status(401).send({ msg: 'Call the admin, blocked User' });
		}

		// Generate JWT
		const token = await generateJWT(user.id);
		return res.status(201).send({ user: { id: user.id, email: user.email }, token });
	} catch (error) {
		console.log(`Google sign-in internal server error ${error}`);
		return res.status(500).send({ msg: 'Internal server error' });
	}
};
