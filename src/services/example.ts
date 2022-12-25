import examples from './examples.json';

// Types section
import { Example } from '../types';

const EXAMPLES: Example[] = examples as Example[];

export const getExamples = (): Example[] => {
  return EXAMPLES;
};
