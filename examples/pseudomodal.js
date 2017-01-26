import React, { Component, PropTypes } from 'react';

export default class PseudoModal extends Component { // eslint-disable-line
  render() {
    return (
      <div style={{ border: '1px solid blue', margin: 10, padding: 10 }}>
        {this.props.children}
        <p><button onClick={this.props.closePortal}>Close this</button></p>
      </div>
    );
  }
}

PseudoModal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  closePortal: PropTypes.func,
};
