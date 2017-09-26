import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './index';

console.log(ReactDOMServer.renderToString(<App />));
