import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, copyFileSync } from 'fs';

// Get all TypeScript files from src directory (excluding .d.ts files)
const srcFiles = readdirSync(resolve(__dirname, 'src'))
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'))
  .reduce(
    (entries, file) => {
      const name = file.replace('.ts', '');
      entries[name] = resolve(__dirname, 'src', file);
      return entries;
    },
    {} as Record<string, string>,
  );

export default defineConfig({
  build: {
    lib: {
      entry: srcFiles,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const dir = format === 'es' ? 'esm' : 'cjs';
        return `${dir}/${entryName}.js`;
      },
    },
    outDir: 'build',
    sourcemap: true,
    target: 'es2022',
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      external: [
        '@elastic/elasticsearch',
        'cloudinary',
        'express',
        'http-status-codes',
        'jsonwebtoken',
        'mongoose',
        'winston',
        'winston-elasticsearch',
        /^node:.*/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  plugins: [
    {
      name: 'copy-package-json',
      closeBundle() {
        copyFileSync('package.json', 'build/package.json');
      },
    },
  ],
});
