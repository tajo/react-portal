var React = require('react');
var Portal = require('../lib/portal.js');
var PseudoModal = require('./pseudomodal');
var LoadingBar = require('./loadingbar');

// Main React app component
var App = React.createClass({

  getInitialState: function() {
    return {isPortalOpened: false};
  },

  render: function() {
    var button1 = <button>Open portal with pseudo modal</button>;
    var button2 = <button>Another portal</button>;

    return (
      <div>
        <h1>React portal examples</h1>
        <a href="https://github.com/tajo/react-portal">https://github.com/tajo/react-portal</a>
        <p> </p>

        <Portal closeOnEsc={true} openByClickOn={button1}>
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
        <Portal isOpened={this.state.isPortalOpened}>
          <LoadingBar />
        </Portal>

        <Portal closeOnOutsideClick={true} openByClickOn={button2}>
          <div style={{border: '1px solid black', margin: 10, padding: 10}}>
            <p>Click anywhere outside of this portal to close it.</p>
          </div>
        </Portal>

      </div>
    );
  },

  toggleLoadingBar: function(e) {
    this.setState({isPortalOpened: !this.state.isPortalOpened});
  }

});

React.render(React.createElement(App), document.getElementById('react-body'));
