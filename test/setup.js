import jsdom from 'jsdom';

export default function setup() {
  global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
  global.window = document.defaultView;
  global.navigator = { userAgent: 'node.js' };
}
