import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.dev.babel';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';

const app = express();
const compiler = webpack(config);

app.use(webpackDev(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

app.use(webpackHot(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'examples/index_dev.html'));
});


app.listen(3000, 'localhost', () => {
  console.log('Listening at http://localhost:3000'); // eslint-disable-line
});
