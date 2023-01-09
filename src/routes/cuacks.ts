import express from 'express';
import {
  cuackPost,
  cuackPut,
  cuacksByID,
  cuacksByUser,
  cuackDelete,
} from '../controllers/cuacks';
import {
  compareJwtInfoAndParamID,
  validateJWT,
} from '../middlewares/validateJWT';
import { check } from 'express-validator';

const router = express.Router();

router.get('/u/:id', [check('id', 'Invalid ID').isMongoId()], cuacksByUser);

router.get('/c/:id', [check('id', 'Invalid ID').isMongoId()], cuacksByID);

router.post('/', [validateJWT], cuackPost);

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    compareJwtInfoAndParamID,
  ],
  cuackPut
);

router.put(
  '/d/:id',
  [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    compareJwtInfoAndParamID,
  ],
  cuackDelete
);

export default router;
