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
} from '../controllers';
import { validateJWT } from '../middlewares';
// import { check } from 'express-validator';

const router = express.Router();

router.get('/', getAllCuacks);
router.post('/', [validateJWT], cuackPost);
router.delete('/:id', [validateJWT], deleteCuack);

// Agregando comentario - recuack - like
router.post('/c/:id', addComment);
router.post('/rc/:id', reCuack);
router.post('/l/:id', likeCuack);

// Eliminando comentario - recuack - like
router.delete('/c/:id', removeComment);
router.delete('/rc/:id', removeReCuack);
router.delete('/l/:id', removeLikeCuack);

// router.get('/u/:id', [check('id', 'Invalid ID').isMongoId()], cuacksByUser);

// router.get('/c/:id', [check('id', 'Invalid ID').isMongoId()], cuacksByID);

// router.put(
//   '/:id',
//   [
//     validateJWT,
//     check('id', 'Invalid ID').isMongoId(),
//     compareJwtInfoAndParamID,
//   ],
//   cuackPut
// );

// router.put(
//   '/r/:id',
//   [
//     validateJWT,
//     check('id', 'Invalid ID').isMongoId(),
//     compareJwtInfoAndParamID,
//   ],
//   reportCuack
// );

// router.put(
//   '/d/:id',
//   [
//     validateJWT,
//     check('id', 'Invalid ID').isMongoId(),
//     compareJwtInfoAndParamID,
//   ],
//   cuackDelete
// );

// router.delete('/comment', [validateJWT], removeComment);

// router.delete('/recuack', [validateJWT], removeRecuack);

// router.delete('/like', [validateJWT], removeLike);

export default router;
