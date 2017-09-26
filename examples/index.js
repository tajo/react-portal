import React from 'react';
import ReactDOM from 'react-dom';
import DummyPortal from '../src/dummyportal.js';
import PseudoModal from './pseudomodal';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPortalActive: false
    };
  }

  render() {
    return (
      <div>
        <h1>React portal examples</h1>
        <a href="https://github.com/tajo/react-portal">
          https://github.com/tajo/react-portal
        </a>
        <button
          onClick={() =>
            this.setState(prevState => ({
              isPortalActive: !prevState.isPortalActive
            }))}
        >
          Toggle
        </button>
        {this.state.isPortalActive && (
          <DummyPortal>
            <PseudoModal>
              <h2>Pseudo Modal</h2>
              <p>This react component is appended to the document bodyyy.</p>
              <p>
                This is{' '}
                <strong>
                  great for a modal, lightbox, loading bar ... etc.
                </strong>.
              </p>
              <p>
                Close this by pressing <strong>ESC</strong>.
              </p>
              <p>
                <strong>Why psuedo?</strong> Because the proper CSS styles are
                up to you. ;-)
              </p>
            </PseudoModal>
          </DummyPortal>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
