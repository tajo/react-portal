import React from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';
import shallowCompare from 'react/lib/shallowCompare';

const KEYCODES = {
  ESCAPE: 27
};

export default class Portal extends React.Component {

  constructor() {
    super();
    this.state = {active: false};
    this.handleWrapperClick = this.handleWrapperClick.bind(this);
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

    this.closePortal(true);
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
      return React.cloneElement(this.props.openByClickOn, {onClick: this.handleWrapperClick});
    } else {
      return null;
    }
  }

  handleWrapperClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.openPortal();
  }

  openPortal(props = this.props) {
    this.setState({active: true});
    this.renderPortal(props);

    this.props.onOpen(this.node);
  }

  closePortal(isUnmounted = false) {
    const resetPortalState = () => {
      if (this.node) {
        ReactDOM.unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
      }
      this.portal = null;
      this.node = null;
      if (!isUnmounted) {
        this.setState({active: false});
      }
    };

    if (this.state.active) {
      if (this.props.beforeClose) {
        this.props.beforeClose(this.node, resetPortalState);
      } else {
        resetPortalState();
      }

      this.props.onClose();
    }
  }

  handleOutsideMouseClick(e) {
    if (!this.state.active) { return; }

    const root = findDOMNode(this.portal);
    if (root.contains(e.target) || e.button !== 0) { return; }

    e.stopPropagation();
    this.closePortal();
  }

  handleKeydown(e) {
    if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
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

Portal.defaultProps = {
  onOpen: () => {},
  onClose: () => {},
  onUpdate: () => {}
};
