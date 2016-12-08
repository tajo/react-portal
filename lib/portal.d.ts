interface PortalProps extends __React.Props<any> {
	isOpened?: boolean;
	openByClickOn?: __React.ReactElement<any>;
	closeOnEsc?: boolean;
	closeOnOutsideClick?: boolean;
	onOpen?: (domNode: HTMLElement) => void;
	onBeforeClose?: (domNode: HTMLElement, removeFromDom: () => void) => void;
	onClose?: () => void;
	onUpdate?: () => void;
}

declare const Portal: (props: PortalProps) => JSX.Element;

export = Portal;