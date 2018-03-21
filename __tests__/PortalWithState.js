import React from 'react';
import ReactDOM from 'react-dom';
import ifReact from 'enzyme-adapter-react-helper/build/ifReact';
import PortalWithState from '../src/PortalWithState';

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  document.body.innerHTML = '';
});

ifReact('>= 16', test, test.skip)('should not mount portal by default', () => {
  ReactDOM.render(
    <PortalWithState>{({ portal }) => portal('Foo')}</PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
  expect(document.body.lastChild.outerHTML).toBe(
    document.body.lastChild.outerHTML
  );
});

ifReact('< 16', test, test.skip)('should not mount portal by default', () => {
  ReactDOM.render(
    <PortalWithState>{({ portal }) => portal('Foo')}</PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe(
    '<div id="root"><!-- react-empty: 1 --></div>'
  );
  expect(document.body.lastChild.outerHTML).toBe(
    document.body.lastChild.outerHTML
  );
});

ifReact(
  '>= 16',
  test,
  test.skip
)('should mount portal by default with defaultOpen', () => {
  ReactDOM.render(
    <PortalWithState defaultOpen>
      {({ portal }) => portal('Foo')}
    </PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe('<div id="root"></div>');
  expect(document.body.lastChild.outerHTML).toBe('<div>Foo</div>');
});

ifReact(
  '< 16',
  test,
  test.skip
)('should mount portal by default with defaultOpen', () => {
  ReactDOM.render(
    <PortalWithState defaultOpen>
      {({ portal }) => portal(<div>Foo</div>)}
    </PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe(
    '<div id="root"><!-- react-empty: 1 --></div>'
  );
  expect(document.body.lastChild.outerHTML).toBe(
    '<div><div data-reactroot="">Foo</div></div>'
  );
});

ifReact('>= 16', test, test.skip)(
  'should open portal after calling openPortal',
  () => {
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
  }
);

ifReact('< 16', test, test.skip)(
  'should open portal after calling openPortal',
  () => {
    ReactDOM.render(
      <PortalWithState>
        {({ portal, openPortal }) => (
          <div>
            <button key="trigger" id="trigger" onClick={openPortal}>
              Open
            </button>
            {portal(<div>Foo</div>)}
          </div>
        )}
      </PortalWithState>,
      document.getElementById('root')
    );

    expect(document.body.firstChild.outerHTML).toBe(
      '<div id="root"><div data-reactroot=""><button id="trigger">Open</button></div></div>'
    );

    expect(document.body.lastChild.outerHTML).toBe(
      document.body.firstChild.outerHTML
    );

    document.getElementById('trigger').click();

    expect(document.body.lastChild.outerHTML).toBe(
      '<div><div data-reactroot="">Foo</div></div>'
    );
  }
);

ifReact(
  '>= 16',
  test,
  test.skip
)('should close portal after calling closePortal', () => {
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

ifReact(
  '< 16',
  test,
  test.skip
)('should close portal after calling closePortal', () => {
  ReactDOM.render(
    <PortalWithState defaultOpen>
      {({ portal, closePortal }) => (
        <div>
          <button key="trigger" id="trigger" onClick={closePortal}>
            Close
          </button>
          {portal(<div>Foo</div>)}
        </div>
      )}
    </PortalWithState>,
    document.getElementById('root')
  );
  expect(document.body.firstChild.outerHTML).toBe(
    '<div id="root"><div data-reactroot=""><button id="trigger">Close</button><!-- react-empty: 3 --></div></div>'
  );
  expect(document.body.lastChild.outerHTML).toBe(
    '<div><div data-reactroot="">Foo</div></div>'
  );
  document.getElementById('trigger').click();
  expect(document.body.lastChild.outerHTML).toBe(
    document.body.firstChild.outerHTML
  );
});
