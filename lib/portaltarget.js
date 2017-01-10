import React, { PropTypes } from 'react';

export default function PortalTarget({ name }) {
  return (
    <div
      className={this.props.className}
      style={this.props.style}
      data-portaltarget={name}
    >{this.props.children}</div>
  );
}

PortalTarget.propTypes = { name: PropTypes.string };
