/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PortalTarget extends Component {
  render() {
    const { name, children, ...restProps } = this.props;

    return (
      <div data-portaltarget={name} {...restProps}>
        {children}
      </div>
    );
  }
}

PortalTarget.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node
};
