import 'module-alias/register';
import { addAliases } from 'module-alias';
import * as path from 'path';

// Add aliases
addAliases({
  '@': path.join(__dirname),
  '@test': path.join(__dirname, '..', 'test')
}); 