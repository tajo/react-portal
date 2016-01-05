import React from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';
import shallowCompare from 'react/lib/shallowCompare';

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
      document.addEventListener('touchstart', this.handleOutsideMouseClick);
    }

    if (this.props.isOpened) {
      this.openPortal(this.props);
    }
  }

  componentWillReceiveProps(newProps) {
    // portal's 'is open' state is handled through the prop isOpened
    if (typeof newProps.isOpened !== 'undefined') {
      if (newProps.isOpened) {
        if (this.state.active) {
          this.renderPortal(newProps);
        } else {
          this.openPortal(newProps);
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
      document.removeEventListener('touchstart', this.handleOutsideMouseClick);
    }

    this.closePortal();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
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
    this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, React.cloneElement(props.children, {closePortal: this.closePortal}), this.node, this.props.onUpdate);
  }

  render() {
    if (this.props.openByClickOn) {
      return <div className="openByClickOn" onClick={this.openPortal.bind(this, this.props)}>{this.props.openByClickOn}</div>;
    } else {
      return null;
    }
  }

  openPortal(props, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({active: true});
    this.renderPortal(props);
    if (this.props.onOpen) {
      this.props.onOpen(this.node);
    }
  }

  closePortal() {
    const resetPortalState = () => {
      if (this.node) {
        ReactDOM.unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
      }
      this.portal = null;
      this.node = null;
      this.setState({active: false});
    };

    if (this.props.beforeClose) {
      this.props.beforeClose(this.node, resetPortalState);
    } else {
      resetPortalState(this.node);
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  handleOutsideMouseClick(e) {
    if (!this.state.active) { return; }
    if (isNodeInRoot(e.target, findDOMNode(this.portal)) || e.target.tagName === 'HTML') { return; }
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
  onOpen: React.PropTypes.func,
  onClose: React.PropTypes.func,
  beforeClose: React.PropTypes.func,
  onUpdate: React.PropTypes.func
};

export function isNodeInRoot(node, root) {
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
Portal.defaultProps = {
  onUpdate: () => {}
};
