const path = require('path');
const tsconfigPaths = require('tsconfig-paths');

const tsconfig = require('./tsconfig.json');
const compilerOptions = tsconfig?.compilerOptions ?? {};
const { paths = {} } = compilerOptions;

const cleanupPaths = Object.fromEntries(
  Object.entries(paths).map(([alias, targetPaths]) => [alias, targetPaths.map(p => p.replace(/^\.\//, ''))])
);

tsconfigPaths.register({
  baseUrl: path.join(__dirname, 'dist'),
  paths: cleanupPaths,
});
