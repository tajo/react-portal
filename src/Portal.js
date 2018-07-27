import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { canUseDOM } from './utils';

class Portal extends React.Component {
  componentWillUnmount() {
    if (this.defaultNode) {
      this.defaultNode.parentNode.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  render() {
    if (!canUseDOM) {
      return null;
    }
    if (!this.props.node && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      Portal.portalRoot.appendChild(this.defaultNode);
    }
    return ReactDOM.createPortal(
      this.props.children,
      this.props.node || this.defaultNode
    );
  }
}

Portal.portalRoot = document.body;

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  node: PropTypes.any
};

export default Portal;
