import express from 'express';
import {
	cuackPost,
	getAllCuacks,
	deleteCuack,
	addComment,
	reCuack,
	likeCuack,
	removeLikeCuack,
	removeReCuack,
	removeComment,
	getCustomCuacks,
	getCuacksByUserId,
	getCuackByid,
} from '../controllers';
import { validateJWT } from '../middlewares';

const router = express.Router();

router.get('/', getAllCuacks);
router.get('/u/:id', [validateJWT], getCuacksByUserId);
router.get('/ccu/:id', getCustomCuacks);
router.get('/cuack/:id', [validateJWT], getCuackByid);
router.post('/', [validateJWT], cuackPost);
router.put('/:id', [validateJWT], deleteCuack);

// Agregando comentario - recuack - like
router.post('/c/:id', [validateJWT], addComment);
router.post('/rc/:id', [validateJWT], reCuack);
router.post('/l/:id', [validateJWT], likeCuack);

// Eliminando comentario - recuack - like
router.put('/c/:id', [validateJWT], removeComment);
router.put('/rc/:id', [validateJWT], removeReCuack);
router.put('/l/:id', [validateJWT], removeLikeCuack);

export default router;
