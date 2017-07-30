import React from 'react';
import PropTypes from 'prop-types';

export default class AbsolutePosition extends React.Component {
  // eslint-disable-line
  render() {
    const style = {
      position: 'absolute',
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      border: '1px solid gray',
      background: '#fff',
      margin: 10,
      padding: 10
    };

    return (
      <div style={style}>
        <p>
          This portal is opened manually and given an absolute position using:{' '}
          the opening element's <i>onClick</i> prop, and the portal's{' '}
          <i>isOpen</i> prop.
        </p>
        <p>Click anywhere outside to close it.</p>
      </div>
    );
  }
}

AbsolutePosition.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  width: PropTypes.number,
  closePortal: PropTypes.func
};
