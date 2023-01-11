import express from 'express';
import {
	cuackPost,
	cuackPut,
	cuacksByID,
	cuacksByUser,
	cuackDelete,
	reportCuack,
	removeComment,
	removeRecuack,
	removeLike,
} from '../controllers';
import { validateJWT, compareJwtInfoAndParamID } from '../middlewares';
import { check } from 'express-validator';

const router = express.Router();

router.get('/u/:id', [check('id', 'Invalid ID').isMongoId()], cuacksByUser);

router.get('/c/:id', [check('id', 'Invalid ID').isMongoId()], cuacksByID);

router.post('/', [validateJWT], cuackPost);

router.put(
	'/:id',
	[validateJWT, check('id', 'Invalid ID').isMongoId(), compareJwtInfoAndParamID],
	cuackPut
);

router.put(
	'/r/:id',
	[validateJWT, check('id', 'Invalid ID').isMongoId(), compareJwtInfoAndParamID],
	reportCuack
);

router.put(
	'/d/:id',
	[validateJWT, check('id', 'Invalid ID').isMongoId(), compareJwtInfoAndParamID],
	cuackDelete
);

router.delete('/comment', [validateJWT], removeComment);

router.delete('/recuack', [validateJWT], removeRecuack);

router.delete('/like', [validateJWT], removeLike);

export default router;
