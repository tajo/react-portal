React-portal
============
[![Dependency Status](https://david-dm.org/tajo/react-portal.svg)](https://david-dm.org/tajo/react-portal)
[![peerDependency Status](https://david-dm.org/tajo/react-portal/peer-status.svg)](https://david-dm.org/tajo/react-portal#info=peerDependencies)
[![devDependency Status](https://david-dm.org/tajo/react-portal/dev-status.svg)](https://david-dm.org/tajo/react-portal#info=devDependencies)
[![Build Status](https://travis-ci.org/tajo/react-portal.svg?branch=master)](https://travis-ci.org/tajo/react-portal)

> Struggling with modals, lightboxes or loading bars in React? Look no further. React-portal creates a new top-level React tree and injects its child into it.

## Features

- transports its child into a new React component and appends it to the **document.body** (creates a new independent React tree)
- can be opened by the prop **isOpened**
- can be opened after a click on an element that you pass through the prop **openByClickOn** (and then it takes care of the open/close state)
- doesn't leave any mess in DOM after closing
- provides its child with **this.props.closePortal** callback
- provides **close on ESC** and **close on outside mouse click** out of the box
- supports absolute positioned components (great for tooltips)

## Demo

Try [http://miksu.cz/react-portal](http://miksu.cz/react-portal) **or**

```shell
git clone https://github.com/tajo/react-portal
```

and open

```
/examples/index.html
```

## Installation

```shell
npm install react react-dom react-portal --save
```

## Usage
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Portal from 'react-portal';

export default class App extends React.Component {

  render() {
    const button1 = <button>Open portal with pseudo modal</button>;

    return (
      <Portal closeOnEsc closeOnOutsideClick openByClickOn={button1}>
        <PseudoModal>
          <h2>Pseudo Modal</h2>
          <p>This react component is appended to the document body.</p>
        </PseudoModal>
      </Portal>
    );
  }

}

export class PseudoModal extends React.Component {

  render() {
    return (
      <div>
        {this.props.children}
        <p><button onClick={this.props.closePortal}>Close this</button></p>
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('react-body'));
```
## Documentation - props

#### children : ReactElement (required)
The portal expects one child (`<Portal><Child ... /></Portal>`) that will be ported.

#### isOpened : bool (optional)
If true, the portal is open. If false, the portal is closed. It's up to you to take care of the closing (aka taking care of the state). Don't use this prop if you want to make your life easier. Use openByClickOn instead!

#### openByClickOn : ReactElement (optional)
The second way how to open the portal. This element will be rendered by the portal immediately
with `onClick` handler that triggers portal opening. **How to close the portal then?** The portal provides its ported child with a callback `this.props.closePortal`. Or you can use built-in portal closing methods (closeOnEsc, ... more below). Notice that you don't have to deal with the open/close state (like when using the `isOpened` prop).

#### closeOnEsc: bool (optional)
If true, the portal can be closed by the key ESC.

#### closeOnOutsideClick: bool (optional)
If true, the portal can be closed by the outside mouse click.

#### onOpen: func(DOMNode) (optional)
This callback is called when the portal is opened and rendered (useful for animating the DOMNode).

#### beforeClose: func(DOMNode, removeFromDOM) (optional)
This callback is called when the closing event is triggered but it prevents normal removal from the DOM. So, you can do some DOMNode animation first and then call removeFromDOM() that removes the portal from DOM.

#### onClose: func (optional)
This callback is called when the portal closes and after beforeClose.


## Tips & Tricks
- Does your modal have a fullscreen overlay and the `closeOnOutsideClick` doesn't work? [There is a simple solution](https://github.com/tajo/react-portal/issues/2#issuecomment-92058826).
- Does your inner inner component `<LevelTwo />`

```js
<Portal>
  <LevelOne>
    <LevelTwo />
  </LevelOne>
</Portal>
```

also needs an access to `this.props.closePortal()`? You can't just use `{this.props.children}` in render method of `<LevelOne>` component. You have to clone it instead:

```js
{React.cloneElement(
  this.props.children,
  {closePortal: this.props.closePortal}
)}
```

#### Don't read this
Please, skip this section if you dislike dirty tricks.

**States make everything harder, right?** We don't want to deal with them, right? But sometime you need to open a portal (e.g. modal) automatically. There is no button to click on. No problem, because the portal has the `isOpen` prop, so you can just set it `true` or `false`.

However, then it's completely up to you to take care about the open state. You have to write all the closing logic! And that sucks. But there is a dirty trick:

```javascript
<Portal openByClickOn={<span ref="myLittleSecret" />}>
  <Modal title="My modal">
    Modal content
  </Modal>
</Portal>
```

```javascript
ReactDOM.findDOMNode(this.refs.myLittleSecret).click();
// opens the portal, yay!
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
- **Run `gulp eslint` before every commit** to preserve the coding style. Do you know there is a [nice real-time checking integration for your editor](http://eslint.org/docs/user-guide/integrations)?


## Credits

Inspired by the talk [React.js Conf 2015 - Hype!, Ryan Florence](https://www.youtube.com/watch?v=z5e7kWSHWTg)

Vojtech Miksu 2015, [miksu.cz](http://miksu.cz), [@vmiksu](https://twitter.com/vmiksu)
