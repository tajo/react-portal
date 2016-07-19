import setup from './setup';

process.env.NODE_ENV = 'test';
// Calling setup befere any components are imported in specs
// Otherwise window object can not be used in static methods
setup();
