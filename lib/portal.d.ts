interface PortalProps extends React.Props<any> {
	isOpened?: boolean;
	openByClickOn?: React.ReactElement<any>;
	closeOnEsc?: boolean;
	closeOnOutsideClick?: boolean;
	onOpen?: (domNode: HTMLElement) => void;
	beforeClose?: (domNode: HTMLElement, removeFromDom: () => void) => void;
	onClose?: () => void;
	onUpdate?: () => void;
	closePortal?: () => void;
	openPortal?: () => void;
}

declare const Portal: (props: PortalProps) => JSX.Element;

export = Portal;