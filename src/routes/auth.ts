import { Router } from 'express';
import { check } from 'express-validator';
import { login, googleSignIn } from '../controllers';
import { validateFields } from '../middlewares';

const router = Router();

router.post(
  '/',
  [
    check('email', 'Please, send a valid email.').isEmail(),
    check('password', 'The password is required.').not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  '/google',
  [
    check('id_token', 'Token de Google es requerido').not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);
export default router;
