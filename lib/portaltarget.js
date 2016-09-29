import React from 'react';

export default class PortalTarget extends React.Component {
  render() {
    const { name } = this.props;
    return <div className={this.props.className} style={this.props.style} data-portaltarget={name}>{this.props.children}</div>
  }
}
