import React, {findDOMNode} from 'react';
import shallowEqual from 'react/lib/shallowEqual'
import Key from 'keymaster';

export default class Portal extends React.Component {

  constructor() {
    super();
    this.state = { active: false };
    this.openPortal = this.openPortal.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.portal = null;
    this.node = null;
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      Key('esc', () => { this.closePortal() });
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
    if (newProps.isOpened === undefined) {
      if (!this.state.active) return;
      this.renderPortal(newProps);
    } else {
      if (newProps.isOpened) {
        if (this.state.active) return;
        this.openPortal();
      } else {
        if (!this.state.active) return;
        this.closePortal();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.closeOnEsc) {
      Key.unbind('esc');
    }

    if (this.props.closeOnOutsideClick) {
      document.removeEventListener('mousedown', this.handleOutsideMouseClick);
    }

    this.closePortal();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) ||
           !shallowEqual(this.state, nextState)
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
      return <div onClick={this.openPortal} className="openByClickOn">{this.props.openByClickOn}</div>;
    } else {
      return null;
    }
  }

  openPortal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({ active: true });
    this.renderPortal(this.props);
  }

  closePortal() {
    if (this.node) {
      React.unmountComponentAtNode(this.node);
      document.body.removeChild(this.node);
    }
    this.portal = null;
    this.node = null;
    this.setState({ active: false });
  }

  handleOutsideMouseClick(e) {
    if (!this.state.active) { return; }
    if (isNodeInRoot(e.target, findDOMNode(this.portal))) { return; }
    e.stopPropagation();
    this.closePortal();
  }

}

Portal.propTypes = {
  children: React.PropTypes.element.isRequired,
  openByClickOn: React.PropTypes.element,
  closeOnEsc: React.PropTypes.bool,
  closeOnOutsideClick: React.PropTypes.bool,
  isOpened: React.PropTypes.bool
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
