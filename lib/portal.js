import React, {findDOMNode} from 'react';
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';
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
    // portal's 'is open' state is handled through the prop isOpened
    if (typeof newProps.isOpened !== 'undefined') {
      if (newProps.isOpened) {
        if (this.state.active) {
          this.renderPortal(newProps);
        } else {
          this.openPortal();
        }
      }
      if (!newProps.isOpened && this.state.active) {
        this.closePortal();
      }
    }

    // portal handles its own 'is open' state
    if (typeof newProps.isOpened === 'undefined' && this.state.active) {
      this.renderPortal(newProps);
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
      if (props.className) {
        this.node.className = props.className;
      }
      if (props.style) {
        CSSPropertyOperations.setValueForStyles(this.node, props.style);
      }
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
    if (e.keyCode === 27 && this.state.active) {
      this.closePortal();
    }
  }

}

Portal.propTypes = {
  className: React.PropTypes.string,
  style: React.PropTypes.object,
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
