import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * googleVerify (async) checks if a google token is valid
 * @param {String} idToken
 * @returns object with token info
 */
export const googleVerify = async (idToken: string = '') => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  // !Interface
  const { name: fullname, picture: img, email }: any = ticket.getPayload();
  return { fullname, img, email };
};
