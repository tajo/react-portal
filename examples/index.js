import React from 'react';
import ReactDOM from 'react-dom';
import Portal from '../lib/portal.js';
import PseudoModal from './pseudomodal';
import LoadingBar from './loadingbar';
import AbsolutePosition from './absoluteposition';

// Main React app component
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPortalOpened: false,
      someValue: 'init'
    };
  }

  onClose() {
    /*eslint no-console: 0*/
    console.log('Portal closed');
  }

  render() {
    const button1 = <button>Open portal with pseudo modal</button>;
    const button2 = <button>Another portal</button>;
    const button3 = (
      <button onClick={(e) => {
        const bodyRect = document.body.getBoundingClientRect();
        const targetRect = e.target.getBoundingClientRect();
        this.setState({
          isOpened: true,
          top: targetRect.top - bodyRect.top,
          left:  targetRect.left - bodyRect.left,
          width: targetRect.width
        });
      }}>
        {'Open portal on top of button'}
      </button>
    );

    return (
      <div>
        <h1>React portal examples</h1>
        <a href="https://github.com/tajo/react-portal">https://github.com/tajo/react-portal</a>
        <p> </p>

        <Portal closeOnEsc openByClickOn={button1} testProp={this.state.someValue}>
          <PseudoModal>
            <h2>Pseudo Modal</h2>
            <p>This react component is appended to the document body.</p>
            <p>This is <strong>great for a modal, lightbox, loading bar ... etc.</strong>.</p>
            <p>Close this by pressing <strong>ESC</strong>.</p>
            <p><strong>Why psuedo?</strong> Becuase the proper CSS styles are up to you. ;-)</p>
          </PseudoModal>
        </Portal>

        <button onClick={(e) => this.toggleLoadingBar(e)}>
          {this.state.isPortalOpened ? 'Close the second portal' : 'Open the second portal'}
        </button>
        <Portal isOpened={this.state.isPortalOpened} testProp={this.state.someValue}>
          <LoadingBar />
        </Portal>

        <Portal closeOnOutsideClick onClose={this.onClose} openByClickOn={button2}>
          <div style={{border: '1px solid black', margin: 10, padding: 10}}>
            <p>Click anywhere outside of this portal to close it.</p>
          </div>
        </Portal>

        <div className="absolutePosition">
          {button3}
          <Portal
            closeOnOutsideClick
            isOpened={this.state.isOpened}
            onClose={() => {this.setState({isOpened: false}); this.onClose();}}
          >
            <AbsolutePosition left={this.state.left} top={this.state.top} width={this.state.width} />
          </Portal>
        </div>

        <button onClick={(e) => this.changeValue(e)}>
          Change randomly value: {this.state.someValue}
        </button>

      </div>
    );
  }

  toggleLoadingBar(e) {
    this.setState({isPortalOpened: !this.state.isPortalOpened});
  }

  changeValue(e) {
    this.setState({someValue: Math.random().toString(36).substring(7)});
  }

}

ReactDOM.render(<App />, document.getElementById('react-body'));
