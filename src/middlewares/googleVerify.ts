import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleVerify = async (idToken = '') => {
	const ticket = await client.verifyIdToken({
		idToken,
		audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	});

	// !Interface
	const { name: fullname, picture: img, email }: any = ticket.getPayload();

	return { fullname, img, email };
};
