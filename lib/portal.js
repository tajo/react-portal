import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';
import shallowCompare from 'react/lib/shallowCompare';

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
    this.handleWrapperClick = this.handleWrapperClick.bind(this);
    this.triggerElementRef = this.triggerElementRef.bind(this);
    this.portal = null;
    this.node = null;
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      document.addEventListener('keydown', this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.addEventListener('click', this.handleOutsideMouseClick);
      document.addEventListener('touchstart', this.handleOutsideMouseClick);
    }

    if (this.props.isOpened) {
      this.openPortal();
    }
  }

  componentWillReceiveProps(newProps) {
    // portal's 'is open' state is handled through the prop isOpened
    if (typeof newProps.isOpened !== 'undefined') {
      if (newProps.isOpened) {
        if (this.state.active) {
          this.renderPortal(newProps);
        } else {
          this.openPortal(newProps);
        }
      }
      if (!newProps.isOpened && this.state.active) {
        this.closePortal();
      }
    }

    // portal handles its own 'is open' state
    if (typeof newProps.isOpened === 'undefined' && this.state.active) {
      this.renderPortal(newProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
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
    e.stopPropagation();

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
    this.renderPortal(props);
    this.props.onOpen(this.node);
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
      // React 15.1.0+ requires third parameter in debug mode
      /* eslint-disable no-underscore-dangle */
      CSSPropertyOperations.setValueForStyles(this.node,
                                              props.style,
                                              this._reactInternalInstance);
      /* eslint-enable no-underscore-dangle */
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

  renderPortal(props) {
    if (!this.node) {
      this.node = document.createElement('div');
      // apply CSS before the node is added to the DOM to avoid needless reflows
      this.applyClassNameAndStyle(props);
      document.body.appendChild(this.node);
    } else {
      // update CSS when new props arrive
      this.applyClassNameAndStyle(props);
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
  className: React.PropTypes.string,
  style: React.PropTypes.object,
  children: React.PropTypes.element.isRequired,
  openByClickOn: React.PropTypes.element,
  closeOnEsc: React.PropTypes.bool,
  closeOnOutsideClick: React.PropTypes.bool,
  isOpened: React.PropTypes.bool,
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
