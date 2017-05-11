import jsdom from 'jsdom';
import Portal from '../lib/portal';
import assert from 'assert';
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
    /*eslint-disable */
    React = require('react');
    /*eslint-enable */
  });

  it('propTypes.children should be required', () => {
    assert.equal(Portal.propTypes.children, PropTypes.element.isRequired);
  });

  it('Portal.node should always be defined if portal present', () => {
    const wrapper = mount(<Portal><p>Hi</p></Portal>);
    assert(wrapper.instance().node instanceof document.defaultView.HTMLDivElement);
  });

  it('should append portal with children to the document.body', () => {
    const wrapper = mount(<Portal isOpen><p>Hi</p></Portal>);
    assert.equal(wrapper.instance().node.firstElementChild.tagName, 'P');
    assert.equal(document.body.lastElementChild, wrapper.instance().node);
    assert.equal(document.body.childElementCount, 1);
  });

  it('should add className to the portal\'s wrapper', () => {
    mount(<Portal className="some-class" isOpen><p>Hi</p></Portal>);
    assert.equal(document.body.lastElementChild.className, 'some-class');
  });

  // style was removed in 3.0
  it('should not add inline style to the portal\'s wrapper', () => {
    mount(<Portal isOpen style={{ color: 'blue' }}><p>Hi</p></Portal>);
    assert.notEqual(document.body.lastElementChild.style.color, 'blue');
  });

  it('should update className on the portal\'s wrapper when props.className changes', () => {
    const wrapper = mount(<Portal className="some-class" isOpen><p>Hi</p></Portal>);
    wrapper.setProps({ className: 'some-other-class', children: <p>Hi</p> });
    assert.equal(document.body.lastElementChild.className, 'some-other-class');
  });

  it('should not update inline style on the portal\'s wrapper when props.style changes', () => {
    const wrapper = mount(<Portal isOpen style={{ color: 'blue' }}><p>Hi</p></Portal>);
    wrapper.setProps({ style: { color: 'red' }, children: <p>Hi</p> });
    assert.notEqual(document.body.lastElementChild.style.color, 'red');
  });
});
