import * as Portal from '../../lib/portal';
import * as React from 'react';

export const portal = React.createElement(Portal);

portal.props.openPortal();
portal.props.closePortal();