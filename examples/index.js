var React = require('react');
var Portal = require('../lib/portal.js');
var PseudoModal = require('./pseudomodal');
var LoadingBar = require('./loadingbar');
var AbsolutePosition = require('./absoluteposition');

// Main React app component
var App = React.createClass({

  getInitialState: function() {
    return {
      isPortalOpened: false,
      someValue: 'init'
    };
  },

  onClose: function() {
    console.log('Portal closed');
  },

  render: function() {
    var button1 = <button>Open portal with pseudo modal</button>;
    var button2 = <button>Another portal</button>;
    var button3 = (
      <button onClick={(function(e) {
          var bodyRect = document.body.getBoundingClientRect();
          var targetRect = e.target.getBoundingClientRect();
          this.setState({
            isOpened: true,
            top: targetRect.top - bodyRect.top,
            left:  targetRect.left - bodyRect.left,
            width: targetRect.width
          });
        }).bind(this)}>
        {'Open portal on top of button'}
      </button>
    );

    return (
      <div>
        <h1>React portal examples</h1>
        <a href="https://github.com/tajo/react-portal">https://github.com/tajo/react-portal</a>
        <p> </p>

        <Portal closeOnEsc={true} openByClickOn={button1} testProp={this.state.someValue}>
          <PseudoModal>
            <h2>Pseudo Modal</h2>
            <p>This react component is appended to the document body.</p>
            <p>This is <strong>great for a modal, lightbox, loading bar ... etc.</strong>.</p>
            <p>Close this by pressing <strong>ESC</strong>.</p>
            <p><strong>Why psuedo?</strong> Becuase the proper CSS styles are up to you. ;-)</p>
          </PseudoModal>
        </Portal>

        <button onClick={this.toggleLoadingBar}>
          {this.state.isPortalOpened ? 'Close the second portal' : 'Open the second portal'}
        </button>
        <Portal isOpened={this.state.isPortalOpened} testProp={this.state.someValue}>
          <LoadingBar />
        </Portal>

        <Portal closeOnOutsideClick={true} openByClickOn={button2} onClose={this.onClose}>
          <div style={{border: '1px solid black', margin: 10, padding: 10}}>
            <p>Click anywhere outside of this portal to close it.</p>
          </div>
        </Portal>

        <div className="absolutePosition">
          {button3}
          <Portal
            closeOnOutsideClick={true}
            isOpened={this.state.isOpened}
            onClose={(function() {
              this.setState({isOpened: false});
              this.onClose();
            }).bind(this)}>
            <AbsolutePosition top={this.state.top} left={this.state.left} width={this.state.width} />
          </Portal>
        </div>

        <button onClick={this.changeValue}>
          Change randomly value: {this.state.someValue}
        </button>

      </div>
    );
  },

  toggleLoadingBar: function(e) {
    this.setState({isPortalOpened: !this.state.isPortalOpened});
  },

  changeValue: function(e) {
    this.setState({someValue: Math.random().toString(36).substring(7)});
  }

});

React.render(React.createElement(App), document.getElementById('react-body'));
