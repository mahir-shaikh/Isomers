var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const APP_STORAGE_PREFIX = process.env.APP_STORAGE_PREFIX = process.env.APP_STORAGE_PREFIX = 'tiaa_isomer';

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
const CONNECT_TO_PULSE = process.env.CONNECT_TO_PULSE = 'false';

const METADATA = {
  baseUrl: '/'
}

module.exports = {
  metadata: METADATA,
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['', '.js', '.ts', '.json'],
    root: helpers.root('src'),
    // remove other default values
    modulesDirectories: ['node_modules'],
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['ts', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])$/, loader: "file-loader" },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|otf)(\?^[v=].+)?$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },{
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  plugins: [
  
    new WebpackCleanupPlugin(),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'APP_STORAGE_PREFIX': JSON.stringify(APP_STORAGE_PREFIX),
        'ENV': JSON.stringify(ENV),
        'CONNECT_TO_PULSE': JSON.stringify(CONNECT_TO_PULSE)
      }
    })
  ]
};