import ReactDOM from 'react-dom';

import Portalv4 from './Portal';
import LegacyPortal from './LegacyPortal';

let Portal;

if (ReactDOM.createPortal) {
  Portal = Portalv4;
} else {
  Portal = LegacyPortal;
}

export default Portal;
