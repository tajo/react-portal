import React from 'react';
import CSSPropertyOperations from 'react-dom/lib/CSSPropertyOperations';
import ReactDOM, { findDOMNode } from 'react-dom';
import ExecutionEnvironment from 'exenv';

const KEYCODES = {
  ESCAPE: 27,
};

const SafeHTMLElement = ExecutionEnvironment.canUseDOM
      ? window.HTMLElement : {};

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
    if (this.props.closeOnEsc) {
      document.addEventListener('keydown', this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.addEventListener('mouseup', this.handleOutsideMouseClick);
      document.addEventListener('touchstart', this.handleOutsideMouseClick);
    }

    if (this.props.isOpen) {
      this.openPortal();
    }
  }

  componentWillReceiveProps(newProps) {
    // portal's 'is open' state is handled through the prop isOpen
    if (typeof newProps.isOpen !== 'undefined') {
      if (newProps.isOpen) {
        if (this.state.active) {
          this.renderPortal(newProps);
        } else {
          this.openPortal(newProps);
        }
      }
      if (!newProps.isOpen && this.state.active) {
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
    if (this.state.active) { return; }
    this.openPortal();
  }

  openPortal(props = this.props) {
    this.setState({ active: true });
    this.renderPortal(props, true);
  }

  closePortal(isUnmounted = false) {
    const resetPortalState = () => {
      if (this.node) {
        ReactDOM.unmountComponentAtNode(this.node);
        this.props.appElement.removeChild(this.node);
      }
      this.portal = null;
      this.node = null;
      if (isUnmounted !== true) {
        this.setState({ active: false });
      }
    };

    if (this.state.active) {
      if (this.props.beforeClose) {
        this.props.beforeClose(this.node, resetPortalState);
      } else {
        resetPortalState();
      }

      this.props.onClose();
    }
  }

  handleOutsideMouseClick(e) {
    if (!this.state.active) { return; }

    const root = findDOMNode(this.portal);
    if (root.contains(e.target) || (e.button && e.button !== 0)) { return; }

    e.stopPropagation();
    this.closePortal();
  }

  handleKeydown(e) {
    if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
      this.closePortal();
    }
  }

  applyClassNameAndStyle(props) {
    if (props.className) {
      this.node.className = props.className;
    }

    if (props.style) {
      /* eslint-disable no-underscore-dangle */
      CSSPropertyOperations.setValueForStyles(
        this.node, props.style, this._reactInternalInstance);
      /* eslint-enable no-underscore-dangle */
    }
  }

  renderPortal(props, isOpening) {
    if (!this.node) {
      this.node = document.createElement('div');
      this.applyClassNameAndStyle(props);
      this.props.appElement.appendChild(this.node);
    } else {
      this.applyClassNameAndStyle(props);
    }

    if (isOpening) {
      this.props.onOpen(this.node);
    }

    let children = props.children;
    // https://gist.github.com/jimfb/d99e0678e9da715ccf6454961ef04d1b
    if (typeof props.children.type === 'function') {
      children = React.cloneElement(props.children, { closePortal: this.closePortal });
    }

    this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      children,
      this.node,
      this.props.onUpdate
    );
  }

  render() {
    if (this.props.openByClickOn) {
      return React.cloneElement(this.props.openByClickOn, { onClick: this.handleWrapperClick });
    }
    return null;
  }
}

Portal.propTypes = {
  appElement: React.PropTypes.instanceOf(SafeHTMLElement),
  children: React.PropTypes.element.isRequired,
  openByClickOn: React.PropTypes.element,
  closeOnEsc: React.PropTypes.bool,
  closeOnOutsideClick: React.PropTypes.bool,
  isOpen: React.PropTypes.bool,
  isOpened: (props, propName, componentName) => {
    if (typeof props[propName] !== 'undefined') {
      return new Error(
          `Prop \`${propName}\` supplied to \`${componentName}\` was renamed to \`isOpen\`.
          https://github.com/tajo/react-portal/pull/82.`
      );
    }
    return null;
  },
  onOpen: React.PropTypes.func,
  onClose: React.PropTypes.func,
  beforeClose: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  className: React.PropTypes.string,
  style: React.PropTypes.object,
};

Portal.defaultProps = {
  appElement: document.body,
  onClose: () => {},
  onOpen: () => {},
  onUpdate: () => {},
};
