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
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name].[contenthash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'CONNECT_TO_PULSE': JSON.stringify(CONNECT_TO_PULSE)
      }
    }),
    new CopyWebpackPlugin([
      {from: 'assets/data/**/*'},
      {from: 'assets/fonts/**/*'},
      {from: 'assets/images/**/*'},
      {from: 'assets/videos/**/*'},
      {from: 'assets/userguide.pdf'},
      {from: 'config/nwjs-package.json', to: 'package.json'},
      {from: 'login/**'},
      {from: 'assets/favicon.ico'}
    ])
  ]
});