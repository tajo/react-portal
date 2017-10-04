const path = require('path');
const webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'production';

module.exports = {
  entry: ['./examples/index'],
  output: {
    path: path.join(__dirname, './build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
