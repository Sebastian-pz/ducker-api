import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  return res.status(200).send({ response: 'Working good!' });
});

export default router;
