import React from 'react';
import ReactDOM from 'react-dom';
import ifReact from 'enzyme-adapter-react-helper/build/ifReact';
import Portal from '../src/PortalCompat';

afterEach(() => {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  document.body.innerHTML = '';
});

ifReact('>= 16', test, test.skip)(
  'should append portal to the document.body',
  () => {
    document.body.innerHTML = '<div id="root"></div>';
    ReactDOM.render(<Portal>Foo</Portal>, document.getElementById('root'));
    expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
    expect(document.body.lastChild.outerHTML).toBe('<div>Foo</div>');
  }
);

ifReact('< 16', test, test.skip)(
  'should append portal to the document.body',
  () => {
    document.body.innerHTML = '<div id="root"></div>';
    ReactDOM.render(
      <Portal>
        <div>Foo</div>
      </Portal>,
      document.getElementById('root')
    );
    expect(document.body.firstChild.outerHTML).toBe(
      '<div id="root"><!-- react-empty: 1 --></div>'
    );
    expect(document.body.lastChild.outerHTML).toBe(
      '<div><div data-reactroot="">Foo</div></div>'
    );
  }
);

ifReact('>= 16', test, test.skip)(
  'should append portal to a custom node',
  () => {
    document.body.innerHTML = '<div id="root"></div><div id="custom"></div>';
    ReactDOM.render(
      <Portal node={document.getElementById('custom')}>Foo</Portal>,
      document.getElementById('root')
    );
    expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
    expect(document.getElementById('custom').outerHTML).toBe(
      '<div id="custom">Foo</div>'
    );
  }
);

ifReact(
  '>= 16',
  describe,
  describe.skip
)('can specify another portalRoot than document.body', () => {
  let portalRoot;
  beforeAll(() => {
    portalRoot = document.createElement('div');
    Portal.portalRoot = portalRoot;
  });

  afterAll(() => {
    Portal.portalRoot = document.body;
  });

  test('should render portal to the given element', () => {
    document.body.innerHTML = '<div id="root"></div>';
    ReactDOM.render(<Portal>Foo</Portal>, document.getElementById('root'));
    expect(document.getElementById('root').outerHTML).toBe(
      '<div id="root"></div>'
    );
    expect(portalRoot.outerHTML).toBe('<div><div>Foo</div></div>');
  });

  test('should remove the portal even if portalRoot has changed', () => {
    document.body.innerHTML = '<div id="root"></div>';
    ReactDOM.render(<Portal>Foo</Portal>, document.getElementById('root'));
    Portal.portalRoot = document.body;
    ReactDOM.render(null, document.getElementById('root'));
    expect(portalRoot.outerHTML).toBe('<div></div>');
  });
});

ifReact(
  '< 16',
  describe,
  describe.skip
)('specifying another portalRoot than document.body', () => {
  let portalRoot;
  beforeEach(() => {
    portalRoot = document.createElement('div');
    document.body.appendChild(portalRoot);
    Portal.portalRoot = portalRoot;
  });

  afterAll(() => {
    portalRoot.parentNode.removeChild(portalRoot);
    Portal.portalRoot = document.body;
  });

  test('should render portal to the given element', () => {
    document.body.innerHTML = '<div id="root"></div>';
    ReactDOM.render(
      <Portal>
        <div>Foo</div>
      </Portal>,
      document.getElementById('root')
    );
    expect(document.getElementById('root').outerHTML).toBe(
      '<div id="root"><!-- react-empty: 1 --></div>'
    );
    expect(portalRoot.outerHTML).toBe(
      '<div><div><div data-reactroot="">Foo</div></div></div>'
    );
  });

  test('should remove the portal even if portalRoot has changed', () => {
    document.body.innerHTML = '<div id="root"></div>';
    ReactDOM.render(
      <Portal>
        <div>Foo</div>
      </Portal>,
      document.getElementById('root')
    );
    Portal.portalRoot = document.body;
    ReactDOM.render(
      <span className="empty" />,
      document.getElementById('root')
    );
    expect(portalRoot.outerHTML).toBe('<div></div>');
  });
});

ifReact('< 16', test, test.skip)(
  'should append portal to a custom element',
  () => {
    document.body.innerHTML = '<div id="root"></div><div id="custom"></div>';
    ReactDOM.render(
      <Portal node={document.getElementById('custom')}>
        <div>Foo</div>
      </Portal>,
      document.getElementById('root')
    );
    expect(document.body.firstChild.outerHTML).toBe(
      '<div id="root"><!-- react-empty: 1 --></div>'
    );
    expect(document.getElementById('custom').outerHTML).toBe(
      '<div id="custom"><div data-reactroot="">Foo</div></div>'
    );
  }
);

ifReact(
  '< 16',
  test,
  test.skip
)('should remove portal content from custom node', () => {
  document.body.innerHTML = '<div id="root"></div><div id="custom"></div>';
  ReactDOM.render(
    <Portal node={document.getElementById('custom')}>
      <div>Foo</div>
    </Portal>,
    document.getElementById('root')
  );
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  expect(document.getElementById('custom').innerHTML).toBe('');
});
