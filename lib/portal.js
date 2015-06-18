import React, {findDOMNode} from 'react';
import shallowEqual from 'react/lib/shallowEqual';

export default class Portal extends React.Component {

  constructor() {
    super();
    this.state = {active: false};
    this.openPortal = this.openPortal.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.portal = null;
    this.node = null;
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      document.addEventListener('keydown', this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.addEventListener('mousedown', this.handleOutsideMouseClick);
    }
  }

  componentWillMount() {
    if (this.props.isOpened) {
      this.openPortal();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isOpened !== 'undefined' && this.newProps !== this.props) {
      if (newProps.isOpened && !this.state.active) {
        this.openPortal();
      }
      if (!newProps.isOpened && this.state.active) {
        this.closePortal();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.closeOnEsc) {
      document.removeEventListener('keydown', this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.removeEventListener('mousedown', this.handleOutsideMouseClick);
    }

    this.closePortal();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) ||
           !shallowEqual(this.state, nextState);
  }

  renderPortal(props) {
    if (!this.node) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    }
    this.portal = React.render(React.cloneElement(props.children, {closePortal: this.closePortal}), this.node);
  }

  render() {
    if (this.props.openByClickOn) {
      return <div className="openByClickOn" onClick={this.openPortal}>{this.props.openByClickOn}</div>;
    } else {
      return null;
    }
  }

  openPortal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({active: true});
    this.renderPortal(this.props);
  }

  closePortal() {
    if (this.node) {
      React.unmountComponentAtNode(this.node);
      document.body.removeChild(this.node);
    }
    this.portal = null;
    this.node = null;
    this.setState({active: false});

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  handleOutsideMouseClick(e) {
    if (!this.state.active) { return; }
    if (isNodeInRoot(e.target, findDOMNode(this.portal))) { return; }
    e.stopPropagation();
    this.closePortal();
  }

  handleKeydown(e) {
    // ESC
    if (e.keyCode === 27 && this.props.isOpened) {
      this.closePortal();
    }
  }

}

Portal.propTypes = {
  children: React.PropTypes.element.isRequired,
  openByClickOn: React.PropTypes.element,
  closeOnEsc: React.PropTypes.bool,
  closeOnOutsideClick: React.PropTypes.bool,
  isOpened: React.PropTypes.bool,
  onClose: React.PropTypes.func
};

function isNodeInRoot(node, root) {
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
