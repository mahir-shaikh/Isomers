import amd from 'rollup-plugin-amd';
import uglify from 'rollup-plugin-uglify';
import rollupNodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'scripts/jsCalc/jsCalc.js',
    plugins: [
        rollupNodeResolve(),
        amd(),
        uglify()
    ],
    output: {
      format: 'umd',
      name: 'jsCalc',
      file: 'dist/jsCalc.min.js'
    },
    sourcemap: true
};