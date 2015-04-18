var React = require('react');

var PseudoModal = React.createClass({

  propTypes: {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.element),
      React.PropTypes.element
    ]),
    closePortal: React.PropTypes.func
  },

  render: function() {
    return (
      <div style={{border: '1px solid blue', margin: 10, padding: 10}}>
        {this.props.children}
        <p><button onClick={this.props.closePortal}>Close this</button></p>
      </div>
    );
  }

});

module.exports = PseudoModal;
