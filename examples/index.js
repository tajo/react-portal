import React from 'react';
import ReactDOM from 'react-dom';
import ifReact from 'enzyme-adapter-react-helper/build/ifReact';
import { Portal, PortalWithState } from '../src';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPortalOneActive: false,
      isPortalTwoActive: false
    };
  }

  render() {
    return (
      <div>
        <h1>React Portal Examples</h1>
        <p>
          <a href="https://github.com/tajo/react-portal">
            https://github.com/tajo/react-portal
          </a>
        </p>

        <h2>Portal (stateless)</h2>
        <button
          onClick={() =>
            this.setState(prevState => ({
              isPortalOneActive: !prevState.isPortalOneActive
            }))
          }
        >
          Toggle
        </button>
        {this.state.isPortalOneActive && (
          <Portal>
            <p>This thing was portaled!</p>
          </Portal>
        )}

        <h2>Portal (stateless, custom node)</h2>
        <button
          onClick={() =>
            this.setState(prevState => ({
              isPortalTwoActive: !prevState.isPortalTwoActive
            }))
          }
        >
          Toggle
        </button>
        {this.state.isPortalTwoActive && (
          <Portal node={document && document.getElementById('user-node')}>
            <p>This thing was portaled with custom node!</p>
          </Portal>
        )}

        <h2>PortalWithState</h2>
        <PortalWithState closeOnOutsideClick closeOnEsc>
          {ifReact(
            '< 16.2',
            ({ openPortal, closePortal, isOpen, portal }) => (
              <div>
                <button key="foo" onClick={openPortal}>
                  Open Portal {isOpen && '(this counts as an outside click)'}
                </button>
                {portal(
                  <p>
                    This is more advanced Portal. It handles its own state.{' '}
                    <button onClick={closePortal}>Close me!</button>, hit ESC or
                    click outside of me.
                  </p>
                )}
              </div>
            ),
            ({ openPortal, closePortal, isOpen, portal }) => (
              <React.Fragment>
                <button onClick={openPortal}>
                  Open Portal {isOpen && '(this counts as an outside click)'}
                </button>
                {portal(
                  <p>
                    This is more advanced Portal. It handles its own state.{' '}
                    <button onClick={closePortal}>Close me!</button>, hit ESC or
                    click outside of me.
                  </p>
                )}
              </React.Fragment>
            )
          )}
        </PortalWithState>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
