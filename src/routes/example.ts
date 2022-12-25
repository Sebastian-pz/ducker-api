import express from 'express';
import * as exampleServices from '../services/example';

// Funtions section

const router = express.Router();

// Response status -> https://restfulapi.net/http-methods/

router.get('/', (_req, res) => {
  const examples = exampleServices.getExamples();
  if (!examples) {
    return res.status(404).send({ response: 'Not found' });
  }

  return res.status(200).send(examples);
});

export default router;
