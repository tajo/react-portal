export const triggerMouse = (node, event, button = 0) => {
  node.dispatchEvent(
    new window.MouseEvent(event, {
      bubbles: true,
      button,
      view: window,
    })
  );
};
