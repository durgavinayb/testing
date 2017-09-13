var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

var basePath = __dirname;

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },

  entry: {
    app: './index.tsx',
    styles: [
      './css/site.css',
      '../node_modules/toastr/build/toastr.css',
      '../node_modules/bootstrap/dist/css/bootstrap.css'
    ],

    vendor: [
      'react-router',
      'redux',
      'redux-thunk',
      "react-swipeable-views",
      "react-bootstrap"
    ],
    vendor1: [
      'underscore',
      'object-assign',
      "isomorphic-fetch",
      "es6-promise"
    ],
    vendor2: [
      'react',
      'react-dom'
    ],
  },

  output: {
    path: path.join(basePath, "dist"),
    publicPath: '/dist/',
    filename: '[name].[hash].js'
  },

  devtool: 'source-map',

  module: {
		loaders: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader')
      },
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
		]
	},
  plugins:[
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor1',
      chunks: ['app', "vendor", "vendor2"],
      filename: 'vendor1.js',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor2',
      chunks: ['app',  'vendor1'],
      filename: 'vendor2.js',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      filename: 'vendor.js',
      minChunks: Infinity
    }),

   //new webpack.optimize.DedupePlugin(),
   new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.ejs',
      template: '!!raw-loader!src/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
        screw_ie8: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false
      },
    }),
    new ExtractTextPlugin('bundle.[hash].css')
  ]
}
