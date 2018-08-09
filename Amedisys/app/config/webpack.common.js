var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var StylusLoaderPlugin = require('stylus-loader');
const { CheckerPlugin } = require('awesome-typescript-loader')
const APP_STORAGE_PREFIX = process.env.APP_STORAGE_PREFIX = process.env.APP_STORAGE_PREFIX = 'amedisys_isomer';

const METADATA = {
  baseUrl: '/'
}

module.exports = {

  entry: {
    'polyfills': './src/app/boot/polyfills.ts',
    'vendor': './src/app/boot/vendor.ts',
    'app': './src/app/main.ts'
  },

  resolve: {
    extensions: ['.js', '.ts', '.json', '.styl'],
    // remove other default values
    modules: [helpers.root('src'), 'node_modules'],
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])$/, use: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])$/, use: "file-loader" },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|otf)(\?^[v=].+)?$/,
        use: 'file-loader?name=assets/[name].[hash].[ext]'
      },{
        test: /\.styl$/,
        exclude: helpers.root('assets'),
        use: ['to-string-loader', 'css-loader', 'stylus-loader'],
      },{
        test: /\.styl$/,
        exclude: helpers.root('src', 'app'),
        use: ExtractTextPlugin.extract({ use: ['to-string-loader', 'css-loader', 'stylus-loader'] }),
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader'})
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      stylus: {
        preferPathResolver: 'webpack'
      }
    }),
  // Workaround for angular/angular#11580
    new CheckerPlugin(),
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),
    new WebpackCleanupPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'APP_STORAGE_PREFIX': JSON.stringify(APP_STORAGE_PREFIX)
      }
    })
  ]
};
