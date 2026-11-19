// Product traits: the words the agent uses to say what a product is. They choose the typeface classes offered for the name.
import path from 'node:path';
import { readJson, ASSETS } from './util.js';

interface Entry { means: string }
interface Data { note: string; traits: Record<string, Entry>; kinds: Record<string, Entry> }
export const data = (): Data => readJson<Data>(path.join(ASSETS, 'traits.json'));
