import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

const KEYCODES = {
ESCAPE: 27
};

export default class Portal extends React.Component {
constructor() {
super();
this.state = { active: false };
this.handleWrapperClick = this.handleWrapperClick.bind(this);
this.closePortal = this.closePortal.bind(this);
this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
this.handleKeydown = this.handleKeydown.bind(this);
this.portal = null;
this.node = null;
}

componentDidMount() {
const { closeOnEsc, closeOnOutsideClick, isOpen } = this.props;
if (closeOnEsc) {
document.addEventListener('keydown', this.handleKeydown);
}

if (closeOnOutsideClick) {
document.addEventListener('mouseup', this.handleOutsideMouseClick);
document.addEventListener('touchstart', this.handleOutsideMouseClick);
}

if (isOpen) {
this.openPortal();
}
}

componentWillReceiveProps(newProps) {
// portal's 'is open' state is handled through the prop isOpen
const { active } = this.state;
if (typeof newProps.isOpen !== 'undefined') {
if (newProps.isOpen) {
if (active) {
this.renderPortal(newProps);
} else {
this.openPortal(newProps);
}
}
if (!newProps.isOpen && active) {
this.closePortal();
}
}

// portal handles its own 'is open' state
if (typeof newProps.isOpen === 'undefined' && this.state.active) {
this.renderPortal(newProps);
}
}

componentWillUnmount() {
if (this.props.closeOnEsc) {
document.removeEventListener('keydown', this.handleKeydown);
}

if (this.props.closeOnOutsideClick) {
document.removeEventListener('mouseup', this.handleOutsideMouseClick);
document.removeEventListener('touchstart', this.handleOutsideMouseClick);
}

this.closePortal(true);
}

handleWrapperClick(e) {
e.preventDefault();
e.stopPropagation();
if (this.state.active) {
return;
}
this.openPortal();
}

openPortal(props = this.props) {
this.setState({ active: true });
this.renderPortal(props, true);
}

closePortal(isUnmounted = false) {
const { active } = this.state;
const { beforeClose, onClose } = this.props;
const resetPortalState = () => {
if (this.node) {
ReactDOM.unmountComponentAtNode(this.node);
document.body.removeChild(this.node);
}
this.portal = null;
this.node = null;
if (isUnmounted !== true) {
this.setState({ active: false });
}
};

if (active) {
if (beforeClose) {
beforeClose(this.node, resetPortalState);
} else {
resetPortalState();
}

onClose();
}
}

handleOutsideMouseClick(e) {
if (!this.state.active) {
return;
}

const root = findDOMNode(this.portal);
if (root.contains(e.target) || (e.button && e.button !== 0)) {
return;
}

e.stopPropagation();
this.closePortal();
}

handleKeydown(e) {
if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
this.closePortal();
}
}

renderPortal(props, isOpening) {
const { closePortal } = this;
const { onOpen, onUpdate } = this.props;
if (!this.node) {
this.node = document.createElement('div');
document.body.appendChild(this.node);
}

if (isOpening) {
onOpen(this.node);
}

let children = props.children;
// https://gist.github.com/jimfb/d99e0678e9da715ccf64549..
if (typeof props.children.type === 'function') {
children = React.cloneElement(props.children, {
closePortal: closePortal
});
}

this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
this,
children,
this.node,
onUpdate
);
}

render() {
const { openByClickOn } = this.props;
if (openByClickOn) {
return React.cloneElement(openByClickOn, {
onClick: this.handleWrapperClick
});
}
return null;
}
}

Portal.propTypes = {
children: PropTypes.element.isRequired,
openByClickOn: PropTypes.element,
closeOnEsc: PropTypes.bool,
closeOnOutsideClick: PropTypes.bool,
isOpen: PropTypes.bool,
isOpened: (props, propName, componentName) => {
if (typeof props[propName] !== 'undefined') {
return new Error(
`Prop \`${propName}\` supplied to \`${componentName}\` was renamed to \`isOpen\`.
https://github.com/tajo/react-portal/pull/82.`
);
}
return null;
},
onOpen: PropTypes.func,
onClose: PropTypes.func,
beforeClose: PropTypes.func,
onUpdate: PropTypes.func
};

Portal.defaultProps = {
onOpen: () => {},
onClose: () => {},
onUpdate: () => {}
};
