import jsdom from 'jsdom';
import Portal from '../lib/portal';
import assert from 'assert';
import { spy } from 'sinon';
import { render, unmountComponentAtNode } from 'react-dom';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

describe('react-portal', () => {
  let React;
  beforeEach(() => {
    // Set up JSDOM
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    global.window = document.defaultView;
    global.navigator = { userAgent: 'node.js' };
    // Enzyme library uses React
    // eslint-disable-next-line global-require
    React = require('react');
  });

  it('propTypes.children should be required', () => {
    assert.equal(Portal.propTypes.children, PropTypes.element.isRequired);
  });

  it('Portal.node should be undefined if portal is not open', () => {
    const wrapper = mount(<Portal><p>Hi</p></Portal>);
    assert.equal(wrapper.instance().node, undefined);
  });

  it('should append portal with children to the document.body', () => {
    const wrapper = mount(<Portal isOpen><p>Hi</p></Portal>);
    assert.equal(wrapper.instance().node.firstElementChild.tagName, 'P');
    assert.equal(document.body.lastElementChild, wrapper.instance().node);
    assert.equal(document.body.childElementCount, 1);
  });

  it('should open when this.openPortal() is called (used to programmatically open portal)', () => {
    const wrapper = mount(<Portal><p>Hi</p></Portal>);
    assert.equal(document.body.childElementCount, 0);
    wrapper.instance().openPortal();
    assert.equal(wrapper.instance().node.firstElementChild.tagName, 'P');
  });

  it('when props.isOpen is false and then set to true should open portal', () => {
    const wrapper = mount(<Portal isOpen={false}><p>Hi</p></Portal>);
    assert.equal(document.body.childElementCount, 0);
    // Enzyme docs say it merges previous props but without children, react complains
    wrapper.setProps({ isOpen: true, children: <p>Hi</p> });
    assert.equal(document.body.lastElementChild, wrapper.instance().node);
    assert.equal(document.body.childElementCount, 1);
  });

  it('when props.isOpen is true and then set to false should close portal', () => {
    const wrapper = mount(<Portal isOpen><p>Hi</p></Portal>);
    assert.equal(document.body.lastElementChild, wrapper.instance().node);
    assert.equal(document.body.childElementCount, 1);
    wrapper.setProps({ isOpen: false, children: <p>Hi</p> });
    assert.equal(document.body.childElementCount, 0);
  });

  it('should pass Portal.closePortal to child component', () => {
    let closePortal;
    const Child = (props) => {
      // eslint-disable-next-line react/prop-types
      closePortal = props.closePortal;
      return <p>Hi</p>;
    };
    const wrapper = mount(<Portal isOpen><Child /></Portal>);
    assert.equal(closePortal, wrapper.instance().closePortal);
  });

  // style & className were removed in 3.0
  it('should not add className to the portal\'s wrapper', () => {
    mount(<Portal className="some-class" isOpen><p>Hi</p></Portal>);
    assert.notEqual(document.body.lastElementChild.className, 'some-class');
  });

  it('should not add inline style to the portal\'s wrapper', () => {
    mount(<Portal isOpen style={{ color: 'blue' }}><p>Hi</p></Portal>);
    assert.notEqual(document.body.lastElementChild.style.color, 'blue');
  });

  it('should not update className on the portal\'s wrapper when props.className changes', () => {
    const wrapper = mount(<Portal className="some-class" isOpen><p>Hi</p></Portal>);
    wrapper.setProps({ className: 'some-other-class', children: <p>Hi</p> });
    assert.notEqual(document.body.lastElementChild.className, 'some-other-class');
  });

  it('should not update inline style on the portal\'s wrapper when props.style changes', () => {
    const wrapper = mount(<Portal isOpen style={{ color: 'blue' }}><p>Hi</p></Portal>);
    wrapper.setProps({ style: { color: 'red' }, children: <p>Hi</p> });
    assert.notEqual(document.body.lastElementChild.style.color, 'red');
  });

  describe('callbacks', () => {
    it('should call props.beforeClose() if passed when calling Portal.closePortal()', () => {
      const props = { isOpen: true, beforeClose: spy() };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      wrapper.instance().closePortal();
      assert(props.beforeClose.calledOnce);
      assert(props.beforeClose.calledWith(wrapper.instance().node));
    });

    it('should call props.beforeClose() only 1x even if closePortal is called more times', () => {
      const props = { isOpen: true, beforeClose: spy((node, cb) => cb()) };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      wrapper.instance().closePortal();
      wrapper.instance().closePortal();
      assert(props.beforeClose.calledOnce);
    });

    it('should call props.onOpen() when portal opens', () => {
      const props = { isOpen: true, onOpen: spy() };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      assert(props.onOpen.calledOnce);
      assert(props.onOpen.calledWith(wrapper.instance().node));
    });

    it('should not call props.onOpen() when portal receives props', () => {
      const props = { isOpen: true, onOpen: spy(), className: 'old' };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      assert(props.onOpen.calledOnce);
      wrapper.setProps({ isOpen: true, children: <p>Hi</p>, className: 'new' });
      assert(props.onOpen.calledOnce);
    });

    it('should call props.onUpdate() after calling props.onOpen()', () => {
      const props = { isOpen: true, onOpen: spy(), onUpdate: spy() };
      mount(<Portal {...props}><p>Hi</p></Portal>);
      assert(props.onUpdate.calledAfter(props.onOpen));
    });

    it('should call props.onUpdate() when portal is opened or receives props', () => {
      const props = { isOpen: true, onUpdate: spy(), className: 'old' };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      assert(props.onUpdate.calledOnce);
      wrapper.setProps({ isOpen: true, children: <p>Hi</p>, className: 'new' });
      assert(props.onUpdate.calledTwice);
    });

    it('should call props.onClose() when portal closes', () => {
      const props = { isOpen: true, onClose: spy() };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      wrapper.instance().closePortal();
      assert(props.onClose.calledOnce);
    });

    it('should call props.onClose() only once even if closePortal is called multiple times', () => {
      const props = { isOpen: true, onClose: spy() };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      wrapper.instance().closePortal();
      wrapper.instance().closePortal();
      assert(props.onClose.calledOnce);
    });

    it('should call props.onClose() only once when portal closes and then is unmounted', () => {
      const div = document.createElement('div');
      const props = { isOpen: true, onClose: spy() };
      const component = render(<Portal {...props}><p>Hi</p></Portal>, div);
      component.closePortal();
      unmountComponentAtNode(div);
      assert(props.onClose.calledOnce);
    });

    it('should call props.onClose() only once when directly unmounting', () => {
      const div = document.createElement('div');
      const props = { isOpen: true, onClose: spy() };
      render(<Portal {...props}><p>Hi</p></Portal>, div);
      unmountComponentAtNode(div);
      assert(props.onClose.calledOnce);
    });

    it('should not call this.setState() if portal is unmounted', () => {
      const div = document.createElement('div');
      const props = { isOpen: true };
      const wrapper = render(<Portal {...props}><p>Hi</p></Portal>, div);
      spy(wrapper, 'setState');
      unmountComponentAtNode(div);
      assert.equal(wrapper.setState.callCount, 0);
    });
  });

  describe('openByClickOn', () => {
    it('render should return null if no props.openByClickOn', () => {
      spy(Portal.prototype, 'render');
      mount(<Portal><p>Hi</p></Portal>);
      assert.equal(Portal.prototype.render.returnValue, null);
      Portal.prototype.render.restore();
    });

    it('should render the props.openByClickOn element', () => {
      const text = 'open by click on me';
      const openByClickOn = <button>${text}</button>;
      const wrapper = mount(<Portal openByClickOn={openByClickOn}><p>Hi</p></Portal>);
      assert(wrapper.text(text));
    });

    it('should open portal when clicking openByClickOn element', () => {
      const openByClickOn = <button>button</button>;
      const wrapper = mount(<Portal openByClickOn={openByClickOn}><p>Hi</p></Portal>);
      wrapper.find('button').simulate('click');
      assert.equal(document.body.lastElementChild, wrapper.instance().node);
    });
  });

  describe('close actions', () => {
    it('Portal.closePortal()', () => {
      const wrapper = mount(<Portal isOpen><p>Hi</p></Portal>);
      wrapper.instance().closePortal();
      assert.equal(document.body.childElementCount, 0);
    });

    it('closeOnEsc', () => {
      mount(<Portal closeOnEsc isOpen><p>Hi</p></Portal>);
      assert.equal(document.body.childElementCount, 1);
      // Had to use actual event since simulating wasn't working due to subtree
      // rendering and actual component returns null
      const kbEvent = new window.KeyboardEvent('keydown', { keyCode: 27 });
      document.dispatchEvent(kbEvent);
      assert.equal(document.body.childElementCount, 0);
    });

    it('closeOnOutsideClick', () => {
      mount(<Portal closeOnOutsideClick isOpen><p>Hi</p></Portal>);
      assert.equal(document.body.childElementCount, 1);

      // Should not close when outside click isn't a main click
      const rightClickMouseEvent = new window.MouseEvent('mouseup', { view: window, button: 2 });
      document.dispatchEvent(rightClickMouseEvent);
      assert.equal(document.body.childElementCount, 1);

      // Should close when outside click is a main click (typically left button click)
      const leftClickMouseEvent = new window.MouseEvent('mouseup', { view: window, button: 0 });
      document.dispatchEvent(leftClickMouseEvent);
      assert.equal(document.body.childElementCount, 0);
    });
  });
});
