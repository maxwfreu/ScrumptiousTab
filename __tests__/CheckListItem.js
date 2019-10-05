import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import CheckListItem from '../src/components/Card/CheckListItem';

describe('<CheckListItem />', () => {
  describe('renders checklist', () => {
    it('renders the wrapper', () => {
      const wrapper = shallow(
        <CheckListItem
          attributes={{}}
          node={{
            data: {
              get: () => ({}),
            },
          }}
        />,
      ).shallow();
      expect(wrapper.find('input')).to.have.length(1);
    });
  });

  describe('interactions', () => {
    it('does not update if not editing', () => {
      const setNodeByKey = sinon.spy();
      const wrapper = shallow(
        <CheckListItem
          attributes={{}}
          node={{
            data: {
              get: () => ({}),
            },
            key: '123',
          }}
          editor={{
            setNodeByKey,
          }}
          isEditing={false}
        />,
      ).shallow();
      const input = wrapper.find('input');
      input.simulate('change', {
        target: {
          checked: true,
        },
        stopPropagation: () => null,
        preventDefault: () => null,
      });
      expect(setNodeByKey.called).to.equal(false);
    });
    it('updates on change', () => {
      const setNodeByKey = sinon.spy();
      const wrapper = shallow(
        <CheckListItem
          attributes={{}}
          node={{
            data: {
              get: () => ({}),
            },
            key: '123',
          }}
          editor={{
            setNodeByKey,
          }}
          isEditing
        />,
      ).shallow();
      const input = wrapper.find('input');
      input.simulate('change', {
        target: {
          checked: true,
        },
        stopPropagation: () => null,
        preventDefault: () => null,
      });
      expect(setNodeByKey.called).to.equal(true);
      expect(setNodeByKey.calledWith('123', { data: { checked: true } })).to.equal(true);
    });
  });
});
