import React from 'react';
import Portal, { PortalTarget } from '../portal';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

test('propTypes.children should be required', () => {
  expect(Portal.propTypes.children).toEqual(PropTypes.element.isRequired);
});

test('should append portal to custom container', () => {
  const targetNode = document.createElement('div');
  const targetID = 'target-attribute';
  targetNode.setAttribute('data-portaltarget', targetID);
  document.body.appendChild(targetNode);

  const wrapper = mount(
    <Portal isOpen target={targetID}>
      <p>Hi</p>
    </Portal>
  );
  expect(wrapper.instance().node.firstElementChild.tagName).toEqual('P');
  expect(targetNode.lastElementChild).toEqual(wrapper.instance().node);
  expect(targetNode.childElementCount).toEqual(1);
});

it('should append portal to portaltarget', () => {
  const targetID = 'target-component';
  const target = mount(<PortalTarget name={targetID} />);
  const targetNode = target.getDOMNode();
  expect(targetNode.getAttribute('data-portaltarget')).toEqual(targetID);
  document.body.appendChild(targetNode);

  const wrapper = mount(
    <Portal isOpen target={targetID}>
      <p>Hi</p>
    </Portal>
  );
  expect(wrapper.instance().node.firstElementChild.tagName).toEqual('P');
  expect(targetNode.lastElementChild).toEqual(wrapper.instance().node);
  expect(targetNode.childElementCount).toEqual(1);
});
