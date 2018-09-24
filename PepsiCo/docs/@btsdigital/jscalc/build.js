var amd = require('rollup-plugin-amd');
var uglify = require('rollup-plugin-uglify');
var rollupNodeResolve = require('rollup-plugin-node-resolve');
var rollup = require('rollup');

rollup.rollup({
    input: 'scripts/jsCalc/jsCalc.js',
    plugins: [
        rollupNodeResolve(),
        amd()
    ],
    sourcemap: true
})
.then(bundle => {
  return bundle.write({
    format: 'umd',
    name: 'jsCalc',
    file: 'dist/jsCalc.src.js',
    sourcemap: true
  })
})
.then(() => {
  rollup.rollup({
    input: 'dist/jsCalc.src.js',
    plugins: [
      uglify({sourceMap: {}})
    ],
    sourcemap: true
  })
  .then(bundle => {
    bundle.write({
      format: 'umd',
      name: 'jsCalc',
      file: 'dist/jsCalc.min.js',
      sourcemap: true
    })
  })
})

