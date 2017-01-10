import React, { PropTypes } from 'react';

export default function PortalTarget(props) {
  const { name, children, ...restProps } = props;

  return (
    <div
      data-portaltarget={name}
      {...restProps}
    >{children}</div>
  );
}

PortalTarget.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
};
