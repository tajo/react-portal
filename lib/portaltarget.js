import React, { PropTypes } from 'react';

export default function PortalTarget(props) {
  return (
    <div
      className={props.className}
      style={props.style}
      data-portaltarget={props.name}
    >{props.children}</div>
  );
}

PortalTarget.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.string,
  children: PropTypes.node,
};
