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
} from '../controllers';
import { validateJWT } from '../middlewares';

const router = express.Router();

router.get('/', getAllCuacks);
router.get('/ccu/:id', getCustomCuacks);
router.post('/', [validateJWT], cuackPost);
router.delete('/:id', [validateJWT], deleteCuack);

// Agregando comentario - recuack - like
router.post('/c/:id', [validateJWT], addComment);
router.post('/rc/:id', [validateJWT], reCuack);
router.post('/l/:id', [validateJWT], likeCuack);

// Eliminando comentario - recuack - like
router.delete('/c/:id', [validateJWT], removeComment);
router.delete('/rc/:id', [validateJWT], removeReCuack);
router.delete('/l/:id', [validateJWT], removeLikeCuack);

export default router;
