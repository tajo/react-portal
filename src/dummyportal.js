import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM, { createPortal } from 'react-dom';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

class DummyPortal extends React.Component {
  componentWillUnmount() {
    if (this.node) {
      ReactDOM.unmountComponentAtNode(this.node);
      document.body.removeChild(this.node);
    }
    this.node = null;
  }

  render() {
    if (!canUseDOM) {
      return null;
    }
    if (!this.node) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    }
    return createPortal(this.props.children, this.props.node || this.node);
  }
}

DummyPortal.propTypes = {
  children: PropTypes.node,
  node: PropTypes.any
};

export default DummyPortal;
