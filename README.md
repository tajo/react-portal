React-portal
============

[![Dependency Status](https://david-dm.org/steida/este.png)](https://david-dm.org/tajo/react-portal)
[![devDependency Status](https://david-dm.org/steida/este/dev-status.png)](https://david-dm.org/tajo/react-portal#info=devDependencies)

> Struggling with modals, lightboxes or loading bars in React? Look no further. This is the component that will help you.

## Features

- transports its child into a new React component and appends it to the **document.body**
- propagates all props
- can be opened by the prop **isOpened**
- can be opened after click on an element that you pass through the prop **openByClickOn** (and then it takes care of the state)
- doesn't leave any mess after closing
- provides its child with **this.props.closePortal** callback
- provides **close on ESC** and **close on outside mouse click** out of the box (see the docs)

## Demo

Try [http://portal.miksu.cz](http://portal.miksu.cz) (`/examples/index.html`)

## Installation

```shell
npm install react-portal --save
```

## Usage
```javascript
var React = require('react');
var Portal = require('react-portal');

var App = React.createClass({

  render: function() {
    var button1 = <button>Open portal with pseudo modal</button>;

    return (
      <Portal openByClickOn={button1} closeOnEsc={true} closeOnOutsideClick={true}>
        <PseudoModal>
          <h2>Pseudo Modal</h2>
          <p>This react component is appended to the document body.</p>
        </PseudoModal>
      </Portal>
    );
  }

});

var PseudoModal = React.createClass({

  render: function() {
    return (
      <div>
        {this.props.children}
        <p><button onClick={this.props.closePortal}>Close this</button></p>
      </div>
    );
  }

});

React.render(React.createElement(App), document.getElementById('react-body'));
```
## Documentation - props

#### children : ReactElement (required)
The Portal expects one child (`<Portal><Child ... /></Portal>`) that will be ported.

#### isOpened : bool (optional)
If true, the portal is open. If false, the portal is closed. It's up to you to take
care of the closing (aka taking care of the state).

#### openByClickOn : ReactElement (optional)
The second way how to open the portal. This element will be rendered by the portal immediately
with `onClick = open portal`. How to close the portal then? It provides its child with
the callback `this.props.closePortal`. Or you can use built-in portal closing (see bellow).
Notice that you don't have to deal with the state (like when using the `isOpened` prop).

#### closeOnEsc: bool (optional)
If true, the portal can be closed by the key ESC.

#### closeOnOutsideClick: bool (optional)
If true, the portal can be closed by the outside mouse click.

## Contribution

Please, create issues and pull requests.

```shell
git clone https://github.com/tajo/react-portal
cd react-portal
npm install
npm run dev
```

## Credits

Vojtech Miksu 2015, [miksu.cz](https://miksu.cz), [@vmiksu](https://twitter.com/vmiksu)