import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await esbuild.build({
  entryPoints: [resolve(__dirname, 'src/server.ts')],
  bundle: true,
  outdir: resolve(__dirname, 'dist'),
  platform: 'node',
  target: 'node20',
  format: 'esm',
  sourcemap: true,
  minify: false,
  external: ['express', 'mongoose', 'cors', 'dotenv', 'bcryptjs', 'jsonwebtoken', 'multer'],
}); 