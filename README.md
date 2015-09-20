React-portal
============
[![Dependency Status](https://david-dm.org/tajo/react-portal.svg)](https://david-dm.org/tajo/react-portal)
[![peerDependency Status](https://david-dm.org/tajo/react-portal/peer-status.svg)](https://david-dm.org/tajo/react-portal#info=peerDependencies)
[![devDependency Status](https://david-dm.org/tajo/react-portal/dev-status.svg)](https://david-dm.org/tajo/react-portal#info=devDependencies)
[![Build Status](https://travis-ci.org/tajo/react-portal.svg?branch=master)](https://travis-ci.org/tajo/react-portal)

> Struggling with modals, lightboxes or loading bars in React? Look no further. This is the component that will help you.

## Features

- transports its child into a new React component and appends it to the **document.body**
- can be opened by the prop **isOpened**
- can be opened after click on an element that you pass through the prop **openByClickOn** (and then it takes care of the state)
- doesn't leave any DOM mess after closing
- provides its child with **this.props.closePortal** callback
- provides **close on ESC** and **close on outside mouse click** out of the box (see the docs)

## Demo

Try [http://miksu.cz/react-portal](http://miksu.cz/react-portal)

Or `git clone http://github.com/tajo/react-portal` and open `/examples/index.html`

## Installation

```shell
npm install react react-dom --save
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

#### onClose: func (optional)
This callback is called when the portal closes.

## Tips & Tricks
- Does your modal have a fullscreen overlay and the `closeOnOutsideClick` doesn't work? [There is a simple solution](https://github.com/tajo/react-portal/issues/2#issuecomment-92058826).
- Does your inner inner component `<Portal><LevelOne><LevelTwo /></LevelOne></Portal>` also need an access to `this.props.closePortal()`? You can't just use `{this.props.children}` in `<LevelOne>` component. You need to clone it instead: `{React.cloneElement(this.props.children, {closePortal: this.props.closePortal})}`.

#### Don't read this
Please, skip this section if you dislike dirty tricks.

States make everything harder, right? We don't want to deal with them, right? But sometime you need to open a portal (e.g. modal) automatically. There is no button to click on. No problem, because the portal has the `isOpen` prop, so you can just set it `true` or `false`.

However, then it's completely up to you to take care about the open state. You have to write all the closing logic! And that sucks. But there is a dirty trick:

```javascript
<Portal openByClickOn={<span ref="myLittleSecret" />}>
  <Modal title="My modal">
    Modal content
  </Modal>
</Portal>
```

```javascript
findDOMNode(this.refs.myLittleSecret).click(); // opens the portal, yay!
```

I'll end up in hell. I know.

## Contribution

Please, create issues and pull requests.

```shell
git clone https://github.com/tajo/react-portal
cd react-portal
npm install
npm install react react-dom
gulp
```
- Copy&paste the address from terminal to your browser. (something like `http://localhost:8080`)
- Don't commit the main build `portal.js` (aka don't run `npm run build`)
- Run `gulp eslint` before every commit to preserve the coding style. Do you know there is a [nice real-time checking integration for your editor](http://eslint.org/docs/user-guide/integrations)? ;-)


## Credits

Inspired by the talk [React.js Conf 2015 - Hype!, Ryan Florence](https://www.youtube.com/watch?v=z5e7kWSHWTg)

Vojtech Miksu 2015, [miksu.cz](https://miksu.cz), [@vmiksu](https://twitter.com/vmiksu)
