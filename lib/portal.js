import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Portal extends React.Component {

  constructor() {
    super();
    this.node = null;
  }

  componentDidMount() {
    this.openPortal();
  }

  componentWillReceiveProps(nextProps) {
    if (this.node && this.props.className !== nextProps.className) {
      this.node.className = nextProps.className;
    }
  }

  componentWillUnmount() {
    this.closePortal();
  }

  openPortal() {
    const { props } = this;

    if (!this.node) {
      this.node = document.createElement('div');
      // apply class before the node is added to the DOM to avoid needless reflows
      if (props.className) {
        this.node.className = props.className;
      }
      document.body.appendChild(this.node);
    }

    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      props.children,
      this.node,
    );
  }

  closePortal() {
    if (this.node) {
      ReactDOM.unmountComponentAtNode(this.node);
      document.body.removeChild(this.node);
    }
    this.node = null;
  }

  render() {
    return null;
  }
}

Portal.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};
