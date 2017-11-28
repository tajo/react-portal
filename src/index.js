import ReactDOM from 'react-dom';

import Portalv4 from './Portal';
import LegacyPortal from './LegacyPortal';
import PortalWithState from './PortalWithState';

let Portal;

if (ReactDOM.createPortal) {
  Portal = Portalv4;
} else {
  Portal = LegacyPortal;
}

export { Portal, PortalWithState };
