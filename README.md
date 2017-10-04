React-portal
============
[![npm version](https://img.shields.io/npm/v/react-portal.svg?style=flat-square)](https://www.npmjs.com/package/react-portal)
[![npm downloads](https://img.shields.io/npm/dm/react-portal.svg?style=flat-square)](https://www.npmjs.com/package/react-portal)
[![Build Status](https://travis-ci.org/tajo/react-portal.svg?branch=master)](https://travis-ci.org/tajo/react-portal)

> Struggling with modals, lightboxes or loading bars in React? React-portal creates a new top-level React tree and injects its children into it. That's necessary for proper styling (especially positioning).

*This is documentation for React-portal v4+ (currently beta). It works only with React v16+. For v3, please check [this document](READMEv3.MD). The final API can change. The test suite needs to be rebuilt.*

## Features

- transports its children into a new React Portal which is appended by default to **document.body**
- can target user specified DOM element
- supports server-side rendering
- **uses React v16 and its official API for creating portals**
- supports returning arrays (no wrapper divs needed)
- `<Portal />` and `<PortalWithState />` so there is no compromise between flexibility and convenience
- doesn't produce any DOM mess
- provides **close on ESC** and **close on outside mouse click** out of the box
- **no dependencies**, minimalistic

## Installation

```shell
yarn add react react-dom react-portal@next
```

## Usage

### Portal

```jsx 
import { Portal } from 'react-portal';

<Portal>
  This text is portaled at the end of document.body!
</Portal>

<Portal node={document && document.getElementById('san-francisco')}>
  This text is portaled into San Francisco!
</Portal>
```

That's it! Do you want to toggle portal? It's a plain React component, so you can simply do:

```jsx
{isOpen && <Portal>Sometimes portaled?</Portal>}
```

**This gives you absolute flexibility and control**. But what if you typically use React-portal just to open modals and you want to cut some boilerplate? In other words, **you are ok with giving up some flexibility for convenience**. Let React-portal handle its own state!

### PortalWithState

```jsx 
import { PortalWithState } from 'react-portal';

<PortalWithState closeOnOutsideClick closeOnEsc>
  {({ openPortal, closePortal, isOpen, portal }) => [
    !isOpen && (
      <button key="foo" onClick={openPortal}>
        Open Portal
      </button>
    ),
    portal(
      <p>
        This is more advanced Portal. It handles its own state.{' '}
        <button onClick={closePortal}>Close me!</button>, hit ESC or
        click outside of me.
      </p>
    )
  ]}
</PortalWithState>
```

Don't let this example to intimidate you! `PortalWithState` **expects one child, a function**. This function gets a few parameters (mostly functions) and returns a React component.

### There are 4 optional parameters:

- **openPortal** - function that you can call to open the portal
- **closePortal** - function that you can call to close the portal
- **portal** - the part of component that should be portaled needs to be wrapped by this function
- **isOpen** - boolean, tells you if portal is open/closed

### `<PortalWithState />` accepts this optional props:

- **node** - same as `<Portal>`, you can target a custom DOM element
- **closeOnOutsideClick** - boolean, portal closes when you click outside of it
- **closeOnEsc** - boolean, portal closes when the ESC key is hit 
- **defaultOpen** - boolean, the starting state of portal is being open
- **onOpen** - function, will get triggered after portal is open
- **onClose** - function, will get triggered after portal is closed

Also notice, that **the example returns an array since React v16 supports it**! You can also return a single component. In that case, the example would be wrapped by a div as you were used to.

## Run Examples

```shell
git clone https://github.com/tajo/react-portal
cd react-portal
yarn install
yarn build:examples
open examples/index.html
```

## Contributions Welcome!

```shell
git clone https://github.com/tajo/react-portal
cd react-portal
yarn install
yarn build:examples --watch
open examples/index.html
```

### Run Tests

```
yarn test
```

## Author

Vojtech Miksu 2017, [miksu.cz](https://miksu.cz), [@vmiksu](https://twitter.com/vmiksu)
