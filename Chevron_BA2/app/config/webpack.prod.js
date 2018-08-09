var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const CONNECT_TO_PULSE = process.env.CONNECT_TO_PULSE = 'true';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].[chunkhash].map',
    chunkFilename: '[id].[chunkhash].js'
  },
  module: {
   rules: [
     {
       enforce: 'pre',
       test: /\.js$/,
       loader: "source-map-loader"
     },
     {
       enforce: 'pre',
       test: /\.tsx?$/,
       use: "source-map-loader"
     }
   ]
 },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
            ],
            customAttrAssign: [/\)?\]?=/]
          }
      },
      minimize: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({sourceMap: true, mangle: { keep_fnames: true }}),
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'CONNECT_TO_PULSE': JSON.stringify(CONNECT_TO_PULSE)
      }
    }),
    new CopyWebpackPlugin([
      {from: 'assets/data/**/*'},
      {from: 'assets/fonts/**/*'},
      {from: 'assets/docs/**/*'},
      {from: 'assets/images/**/*'},
      {from: 'assets/videos/**/*'},
      {from: 'config/nwjs-package.json', to: 'package.json'},
      {from: 'login/login.html', to: 'login.html'},
      {from: 'login/login/**', to: 'login'},
      {from: 'assets/favicon.ico'}
    ])
  ]
});
