import express from 'express';
import { check } from 'express-validator';
import { validateFields, validatePassword } from '../middlewares/validateField';
import { existEmail, existNickname, existUser } from '../middlewares/db';
import {
  userPost,
  usersGet,
  userID,
  usersPut,
  userDelete,
} from '../controllers/user';

import { validateJWT } from '../middlewares/validateJWT';

const router = express.Router();

router.get('/', usersGet);

router.get(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
    validateFields,
  ],
  userID
);

router.post(
  '/',
  [
    check('email', 'Invalid email :D').isEmail(),
    check('email').custom(existEmail),
    check('fullname', 'Full name is required').not().isEmpty(),
    check('nickname', 'Nick name is required').not().isEmpty(),
    check('nickname').custom(existNickname),
    check(
      'password',
      'password is required and its length needs to be more than 6'
    ).isLength({
      min: 6,
    }),
    validateFields,
    validatePassword,
  ],
  userPost
);

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
    validateFields,
  ],
  usersPut
);

router.delete(
  '/:id',
  [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
    validateFields,
  ],
  userDelete
);

export default router;
