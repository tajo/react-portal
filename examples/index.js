var React = require('react');
var Portal = require('../lib/portal.js');

// Main React app component
var App = React.createClass({

  getInitialState: function() {
    return { isPortalOpened: false };
  },

  render: function() {
    var button1 = <button>Open portal with pseudo modal</button>;
    var button2 = <button>Another portal</button>;

    return (
      <div>
        <h1>React portal examples</h1>
        <a href="https://github.com/tajo/react-portal">https://github.com/tajo/react-portal</a>
        <p> </p>

        <Portal openByClickOn={button1} closeOnEsc={true}>
          <PseudoModal>
            <h2>Pseudo Modal</h2>
            <p>This react component is appended to the document body.</p>
            <p>This is <strong>great for a modal, lightbox, loading bar ... etc.</strong>.</p>
            <p><strong>Click outside</strong> to close this.</p>
            <p>Or close this by pressing <strong>ESC</strong>.</p>
            <p><strong>Why psuedo?</strong> Becuase the proper CSS styles are up to you. ;-)</p>
          </PseudoModal>
        </Portal>

        <button onClick={this.toggleLoadingBar}>
          {this.state.isPortalOpened ? "Close the second portal" : "Open the second portal"}
        </button>
        <Portal isOpened={this.state.isPortalOpened}>
          <LoadingBar />
        </Portal>

        <Portal openByClickOn={button2} closeOnOutsideClick={true}>
          <div style={{border: '1px solid black', margin: 10, padding: 10}}>
            <p>Click anywhere outside of this portal to close it.</p>
          </div>
        </Portal>

      </div>
    );
  },

  toggleLoadingBar: function(e) {
    this.setState({ isPortalOpened: !this.state.isPortalOpened });
  }

});

// First ported component
var PseudoModal = React.createClass({

  render: function() {
    return (
      <div style={{border: '1px solid blue', margin: 10, padding: 10}}>
        {this.props.children}
        <p><button onClick={this.props.closePortal}>Close this</button></p>
      </div>
    );
  }

});

// Second ported component
var LoadingBar = React.createClass({

  render: function() {
    return (
      <div style={{border: '1px solid green', margin: 10, padding: 10}}>
        <p>This could be a loading bar...</p>
        <p>This portal is <strong>opened by the prop</strong> <i>isOpened</i>.</p>
        <p>... when <i>openByClickOn</i> is not enough.</p>
        <p>Notice, that by default you cannot close this by ESC or an outside click.</p>
      </div>
    );
  }

});

React.render(React.createElement(App), document.getElementById('react-body'));