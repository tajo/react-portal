React-Portal-Minimal
============
[![npm version](https://img.shields.io/npm/v/react-portal-minimal.svg?style=flat-square)](https://www.npmjs.com/package/react-portal-minimal)
[![npm downloads](https://img.shields.io/npm/dm/react-portal-minimal.svg?style=flat-square)](https://www.npmjs.com/package/react-portal-minimal)
[![Build Status](https://travis-ci.org/strml/react-portal-minimal.svg?branch=master)](https://travis-ci.org/strml/react-portal-minimal)

### [Demo](https://strml.github.com/react-portal-minimal/examples/index.html)

React-Portal-Minimal is an extremely minimal version of [React-Portal](https://github.com/tajo/react-portal).

Compared to React-Portal, it is less than 1/3 the size, has minimal options, and no state.

It is intended as a building block. It does only three things:

1. Hoists its contents to a new React subtree.
2. Optionally sets a `className` on the subtree root.
3. Updates that `className` on the subtree root if it changes.

## Features

- Transports its child into a new React component and appends it to the **document.body** (creates a new independent React tree)
- Doesn't leave any mess in DOM after unmount.
- **no dependencies**
- **fully covered by tests**

## Installation

```shell
npm install react react-dom react-portal-minimal --save
```

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Portal from 'react-portal-minimal';

export default class App extends React.Component {

  render() {
    const button1 = <button>Open portal with pseudo modal</button>;

    return (
      <Portal>
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

### Required

#### children : ReactElement
The portal expects one child (`<Portal><Child ... /></Portal>`) that will be ported.

### Optional

#### className: string
A className to apply to the new React tree's root.

## Contribution

Please, create issues and pull requests.

```shell
git clone https://github.com/strml/react-portal-minimal
cd react-portal-minimal
npm install
npm start
open http://localhost:3000
```

**Don't forget to run this before every commit:**

```
npm test
```

## Credits

This project is based on @tajo's [react-portal](https://github.com/tajo/react-portal).

That project: Vojtech Miksu 2015, [miksu.cz](https://miksu.cz), [@vmiksu](https://twitter.com/vmiksu)
