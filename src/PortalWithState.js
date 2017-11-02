import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Portal from './Portal';

const KEYCODES = {
  ESCAPE: 27
};

class PortalWithState extends React.Component {
  constructor(props) {
    super(props);
    this.portalNode = null;
    this.state = { active: !!props.defaultOpen };
    this.openPortal = this.openPortal.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.wrapWithPortal = this.wrapWithPortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      this.enableEscHandler();
    }
    if (this.props.closeOnOutsideClick) {
      this.enableOutsideClickHandler();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.closeOnEsc !== prevProps.closeOnEsc) {
      if (this.props.closeOnEsc) {
        this.enableEscHandler();
      } else {
        this.disableEscHandler();
      }
    }

    if (this.props.closeOnOutsideClick !== prevProps.closeOnOutsideClick) {
      if (this.props.closeOnOutsideClick) {
        this.enableOutsideClickHandler();
      } else {
        this.disableOutsideClickHandler();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.closeOnEsc) {
      this.disableEscHandler();
    }
    if (this.props.closeOnOutsideClick) {
      this.disableOutsideClickHandler();
    }
  }

  openPortal(e) {
    if (this.state.active) {
      return;
    }
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ active: true }, this.props.onOpen);
  }

  closePortal() {
    if (!this.state.active) {
      return;
    }
    this.setState({ active: false }, this.props.onClose);
  }

  wrapWithPortal(children) {
    if (!this.state.active) {
      return null;
    }
    return (
      <Portal
        node={this.props.node}
        key="react-portal"
        ref={portalNode => (this.portalNode = portalNode)}
      >
        {children}
      </Portal>
    );
  }

  enableEscHandler() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  disableEscHandler() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  enableOutsideClickHandler() {
    document.addEventListener('click', this.handleOutsideMouseClick);
  }

  disableOutsideClickHandler() {
    document.removeEventListener('click', this.handleOutsideMouseClick);
  }

  handleOutsideMouseClick(e) {
    if (!this.state.active) {
      return;
    }
    const root = findDOMNode(this.portalNode);
    if (!root || root.contains(e.target) || (e.button && e.button !== 0)) {
      return;
    }
    this.closePortal();
  }

  handleKeydown(e) {
    if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
      this.closePortal();
    }
  }

  render() {
    return this.props.children({
      openPortal: this.openPortal,
      closePortal: this.closePortal,
      portal: this.wrapWithPortal,
      isOpen: this.state.active
    });
  }
}

PortalWithState.propTypes = {
  children: PropTypes.func.isRequired,
  defaultOpen: PropTypes.bool,
  node: PropTypes.any,
  openByClickOn: PropTypes.element,
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

PortalWithState.defaultProps = {
  onOpen: () => {},
  onClose: () => {}
};

export default PortalWithState;
