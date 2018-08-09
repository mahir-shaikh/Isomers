var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const CONNECT_TO_PULSE = process.env.CONNECT_TO_PULSE = 'true';
const CDN0LOCAL1LOCALHOST2 = process.env.CDN0LOCAL1LOCALHOST2 = 0; // pulse server env - if deployed on cdn + cloud pulse 0 // if deployed on local and pulse on same server + port = 1 // if deployed on localhost+port and pulse is localhost = 2 
const PULSE_CLOUD_HOSTNAME = process.env.PULSE_CLOUD_HOSTNAME = "isomer.btspulse.com"; // do not add protocol here - it is always set to use https in manifest
const LOGIN_FOLDER = (CDN0LOCAL1LOCALHOST2 !== 0) ? 'login-local' : 'login';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: (CDN0LOCAL1LOCALHOST2 === 1) ? helpers.root('dist-local') : helpers.root('dist'),
    publicPath: (CDN0LOCAL1LOCALHOST2 === 1) ? "/Amedisys/" : "/",
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
        'CONNECT_TO_PULSE': JSON.stringify(CONNECT_TO_PULSE),
        'CDN0LOCAL1LOCALHOST2': JSON.stringify(CDN0LOCAL1LOCALHOST2),
        'PULSE_CLOUD_HOSTNAME':JSON.stringify(PULSE_CLOUD_HOSTNAME)
      }
    }),
    new CopyWebpackPlugin([
      {from: 'assets/data/**/*'},
      // {from: 'assets/fonts/**/*'},
      {from: 'assets/images/**/*'},
      {from: 'assets/videos/**/*'},
      {from: 'assets/package.json', to: 'package.json'},
      {from: 'assets/favicon.ico'},
      {from: LOGIN_FOLDER, to: 'login'}
    ])
  ]
});

