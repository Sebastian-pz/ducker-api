import { validationResult } from 'express-validator';
import { Response, Request, NextFunction } from 'express';

export const validateFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  return next();
};

export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  if (!password) return res.status(400).send({ error: 'Missing password' });

  const validation = [...password.matchAll(/[A-Za-z0-9]/g)];
  if (validation.length < password.length)
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
  return next();
};
