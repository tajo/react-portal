import React from 'react';
import ReactDOM from 'react-dom';
import Portal from '../src/Portal';

test('should append portal to the document.body', () => {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
  ReactDOM.render(<Portal>Foo</Portal>, document.getElementById('root'));
  expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
  expect(document.body.lastChild.outerHTML).toBe('<div>Foo</div>');
});

test('should append portal to a custom element', () => {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
  const customDiv = document.createElement('div');
  rootDiv.id = 'custom';
  document.body.appendChild(customDiv);
  ReactDOM.render(
    <Portal node={document.getElementById('custom')}>Foo</Portal>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
  expect(document.getElementById('custom').outerHTML).toBe(
    '<div id="custom">Foo</div>'
  );
});
