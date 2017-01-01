/* global process */

var webpack = require('webpack');

module.exports = {
  entry: './src/app.js',
  output: {
    path: './dist',
    filename: './app.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.html$/,
        loader: 'file',
        query: {
          name: '[name].[ext]'
        }
      },
      { test: /\.(png|jpg|svg|ico)$/, loader: 'file?name=[name].[ext]' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.html', 'png', 'jpg', 'svg', 'ico']
  }
};
