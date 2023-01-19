import jwt from 'jsonwebtoken';

/**
 * generateJWT (async) tries to generate a json web token using a specific user id
 * @param {String} id
 * @returns jwt / error
 */
export const generateJWT = (id: string = '') => {
  return new Promise((resolve, reject) => {
    const payload = { id };
    const key: string | undefined = process.env.SECRETORPRIVATEKEY;
    if (!key) throw Error(`Env var not loaded`);

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
