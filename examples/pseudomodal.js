import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
export default class PseudoModal extends React.Component {
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
