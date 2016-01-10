// For some reason, have to 'require` jsdom instead of 'import'
var jsdom = require('jsdom');

import Portal from '../lib/portal';
import assert from 'assert';
import { spy } from 'sinon';
import {
  mount,
  spyLifecycle
} from 'enzyme';

describe('react-portal', () => {
  let React;
  beforeEach(() => {
    // Set up JSDOM
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    global.window = document.defaultView;
    global.navigator = {userAgent: 'node.js'};
    // Enzyme library uses React
    React = require('react');
  });

  it('propTypes.children should be required', () => {
    assert.equal(Portal.propTypes.children, React.PropTypes.element.isRequired);
  });

  it('Portal.node should be undefined if portal is not open', () => {
    const wrapper = mount(<Portal><p>Hi</p></Portal>);
    assert.equal(wrapper.instance().node, undefined);
  });

  it('should append portal with children to the document.body', () => {
    const wrapper = mount(<Portal isOpened={true}><p>Hi</p></Portal>);
    assert.equal(wrapper.instance().node.firstElementChild.tagName, 'P');
    assert.equal(document.body.lastElementChild, wrapper.instance().node);
    assert.equal(document.body.childElementCount, 1);
  });

  it('when props.isOpened is false and then set to true should open portal', () => {
    const wrapper = mount(<Portal isOpened={false}><p>Hi</p></Portal>);
    assert.equal(document.body.childElementCount, 0);
    // Enzyme docs say it merges previous props but without children, react complains
    wrapper.setProps({ isOpened: true, children: <p>Hi</p> });
    assert.equal(document.body.lastElementChild, wrapper.instance().node);
    assert.equal(document.body.childElementCount, 1);
  });

  it('when props.isOpened is true and then set to false should close portal', () => {
    const wrapper = mount(<Portal isOpened={true}><p>Hi</p></Portal>);
    assert.equal(document.body.lastElementChild, wrapper.instance().node);
    assert.equal(document.body.childElementCount, 1);
    wrapper.setProps({ isOpened: false, children: <p>Hi</p> });
    assert.equal(document.body.childElementCount, 0);
  });

  it('should pass Portal.closePortal to child component', () => {
    let wrapper;
    let closePortal;
    const Child = (props) => {
      closePortal = props.closePortal;
      return <p>Hi</p>;
    };
    wrapper = mount(<Portal isOpened={true}><Child/></Portal>);
    assert.equal(closePortal, wrapper.instance().closePortal);
  });

  it('should add className to the portal\'s wrapping node', () => {
    const wrapper = mount(<Portal className="some-class" isOpened={true}><p>Hi</p></Portal>);
    assert.equal(document.body.lastElementChild.className, 'some-class');
  });

  it('should add inline style to portal\'s wrapping node', () => {
    const wrapper = mount(<Portal style={{color: 'blue'}} isOpened={true}><p>Hi</p></Portal>);
    assert.equal(document.body.lastElementChild.style.color, 'blue');
  });

  describe('callbacks', () => {
    it('should call props.beforeClose() if passed when calling Portal.closePortal()', () => {
      const props = { isOpened: true, beforeClose: spy() };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      wrapper.instance().closePortal();
      assert(props.beforeClose.calledWith(wrapper.instance().node));
    });

    it('should call props.onOpen() when portal opens', () => {
      const props = { isOpened: true, onOpen: spy() };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      assert(props.onOpen.calledWith(wrapper.instance().node))
    });

    it('should not call props.onOpen() when portal receives props', () => {
      const props = { isOpened: true, onOpen: spy(), className: 'old' };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      assert(props.onOpen.calledOnce);
      wrapper.setProps({ isOpened: true, children: <p>Hi</p>, className: 'new' });
      assert(props.onOpen.calledOnce);
    });

    it('should call props.onUpdate() when portal is opened or receives props', () => {
      const props = { isOpened: true, onUpdate: spy(), className: 'old' };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      assert(props.onUpdate.calledOnce);
      wrapper.setProps({ isOpened: true, children: <p>Hi</p>, className: 'new' });
      assert(props.onUpdate.calledTwice);
    });

    it('should call props.onClose() when portal closes', () => {
      const props = { isOpened: true, onClose: spy() };
      const wrapper = mount(<Portal {...props}><p>Hi</p></Portal>);
      wrapper.instance().closePortal();
      assert(props.onClose.called);
    });
  });

  describe('openByClickOn', () => {
    it('render should return null if no props.openByClickOn', () => {
      spyLifecycle(Portal);
      mount(<Portal><p>Hi</p></Portal>);
      assert.equal(Portal.prototype.render.returnValue, null);
    });

    it('should render the props.openByClickOn element', () => {
      const openByClickOn = <button>button</button>;
      const wrapper = mount(<Portal openByClickOn={openByClickOn}><p>Hi</p></Portal>);
      assert(wrapper.contains(openByClickOn));
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
      const wrapper = mount(<Portal isOpened={true}><p>Hi</p></Portal>);
      wrapper.instance().closePortal();
      assert.equal(document.body.childElementCount, 0);
    });

    it('closeOnEsc', () => {
      mount(<Portal closeOnEsc isOpened><p>Hi</p></Portal>);
      assert.equal(document.body.childElementCount, 1);
      // Had to use actual event since simulating wasn't working due to subtree
      // rendering and actual component returns null
      const kbEvent = new window.KeyboardEvent('keydown', { keyCode: 27 });
      document.dispatchEvent(kbEvent);
      assert.equal(document.body.childElementCount, 0);
    });

    it('closeOnOutsideClick', () => {
      mount(<Portal closeOnOutsideClick isOpened><p>Hi</p></Portal>);
      assert.equal(document.body.childElementCount, 1);
      const mouseEvent = new window.MouseEvent('mousedown', { view: window });
      document.dispatchEvent(mouseEvent);
      assert.equal(document.body.childElementCount, 0);
    });
  });
});
