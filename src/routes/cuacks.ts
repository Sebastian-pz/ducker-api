import express from 'express';
//import { check } from 'express-validator';
//import { validateFields } from '../middlewares/validateField';
import { cuackPost, cuackPut } from '../controllers/cuackController';
import { validateJWT } from '../middlewares/validateJWT';

const router = express.Router();

router.get('/');
router.get('/:id');
router.post('/', [validateJWT], cuackPost);
router.put('/:id', [validateJWT], cuackPut);
router.delete('/:id');

export default router;
