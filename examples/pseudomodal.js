import React from 'react';

export default class PseudoModal extends React.Component { // eslint-disable-line
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
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.element),
    React.PropTypes.element,
  ]),
  closePortal: React.PropTypes.func,
};
