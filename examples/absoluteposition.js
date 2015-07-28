var React = require('react');

var AbsolutePosition = React.createClass({

  propTypes: {
    top: React.PropTypes.number,
    left: React.PropTypes.number,
    width: React.PropTypes.number,
    closePortal: React.PropTypes.func
  },

  render: function() {
    var style = {
      position: 'absolute',
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      border: '1px solid gray',
      background: '#fff',
      margin: 10,
      padding: 10
    };

    return (
      <div style={style}>
        <p>This portal is opened manually and given an absolute position using: the opening element's <i>onClick</i> prop, and the portal's <i>isOpened</i> prop.</p>
        <p>Click anywhere outside to close it.</p>
      </div>
    );
  }

});

module.exports = AbsolutePosition;
