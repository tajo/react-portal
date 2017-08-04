/* eslint-disable react/prefer-stateless-function */
import React, { PropTypes, Component } from 'react';

export default class PortalTarget extends Component {
  render() {
    const { name, children, ...restProps } = this.props;

    return (
      <div
        data-portaltarget={name}
        {...restProps}
      >{children}</div>
    );
  }
}

PortalTarget.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
};
