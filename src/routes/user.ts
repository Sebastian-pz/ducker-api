import express from 'express';
import { check } from 'express-validator';
import { delNot, usersMailsAndNicknames } from '../controllers/user';
import {
  validateFields,
  validateNickname,
  validatePassword,
  validateJWT,
  existEmail,
  existNickname,
  existUser,
  compareJwtInfoAndParamID,
} from '../middlewares';

import {
  usersGet,
  userPost,
  userID,
  usersPut,
  userDelete,
  userFollowing,
  userFollowers,
  userSilenced,
  userBlocked,
  userUnfollowing,
  userRemoveSilenced,
  userRemoveBlocked,
  queryUsers,
  bulkCreate,
  readNot,
} from '../controllers';

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
    validateNickname,
  ],
  userPost
);

router.post('/dev/bulkCreate', bulkCreate);

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
    compareJwtInfoAndParamID,
    validateFields,
  ],
  usersPut
);

router.delete(
  '/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
    compareJwtInfoAndParamID,
    validateFields,
  ],
  userDelete
);

router.put(
  '/follow/:idUserOne',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
  ],
  userFollowing
);

router.put(
  '/unfollow/:idUserOne',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
  ],
  userUnfollowing
);

router.put(
  '/followers/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
  ],
  userFollowers
);

router.put(
  '/mute/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
  ],
  userSilenced
);

router.put(
  '/unmute/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
  ],
  userRemoveSilenced
);

router.put(
  '/block/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
  ],
  userBlocked
);

router.put(
  '/unblock/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existUser),
  ],
  userRemoveBlocked
);

// Notificaciones
router.put('/n/:id', readNot);
router.delete('/n/:id', delNot);

router.get('/all/mails', usersMailsAndNicknames);

router.get('/autocomplete/:nickname', queryUsers);

// Mati ama bad bunny

export default router;
