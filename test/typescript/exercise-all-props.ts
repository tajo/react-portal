import * as Portal from '../../lib/portal';
import * as React from 'react';

let beforeClosed = false;
let closed = false;
let removedFromDom = false;
let openedWithDomNode;
let updated = false;

export const portal = React.createElement(Portal, {
    isOpened: true,
    openByClickOn: React.createElement('div'),
    closeOnEsc: true,
    closeOnOutsideClick: false,
    onOpen: function (domNode: HTMLElement) { return openedWithDomNode = domNode; },
    beforeClose: function (domNode: HTMLElement, removeFromDom: () => void) { beforeClosed = true; removeFromDom(); },
    onClose: function () { return closed = true; },
    onUpdate: function () { return updated = true; },
    children: React.createElement('div')
});
