import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

/**
 * validateJWT (async - express middleware) checks if json web token is valid
 * @param {Request} req req.header('authorization')
 * @param {Response} res
 * @param {NextFunction} next
 * @returns if is a valid jwt return next, else return status
 *  (407 | 401 | 500) and respective errors
 */
export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('authorization');
  if (!token)
    return res.status(407).send({ msg: 'You must be logged into do this.' });

  try {
    const privateKey: string | undefined = process.env.SECRETORPRIVATEKEY;
    if (!privateKey)
      throw Error('Environment variables not loaded (validateJWT)');
    // @ts-ignore
    const { id } = jwt.verify(token, privateKey);

    //Verify ID in DB
    const user = await User.findById(id);

    if (!user) return res.status(401).send({ msg: 'User not found' });

    //Verify user state
    if (!user.state) return res.status(401).send({ msg: 'User blocked' });
    req.user = user;
    return next();
  } catch (error) {
    console.log(`Internal server error validating JWT ${error}`);
    return res.status(500).send({ msg: 'Internal server error' });
  }
};

/**
 * compareJwtInfoAndParamID (async - express middleware) checks if jwt.id
 * and user's expected operation has the same id
 * @param {Request} req req.header('authorization') & req.params.id
 * @param {Response} res
 * @param {NextFunction} next
 * @returns if jwt and operation user id match return next,
 * else return status 401, response false & 'Token not match'
 */
export const compareJwtInfoAndParamID = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('authorization');

  const privateKey: string | undefined = process.env.SECRETORPRIVATEKEY;
  if (!privateKey)
    throw Error('Environment variables not loaded (validateJWT)');
  // @ts-ignore
  const { id } = jwt.verify(token, privateKey);

  if (req.params.id === id) return next();
  return res
    .status(401)
    .send({ response: false, msg: 'Token not match param id' });
};

// Vendo empanadas
