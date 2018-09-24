let uglify = require('rollup-plugin-uglify');
let amd =  require('rollup-plugin-amd');

export default {
  input: 'src/index.js',
  external: ['numeral/numeral', 'moment/moment'],
  output: {
    file: 'dist/highcharts-formatter-plugin.min.js',
    format: 'umd'
  },
  paths: {
    'numeral/numeral': 'node_modules/numeral/numeral',
    'moment/moment': 'node_modules/moment/moment'
  },
  plugins: [ amd(), uglify() ]
};