import { validationResult } from 'express-validator';
import { Response, Request, NextFunction } from 'express';
import { noBanWords, noSpecialCharacters } from './utils/fields';

/**
 * validateFields (express middleware) checks if error list is empty
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns if error list is empty return next, else return status 400 and send errors
 */
export const validateFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors);
  }
  return next();
};

/**
 * validatePassword (express middleware) checks if password is valid (does not have any special characters)
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns if is a valid password return next, else return status 400 and send errors
 */
export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  if (!password) return res.status(400).send({ error: 'Missing password' });
  if (noSpecialCharacters(password)) return next();

  return res.status(400).send({
    errors: [
      {
        value: password,
        msg: `password ${password} is not valid`,
        param: 'password',
        location: 'body',
      },
    ],
  });
};

/**
 * validateNickname (express middleware) checks if nickname is valid (does not have any special characters and no ban words)
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns if is a valid nickname return next, else return status 400 and send errors
 */
export const validateNickname = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { nickname } = req.body;

  if (noSpecialCharacters(nickname) && noBanWords(nickname)) return next();

  const errors = [];
  if (!noSpecialCharacters(nickname)) {
    errors.push({
      value: nickname,
      msg: `nickname ${nickname} contains special characters`,
      param: 'nickname',
      location: 'body',
    });
  }

  if (!noBanWords(nickname)) {
    errors.push({
      value: nickname,
      msg: `nickname ${nickname} contains ban words`,
      param: 'nickname',
      location: 'body',
    });
  }

  return res.status(400).send({ errors });
};
