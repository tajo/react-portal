import React from 'react';
import PropTypes from 'prop-types';
import Portal from './PortalCompat';

const KEYCODES = { ESCAPE: 27 };

class PortalWithState extends React.Component {
  constructor(props) {
    super(props);
    this.portalNode = null;
    this.state = { active: !!props.defaultOpen };
    this.openPortal = this.openPortal.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.wrapWithPortal = this.wrapWithPortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.handleOutsideMouseRightClick = this.handleOutsideMouseRightClick.bind(
      this
    );
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      document.addEventListener('keydown', this.handleKeydown);
    }
    if (this.props.closeOnOutsideClick) {
      document.addEventListener('click', this.handleOutsideMouseClick);
    }
    if (this.props.closeOnOutsideRightClick) {
      document.addEventListener(
        'contextmenu',
        this.handleOutsideMouseRightClick
      );
    }
  }

  componentWillUnmount() {
    if (this.props.closeOnEsc) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    if (this.props.closeOnOutsideClick) {
      document.removeEventListener('click', this.handleOutsideMouseClick);
    }
    if (this.props.closeOnOutsideRightClick) {
      document.removeEventListener(
        'contextmenu',
        this.handleOutsideMouseRightClick
      );
    }
  }

  openPortal(e) {
    if (this.state.active) {
      return;
    }
    if (e && e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
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

  handleOutsideMouseClick(e) {
    if (!this.state.active) {
      return;
    }
    const root = this.portalNode.defaultNode;
    if (!root || root.contains(e.target) || (e.button && e.button !== 0)) {
      return;
    }
    this.closePortal();
  }

  handleOutsideMouseRightClick(e) {
    if (!this.state.active) {
      return;
    }
    const root = this.portalNode.defaultNode;
    if (!root || root.contains(e.target) || (e.button && e.button !== 2)) {
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
  closeOnOutsideRightClick: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

PortalWithState.defaultProps = {
  onOpen: () => {},
  onClose: () => {}
};

export default PortalWithState;
