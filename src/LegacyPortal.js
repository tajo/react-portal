import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

const KEYCODES = {
  ESCAPE: 27
};

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export default class Portal extends React.Component {
  componentWillUnmount() {
    if (this.props.node) {
      document.body.removeChild(this.props.node);
    }
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
    this.portal = null;
  }

  renderPortal(props) {
    if (!this.props.node && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      document.body.appendChild(this.defaultNode);
    }

    let children = this.props.children;
    // https://gist.github.com/jimfb/d99e0678e9da715ccf6454961ef04d1b
    if (typeof this.props.children.type === 'function') {
      children = React.cloneElement(this.props.children);
    }

    this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      children,
      this.props.node || this.defaultNode
    );
  }

  render() {
    if (!canUseDOM) {
      return null;
    }

    this.renderPortal();

    return null;
  }
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  node: PropTypes.any
};
