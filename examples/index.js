import React from 'react';
import ReactDOM from 'react-dom';
import Portal from '../lib/portal';
import PseudoModal from './pseudomodal';
import LoadingBar from './loadingbar';
import AbsolutePosition from './absoluteposition';
import DocumentEvents from 'react-document-events';
import TWEEN from 'tween.js';

const buttonStyles = {
  padding: 10,
  fontSize: 20,
  marginBottom: 10,
};

// Main React app component
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      portal1Open: false,
      portal2Open: false,
      portal3Open: false,
      portal4Open: false,
      portal5Open: false,
    };
  }

  componentDidMount() {
    requestAnimationFrame(function animate(time) {
      TWEEN.update(time);
      requestAnimationFrame(animate);
    });
  }

  onAnimOpen(node) {
    new TWEEN.Tween({ opacity: 0 })
      .to({ opacity: 1 }, 500)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(function() {  // eslint-disable-line
        node.style.opacity = this.opacity;  // eslint-disable-line
      })
      .start();
  }

  onAnimClose(node, cb) {
    new TWEEN.Tween({ opacity: 1 })
      .to({ opacity: 0 }, 500)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(function() {  // eslint-disable-line
        node.style.opacity = this.opacity; // eslint-disable-line
      })
      .onComplete(cb)
      .start();
  }

  onPortal4Click(e) {
    if (!e) return this.setState({ portal4Open: !this.state.portal4Open });
    const bodyRect = document.body.getBoundingClientRect();
    const targetRect = e.target.getBoundingClientRect();
    this.setState({
      portal4Open: !this.state.portal4Open,
      top: targetRect.top - bodyRect.top,
      left: targetRect.left - bodyRect.left,
      width: targetRect.width,
    });
    return null;
  }

  onPortal5Click() {
    const { portal5Open } = this.state;
    if (!portal5Open) {
      // Opening
      this.setState({ portal5Open: true }, () => {
        const node = this.portal5;
        if (!node) return;
        this.onAnimOpen(this.portal5);
      });
    } else {
      // Closing
      const node = this.portal5;
      if (!node) return;
      this.onAnimClose(node, () => {
        this.setState({ portal5Open: false });
      });
    }
  }

  // Simulate click events from old lib
  closeOnClickOutside(e, idx) {
    const node = this[`portal${idx}`];
    if (!node) return;
    let el = e.target;
    do { // eslint-disable-line no-cond-assign
      if (el === node) return;
    } while (el = el.parentNode);
    this.togglePortal(idx);
  }

  closeOnEsc(e, idx) {
    return e.keyCode === 27 && this.togglePortal(idx);
  }

  togglePortal(idx, cb) {
    if (this[`onPortal${idx}Click`]) return this[`onPortal${idx}Click`]();
    const key = `portal${idx}Open`;
    this.setState({ [key]: !this.state[key] }, cb);
    return null;
  }

  render() {
    const { portal1Open, portal2Open, portal3Open, portal4Open, portal5Open } = this.state;

    return (
      <div style={{ border: '2px solid red', margin: 10, padding: 10 }}>
        <h1>React portal examples</h1>
        <a href="https://github.com/strml/react-portal-minimal">https://github.com/strml/react-portal-minimal</a>
        <p />

        {/* 1 */}
        {portal1Open ?
          <Portal>
            <PseudoModal closePortal={() => this.togglePortal(1)}>
              <DocumentEvents onKeyDown={(e) => this.closeOnEsc(e, 1)} />
              <h2>Pseudo Modal</h2>
              <p>This react component is appended to the document body.</p>
              <p>This is <strong>great for a modal, lightbox, loading bar ... etc.</strong>.</p>
              <p>Close this by pressing <strong>ESC</strong>.</p>
              <p><strong>Why psuedo?</strong> Because the proper CSS styles are up to you. ;-)</p>
            </PseudoModal>
          </Portal>
        : null}
        <button
          style={buttonStyles}
          onClick={() => this.togglePortal(1)}
        >
          Open portal with pseudo modal
        </button>

        {/* 2 */}
        <button onClick={() => this.togglePortal(2)} style={buttonStyles}>
          {portal2Open ? 'Close the second portal' : 'Open the second portal'}
        </button>
        {portal2Open ?
          <Portal>
            <LoadingBar />
          </Portal>
        : null}

        {/* 3 */}
        {portal3Open ?
          <Portal>
            <div
              style={{ border: '1px solid black', margin: 10, padding: 10 }}
              ref={(c) => (this.portal3 = c)}
            >
              <DocumentEvents onClick={(e) => this.closeOnClickOutside(e, 3)} />
              <p>Click anywhere outside of this portal to close it.</p>
            </div>
          </Portal>
        : null}
        <button style={buttonStyles} onClick={() => this.togglePortal(3)}>Another portal</button>

        {/* 4 */}
        <div>
          <button onClick={(e) => this.onPortal4Click(e)} style={buttonStyles}>
            Open portal on top of button
          </button>
          {portal4Open ?
            <Portal>
              <span ref={(c) => (this.portal4 = c)}>
                <DocumentEvents onClick={(e) => this.closeOnClickOutside(e, 4)} />
                <AbsolutePosition
                  left={this.state.left}
                  top={this.state.top}
                  width={this.state.width}
                />
              </span>
            </Portal>
          : null}
        </div>

        {/* 5 */}
        {portal5Open ?
          <Portal>
            <div
              style={{ border: '1px solid black', margin: 10, padding: 10 }}
              ref={(c) => (this.portal5 = c)}
            >
              <DocumentEvents
                onClick={(e) => this.closeOnClickOutside(e, 5)}
                onKeyDown={(e) => this.closeOnEsc(e, 5)}
              />
              <p>
                Trigger Animations, or any arbitrary function,
                before removing the portal from the DOM.
                The portal will animate out on both click outside and on ESC press.
              </p>
            </div>
          </Portal>
        : null}
        <button
          style={buttonStyles}
          onClick={() => this.onPortal5Click()}
        >
          Animation Example
        </button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
