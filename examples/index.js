import React from 'react';
import ReactDOM from 'react-dom';
import Portal from '../src/portal.js';
import PseudoModal from './pseudomodal';
import LoadingBar from './loadingbar';
import AbsolutePosition from './absoluteposition';
import TWEEN from 'tween.js';

// Main React app component
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPortalOpened: false,
      someValue: 'init',
    };
  }

  onClose() {
    /* eslint no-console: 0 */
    console.log('Portal closed');
  }

  onOpen(node) {
    new TWEEN.Tween({ opacity: 0 })
      .to({ opacity: 1 }, 500)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(function() {  // eslint-disable-line
        node.style.opacity = this.opacity;  // eslint-disable-line
      })
      .start();
  }

  beforeClose(node, removeFromDom) {
    new TWEEN.Tween({ opacity: 1 })
      .to({ opacity: 0 }, 500)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(function() {  // eslint-disable-line
        node.style.opacity = this.opacity; // eslint-disable-line
      })
      .onComplete(removeFromDom)
      .start();
  }

  toggleLoadingBar() {
    this.setState({ isPortalOpened: !this.state.isPortalOpened });
  }

  changeValue() {
    this.setState({ someValue: Math.random().toString(36).substring(7) });
  }

  render() {
    const buttonStyles = {
      padding: 10,
      fontSize: 20,
      marginBottom: 10,
    };
    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);

    const button1 = <button style={buttonStyles}>Open portal with pseudo modal</button>;
    const button2 = <button style={buttonStyles}>Another portal</button>;
    const button3 = (
      <button
        onClick={(e) => {
          const bodyRect = document.body.getBoundingClientRect();
          const targetRect = e.target.getBoundingClientRect();
          this.setState({
            isOpen: true,
            top: targetRect.top - bodyRect.top,
            left: targetRect.left - bodyRect.left,
            width: targetRect.width,
          });
        }}
        style={buttonStyles}
      >
        {'Open portal on top of button'}
      </button>
    );
    const button4 = <button style={buttonStyles}>Animation Example</button>;

    return (
      <div style={{ border: '2px solid red', margin: 10, padding: 10 }}>
        <h1>React portal examples</h1>
        <a href="https://github.com/tajo/react-portal">https://github.com/tajo/react-portal</a>
        <p> </p>

        <Portal closeOnEsc openByClickOn={button1} testProp={this.state.someValue}>
          <PseudoModal>
            <h2>Pseudo Modal</h2>
            <p>This react component is appended to the document body.</p>
            <p>This is <strong>great for a modal, lightbox, loading bar ... etc.</strong>.</p>
            <p>Close this by pressing <strong>ESC</strong>.</p>
            <p><strong>Why psuedo?</strong> Because the proper CSS styles are up to you. ;-)</p>
          </PseudoModal>
        </Portal>

        <button onClick={(e) => this.toggleLoadingBar(e)} style={buttonStyles}>
          {this.state.isPortalOpened ? 'Close the second portal' : 'Open the second portal'}
        </button>
        <Portal isOpen={this.state.isPortalOpened} testProp={this.state.someValue}>
          <LoadingBar />
        </Portal>

        <Portal closeOnOutsideClick onClose={this.onClose} openByClickOn={button2}>
          <div style={{ border: '1px solid black', margin: 10, padding: 10 }}>
            <p>Click anywhere outside of this portal to close it.</p>
          </div>
        </Portal>

        <div>
          {button3}
          <Portal
            closeOnOutsideClick
            isOpen={this.state.isOpen}
            onClose={() => { this.setState({ isOpen: false }); this.onClose(); }}
          >
            <AbsolutePosition
              left={this.state.left}
              top={this.state.top}
              width={this.state.width}
            />
          </Portal>
        </div>

        <button onClick={(e) => this.changeValue(e)} style={buttonStyles}>
          Change randomly value: {this.state.someValue}
        </button>

        <Portal
          beforeClose={this.beforeClose}
          closeOnEsc
          closeOnOutsideClick
          onOpen={this.onOpen}
          openByClickOn={button4}
          style={{ opacity: 0 }}
        >
          <div style={{ border: '1px solid black', margin: 10, padding: 10 }}>
            <p>Trigger Animations, or any arbitrary function,{' '}
            before removing the portal from the DOM, animates out{' '}
            on both click outside and on esc press</p>
          </div>
        </Portal>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
