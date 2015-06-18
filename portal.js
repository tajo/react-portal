'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _React$findDOMNode = require('react');

var _React$findDOMNode2 = _interopRequireWildcard(_React$findDOMNode);

var _CSSPropertyOperations = require('react/lib/CSSPropertyOperations');

var _CSSPropertyOperations2 = _interopRequireWildcard(_CSSPropertyOperations);

var _shallowEqual = require('react/lib/shallowEqual');

var _shallowEqual2 = _interopRequireWildcard(_shallowEqual);

var Portal = (function (_React$Component) {
  function Portal() {
    _classCallCheck(this, Portal);

    _get(Object.getPrototypeOf(Portal.prototype), 'constructor', this).call(this);
    this.state = { active: false };
    this.openPortal = this.openPortal.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.portal = null;
    this.node = null;
  }

  _inherits(Portal, _React$Component);

  _createClass(Portal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.closeOnEsc) {
        document.addEventListener('keydown', this.handleKeydown);
      }

      if (this.props.closeOnOutsideClick) {
        document.addEventListener('mousedown', this.handleOutsideMouseClick);
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.isOpened) {
        this.openPortal();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
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
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.closeOnEsc) {
        document.removeEventListener('keydown', this.handleKeydown);
      }

      if (this.props.closeOnOutsideClick) {
        document.removeEventListener('mousedown', this.handleOutsideMouseClick);
      }

      this.closePortal();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !_shallowEqual2['default'](this.props, nextProps) || !_shallowEqual2['default'](this.state, nextState);
    }
  }, {
    key: 'renderPortal',
    value: function renderPortal(props) {
      if (!this.node) {
        this.node = document.createElement('div');
        if (this.props.className) {
          this.node.className = this.props.className;
        }
        if (this.props.style) {
          _CSSPropertyOperations2['default'].setValueForStyles(this.node, this.props.style);
        }
        document.body.appendChild(this.node);
      }
      this.portal = _React$findDOMNode2['default'].render(_React$findDOMNode2['default'].cloneElement(props.children, { closePortal: this.closePortal }), this.node);
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.openByClickOn) {
        return _React$findDOMNode2['default'].createElement(
          'div',
          { className: 'openByClickOn', onClick: this.openPortal },
          this.props.openByClickOn
        );
      } else {
        return null;
      }
    }
  }, {
    key: 'openPortal',
    value: function openPortal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.setState({ active: true });
      this.renderPortal(this.props);
    }
  }, {
    key: 'closePortal',
    value: function closePortal() {
      if (this.node) {
        _React$findDOMNode2['default'].unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
      }
      this.portal = null;
      this.node = null;
      this.setState({ active: false });

      if (this.props.onClose) {
        this.props.onClose();
      }
    }
  }, {
    key: 'handleOutsideMouseClick',
    value: function handleOutsideMouseClick(e) {
      if (!this.state.active) {
        return;
      }
      if (isNodeInRoot(e.target, _React$findDOMNode.findDOMNode(this.portal))) {
        return;
      }
      e.stopPropagation();
      this.closePortal();
    }
  }, {
    key: 'handleKeydown',
    value: function handleKeydown(e) {
      // ESC
      if (e.keyCode === 27 && this.state.active) {
        this.closePortal();
      }
    }
  }]);

  return Portal;
})(_React$findDOMNode2['default'].Component);

exports['default'] = Portal;

Portal.propTypes = {
  children: _React$findDOMNode2['default'].PropTypes.element.isRequired,
  openByClickOn: _React$findDOMNode2['default'].PropTypes.element,
  closeOnEsc: _React$findDOMNode2['default'].PropTypes.bool,
  closeOnOutsideClick: _React$findDOMNode2['default'].PropTypes.bool,
  isOpened: _React$findDOMNode2['default'].PropTypes.bool,
  onClose: _React$findDOMNode2['default'].PropTypes.func
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
module.exports = exports['default'];