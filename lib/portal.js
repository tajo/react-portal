import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';

const KEYCODES = {
  ESCAPE: 27,
};

// IE < 9
const preventDefault = (event) => {
  if (event.preventDefault === undefined) {
    event.returnValue = false; // eslint-disable-line no-param-reassign
  } else {
    event.preventDefault();
  }
};

export default class Portal extends React.Component {

  constructor() {
    super();
    this.state = { active: false };
    this.handleWrapperClick = this.handleWrapperClick.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.triggerElementRef = this.triggerElementRef.bind(this);
    this.portal = null;
    this.node = null;
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      document.addEventListener('keydown', this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.addEventListener('click', this.handleOutsideMouseClick, true);
      document.addEventListener('touchstart', this.handleOutsideMouseClick, true);
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
      document.removeEventListener('click', this.handleOutsideMouseClick);
      document.removeEventListener('touchstart', this.handleOutsideMouseClick);
    }

    this.closePortal(true);
  }

  handleWrapperClick(e) {
    preventDefault(e);

    if (this.props.togglesOnClick) {
      this.togglePortal();
    } else if (!this.state.active) {
      this.openPortal();
    }
  }

  togglePortal() {
    if (this.state.active) {
      this.closePortal();
    } else {
      this.openPortal();
    }
  }

  openPortal(props = this.props) {
    this.setState({ active: true });
    this.renderPortal(props, true);
  }

  closePortal(isUnmounted = false) {
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
    if (
      root.contains(e.target) ||
      (e.button && e.button !== 0) ||
      e.target === this.triggerElement
    ) {
      return;
    }

    this.closePortal();
  }

  handleKeydown(e) {
    if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
      this.closePortal();
    }
  }

  triggerElementRef(triggerElement) {
    const domElement = findDOMNode(triggerElement);

    if (this.triggerElement && this.triggerElement !== domElement) {
      this.triggerElement.removeEventListener('click', this.handleWrapperClick);
      this.triggerElement.removeEventListener('touchstart', this.handleWrapperClick);
    }

    if (domElement && this.triggerElement !== domElement) {
      domElement.addEventListener('click', this.handleWrapperClick);
      domElement.addEventListener('touchstart', this.handleWrapperClick);
    }

    this.triggerElement = domElement;

    if (typeof this.props.openByClickOn.ref === 'function') {
      this.props.openByClickOn.ref(triggerElement);
    }
  }

  renderPortal(props, isOpening) {
    if (!this.node) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
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
      return React.cloneElement(this.props.openByClickOn, {
        ref: this.triggerElementRef,
      });
    }
    return null;
  }
}

Portal.propTypes = {
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
  togglesOnClick: React.PropTypes.bool,
};

Portal.defaultProps = {
  onOpen: () => {},
  onClose: () => {},
  onUpdate: () => {},
  togglesOnClick: false,
};
