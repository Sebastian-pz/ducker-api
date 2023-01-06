import express from 'express';
import { cuackPost, cuackPut } from '../controllers/cuacks';
import { validateJWT } from '../middlewares/validateJWT';

const router = express.Router();

router.get('/');
router.get('/:id');
router.post('/', [validateJWT], cuackPost);
router.put('/:id', [validateJWT], cuackPut);
router.delete('/:id');

export default router;
