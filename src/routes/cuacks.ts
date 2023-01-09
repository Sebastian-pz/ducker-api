import express from 'express';
import {
  cuackPost,
  cuackPut,
  cuacksByID,
  cuacksByUser,
  cuackDelete,
} from '../controllers';
import { validateJWT } from '../middlewares';
import { check } from 'express-validator';

const router = express.Router();

router.get('/u/:id', [check('id', 'Invalid ID').isMongoId()], cuacksByUser);

router.get('/c/:id', [check('id', 'Invalid ID').isMongoId()], cuacksByID);

router.post('/', [validateJWT], cuackPost);

router.put(
  '/:id',
  [validateJWT, check('id', 'Invalid ID').isMongoId()],
  cuackPut
);

router.put(
  '/d/:id',
  [validateJWT, check('id', 'Invalid ID').isMongoId()],
  cuackDelete
);

export default router;
