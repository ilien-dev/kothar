// Product traits: the words the agent uses to say what a product is. They choose the typeface classes offered for the name.
import path from 'node:path';
import { readJson, ASSETS } from './util.js';
export const data = () => readJson(path.join(ASSETS, 'traits.json'));
