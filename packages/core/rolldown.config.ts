import { defineConfig } from 'rolldown';
import { isolatedDeclaration } from 'unplugin-isolated-decl/rolldown';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [isolatedDeclaration()],
});
