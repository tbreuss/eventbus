let { terser } = require('rollup-plugin-terser');

module.exports = [
  // node
  {
    input: 'src/eventbus.js',
    output: {
      file: 'dist/eventbus.cjs.js',
      format: 'cjs',
    }
  },
  // browser esm
  {
    input: 'src/eventbus.js',
    output: {
      file: 'dist/eventbus.esm.js',
      format: 'esm'
    }
  },
  // browser esm minified
  {
    input: 'src/eventbus.js',
    output: {
      file: 'dist/eventbus.esm.min.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [terser({sourcemap: true})]
  }
];