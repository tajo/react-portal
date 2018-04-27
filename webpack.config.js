const path = require('path');
const webpack = require('webpack');

const ENV = process.env.NODE_ENV;

module.exports = {
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, './lib', process.env.BABEL_ENV),
    filename: 'index.js',
    library: 'reactPortal',
    libraryTarget: process.env.BABEL_ENV
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
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
    process.env.NODE_ENV === 'production'
      ? new webpack.optimize.UglifyJsPlugin()
      : null
  ].filter(Boolean)
};
