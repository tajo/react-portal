import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

class Portalv4 extends React.Component {
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

Portalv4.propTypes = {
  children: PropTypes.node.isRequired,
  node: PropTypes.any
};

export default Portalv4;
