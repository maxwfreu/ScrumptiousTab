import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import LabelOption from '../src/components/Card/CardOptions/LabelOption';
import { initialLabelOptions } from '../src/utils';
import ScrumptiousConstants from '../src/components/ScrumptiousConstants';

const mockStore = configureMockStore([thunk]);

describe('<LabelOption />', () => {
  let store = mockStore({});
  const taskId = 'taskId';
  const columnId = 'columnId';
  const selectedClass = 'selected-class';
  const labelOptions = initialLabelOptions;
  labelOptions['new-label'] = {
    label: '',
    backgroundColor: '#fff',
    color: '#fff',
    tasks: {},
  };
  const key = 'low-priority';
  const option = labelOptions[key];
  const emptyOption = labelOptions['new-label'];
  const activeLabelOverride = null;

  describe('basic options', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="app"></div>';
    });

    it('renders wrapper', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.pick-label-item')).to.have.length(1);
    });

    it('safely unmounts', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.unmount();
      expect(wrapper.find('.pick-label-item')).to.have.length(0);
    });

    it('updates state if active override', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={key}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      const labelOption = wrapper.find('LabelOption');
      expect(labelOption.state('isInputFocused')).to.equal(false);
      labelOption.instance().componentDidUpdate();
      expect(labelOption.state('isInputFocused')).to.equal(true);
    });
  });
  describe('interactions', () => {
    beforeEach(() => {
      store = mockStore({});
      document.body.innerHTML = '<div id="app"></div>';
    });

    it('renders buttons on hover', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.hover-icons.hide')).to.have.length(1);
      wrapper.find('.pick-label-item').simulate('mouseover');
      expect(wrapper.find('.hover-icons.hide')).to.have.length(0);
    });


    it('hides buttons on mouse leave', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.hover-icons.hide')).to.have.length(1);
      wrapper.find('.pick-label-item').simulate('mouseover');
      expect(wrapper.find('.hover-icons.hide')).to.have.length(0);
      wrapper.find('.pick-label-item').simulate('mouseleave');
      expect(wrapper.find('.hover-icons.hide')).to.have.length(1);
    });

    it('focuses on edit click', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.pick-label-color-row')).to.have.length(0);
      wrapper.find('.pick-label-item').simulate('mouseover');
      wrapper.find('.edit-button.right').simulate('click');
      expect(wrapper.find('.pick-label-color-row')).to.have.length(1);
    });

    it('updates input color', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.find('.pick-label-item').simulate('mouseover');
      wrapper.find('.edit-button.right').simulate('click');
      wrapper.find('.pick-label-color-row span').at(0).simulate('click');
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.LABEL_SET_COLOR,
        key: 'low-priority',
        color: '#EC1A45',
      }]);
    });

    it('toggles labels', () => {
      const toggleLabelSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={toggleLabelSpy}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.find('.label-select').simulate('click');
      expect(toggleLabelSpy.called).to.equal(true);
      expect(toggleLabelSpy.calledWith(key)).to.equal(true);
    });

    it('toggles labels on input click', () => {
      const toggleLabelSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={toggleLabelSpy}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.find('input').simulate('click');
      expect(toggleLabelSpy.called).to.equal(true);
      expect(toggleLabelSpy.calledWith(key)).to.equal(true);
    });

    it('sets label on keypress', () => {
      const toggleLabelSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={emptyOption}
            optionKey={key}
            toggleLabel={toggleLabelSpy}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      const instance = wrapper.find('LabelOption').instance();
      instance.handleKeyPress({
        key: 'Enter',
      });
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.LABEL_TEXT_SET,
        key: 'low-priority',
        text: 'Custom Label',
      }]);
    });

    it('sets label on outside click', () => {
      const toggleLabelSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={emptyOption}
            optionKey={key}
            toggleLabel={toggleLabelSpy}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={{
              contains: () => false,
            }}
          />
        </ReactRedux.Provider>,
      );
      const instance = wrapper.find('LabelOption').instance();
      sinon.stub(instance.optionsRef, 'contains').returns(false);
      wrapper.find('.pick-label-item').simulate('mouseover');
      wrapper.find('.edit-button.right').simulate('click');
      instance.handleClickOutside({
        key: 'Enter',
        stopPropagation: () => null,
      });
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.LABEL_TEXT_SET,
        key: 'low-priority',
        text: 'Custom Label',
      }]);
    });

    it('updates input on change', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.find('input').simulate('change', {
        target: {
          value: 'label test',
        },
      });
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.LABEL_TEXT_SET,
        key: 'low-priority',
        text: 'label test',
      }]);
    });

    it('delets label option on click', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <LabelOption
            option={option}
            optionKey={key}
            toggleLabel={() => null}
            selectedClass={selectedClass}
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            activeLabelOverride={activeLabelOverride}
            cardOptionsRef={null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.find('.pick-label-item').simulate('mouseover');
      wrapper.find('.delete-button').simulate('click');
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.LABEL_DELETE,
        key: 'low-priority',
        columnId: 'columnId',
        taskId: 'taskId',
      }]);
    });
  });
});
