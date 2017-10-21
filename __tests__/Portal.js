import React from 'react';
import ReactDOM from 'react-dom';
import Portal from '../src/Portal';

afterEach(() => {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  document.body.innerHTML = '';
});

test('should append portal to the document.body', () => {
  document.body.innerHTML = '<div id="root"></div>';
  ReactDOM.render(<Portal>Foo</Portal>, document.getElementById('root'));
  expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
  expect(document.body.lastChild.outerHTML).toBe('<div>Foo</div>');
});

test('should append portal to a custom element', () => {
  document.body.innerHTML = '<div id="root"></div><div id="custom"></div>';
  ReactDOM.render(
    <Portal node={document.getElementById('custom')}>Foo</Portal>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
  expect(document.getElementById('custom').outerHTML).toBe(
    '<div id="custom">Foo</div>'
  );
});
