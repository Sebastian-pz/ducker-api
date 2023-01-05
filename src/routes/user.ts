import express from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateField';
import { existEmail, existNickName, existUser } from '../middlewares/dbMiddlewares';
import { userPost, usersGet, userID, usersPut, userDelete } from '../controllers/userController';
//import * as exampleServices from '../services/example';
import { validateJWT } from '../middlewares/validateJWT';

const router = express.Router();

router.get('/', usersGet);

router.get(
	'/:id',
	[
		check('id', 'Invalid ID').isMongoId(),
		check('id').custom(existUser),
		check('role', 'This role is not allowed ').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		validateFields,
	],
	userID
);

router.post(
	'/',
	[
		validateJWT,
		check('email', 'Invalid email :D').isEmail(),
		check('email').custom(existEmail),
		check('fullname', 'Full name is required').not().isEmpty(),
		check('nickname', 'Nick name is required').not().isEmpty(),
		check('nickname').custom(existNickName),
		check('password', 'password is required and its length needs to be more than 6').isLength({
			min: 6,
		}),
		check('role', 'This role is not allowed ').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		validateFields,
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
	[check('id', 'Invalid ID').isMongoId(), check('id').custom(existUser), validateFields],
	userDelete
);

export default router;
