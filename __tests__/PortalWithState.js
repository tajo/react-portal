import React from 'react';
import ReactDOM from 'react-dom';
import PortalWithState from '../src/PortalWithState';

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  document.body.innerHTML = '';
});

test('should not mount portal by default', () => {
  ReactDOM.render(
    <PortalWithState>{({ portal }) => portal('Foo')}</PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
  expect(document.body.lastChild.outerHTML).toBe(
    document.body.lastChild.outerHTML
  );
});

test('should mount portal by default with defaultOpen', () => {
  ReactDOM.render(
    <PortalWithState defaultOpen>
      {({ portal }) => portal('Foo')}
    </PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
  expect(document.body.lastChild.outerHTML).toBe('<div>Foo</div>');
});

test('should open portal after calling openPortal', () => {
  ReactDOM.render(
    <PortalWithState>
      {({ portal, openPortal }) => [
        <button key="trigger" id="trigger" onClick={openPortal}>
          Open
        </button>,
        portal('Foo')
      ]}
    </PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe(
    '<div id="root"><button id="trigger">Open</button></div>'
  );
  expect(document.body.lastChild.outerHTML).toBe(
    document.body.firstChild.outerHTML
  );
  document.getElementById('trigger').click();
  expect(document.body.lastChild.outerHTML).toBe('<div>Foo</div>');
});

test('should close portal after calling closePortal', () => {
  ReactDOM.render(
    <PortalWithState defaultOpen>
      {({ portal, closePortal }) => [
        <button key="trigger" id="trigger" onClick={closePortal}>
          Close
        </button>,
        portal('Foo')
      ]}
    </PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe(
    '<div id="root"><button id="trigger">Close</button></div>'
  );
  expect(document.body.lastChild.outerHTML).toBe('<div>Foo</div>');
  document.getElementById('trigger').click();
  expect(document.body.lastChild.outerHTML).toBe(
    document.body.firstChild.outerHTML
  );
});

