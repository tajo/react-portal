import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { canUseDOM } from './utils';

class Portal extends React.PureComponent {
  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  render() {
    if (!canUseDOM) {
      return null;
    }
    if (!this.props.node && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      document.body.appendChild(this.defaultNode);
    }
    return createPortal(
      this.props.children,
      this.props.node || this.defaultNode
    );
  }
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  node: PropTypes.any
};

export default Portal;
