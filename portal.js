"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var findDOMNode = _react.findDOMNode;

var shallowEqual = _interopRequire(require("react/lib/shallowEqual"));

var Key = _interopRequire(require("keymaster"));

var Portal = (function (_React$Component) {
  function Portal() {
    _classCallCheck(this, Portal);

    _get(Object.getPrototypeOf(Portal.prototype), "constructor", this).call(this);
    this.state = { active: false };
    this.openPortal = this.openPortal.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.portal = null;
    this.node = null;
  }

  _inherits(Portal, _React$Component);

  _createClass(Portal, {
    componentDidMount: {
      value: function componentDidMount() {
        var _this = this;

        if (this.props.closeOnEsc) {
          Key("esc", function () {
            _this.closePortal();
          });
        }

        if (this.props.closeOnOutsideClick) {
          document.addEventListener("mousedown", this.handleOutsideMouseClick);
        }
      }
    },
    componentWillMount: {
      value: function componentWillMount() {
        if (this.props.isOpened) {
          this.openPortal();
        }
      }
    },
    componentWillReceiveProps: {
      value: function componentWillReceiveProps(newProps) {
        if (newProps.isOpened === undefined) {
          if (!this.state.active) {
            return;
          }this.renderPortal(newProps);
        } else {
          if (newProps.isOpened) {
            if (this.state.active) {
              return;
            }this.openPortal();
          } else {
            if (!this.state.active) {
              return;
            }this.closePortal();
          }
        }
      }
    },
    componentWillUnmount: {
      value: function componentWillUnmount() {
        if (this.props.closeOnEsc) {
          Key.unbind("esc");
        }

        if (this.props.closeOnOutsideClick) {
          document.removeEventListener("mousedown", this.handleOutsideMouseClick);
        }

        this.closePortal();
      }
    },
    shouldComponentUpdate: {
      value: function shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
      }
    },
    renderPortal: {
      value: function renderPortal(props) {
        if (!this.node) {
          this.node = document.createElement("div");
          document.body.appendChild(this.node);
        }
        this.portal = React.render(React.cloneElement(props.children, { closePortal: this.closePortal }), this.node);
      }
    },
    render: {
      value: function render() {
        if (this.props.openByClickOn) {
          return React.createElement(
            "div",
            { onClick: this.openPortal },
            this.props.openByClickOn
          );
        } else {
          return null;
        }
      }
    },
    openPortal: {
      value: function openPortal(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ active: true });
        this.renderPortal(this.props);
      }
    },
    closePortal: {
      value: function closePortal() {
        if (this.node) {
          React.unmountComponentAtNode(this.node);
          document.body.removeChild(this.node);
        }
        this.portal = null;
        this.node = null;
        this.setState({ active: false });
      }
    },
    handleOutsideMouseClick: {
      value: function handleOutsideMouseClick(e) {
        if (!this.state.active) {
          return;
        }
        if (isNodeInRoot(e.target, findDOMNode(this.portal))) {
          return;
        }
        e.stopPropagation();
        this.closePortal();
      }
    }
  });

  return Portal;
})(React.Component);

module.exports = Portal;

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