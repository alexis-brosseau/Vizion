import * as esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import * as fs from 'fs';
import * as path from 'path';
import { compileModule } from 'svelte/compiler';

const isWatch = process.argv.includes('--watch');

fs.mkdirSync(path.resolve('dist'), { recursive: true });
fs.mkdirSync(path.resolve('media'), { recursive: true });

/**
 * Custom esbuild plugin to compile `.svelte.ts` / `.svelte.js` rune modules
 * using Svelte 5's `compileModule`.
 * @type {esbuild.Plugin}
 */
const svelteRunesModulePlugin = {
  name: 'svelte-runes-module',
  setup(build) {
    build.onLoad({ filter: /\.svelte\.(ts|js)$/ }, async (args) => {
      const source = await fs.promises.readFile(args.path, 'utf8');
      const transpiled = await esbuild.transform(source, {
        loader: args.path.endsWith('.ts') ? 'ts' : 'js',
        target: 'es2022',
        tsconfigRaw: {
          compilerOptions: {
            useDefineForClassFields: false
          }
        }
      });
      const compiled = compileModule(transpiled.code, {
        filename: args.path,
        generate: 'client'
      });
      return {
        contents: compiled.js.code,
        loader: 'js'
      };
    });
  }
};

/** @type {esbuild.BuildOptions} */
const extensionBuildOptions = {
  entryPoints: ['src/extension/activate.ts'],
  bundle: true,
  outfile: 'dist/extension.cjs',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  mainFields: ['module', 'main'],
  target: 'node20',
  sourcemap: true,
  logLevel: 'info'
};

/** @type {esbuild.BuildOptions} */
const webviewBuildOptions = {
  entryPoints: ['src/webview/main.ts'],
  bundle: true,
  outfile: 'media/webview.js',
  format: 'iife',
  platform: 'browser',
  mainFields: ['svelte', 'browser', 'module', 'main'],
  target: 'es2022',
  conditions: ['svelte', 'browser'],
  sourcemap: true,
  logLevel: 'info',
  plugins: [
    svelteRunesModulePlugin,
    sveltePlugin({
      compilerOptions: {
        runes: true,
        css: 'external'
      }
    })
  ]
};

async function run() {
  if (isWatch) {
    const extCtx = await esbuild.context(extensionBuildOptions);
    const webCtx = await esbuild.context(webviewBuildOptions);
    await Promise.all([extCtx.watch(), webCtx.watch()]);
    console.log('Watching extension and Svelte 5 webview bundles...');
  } else {
    await Promise.all([
      esbuild.build(extensionBuildOptions),
      esbuild.build(webviewBuildOptions)
    ]);
    console.log('Built dist/extension.cjs and media/webview.{js,css} successfully.');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

