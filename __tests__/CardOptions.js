import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ReactRedux from 'react-redux';
import CardOptions from '../src/components/Card/CardOptions';
import { initialTasks, initialTaskMapping, initialLabelOptions as labelOptions, initialColumns } from '../src/utils';
import ScrumptiousConstants from '../src/components/ScrumptiousConstants';

const mockStore = configureMockStore([thunk]);

describe('<CardOptions />', () => {
  const taskID = 'b277baf7-f384-4d67-bc29-badbb9abd931';
  const columnType = 'openissues';

  const TaskReducer = {
    taskMapping: initialTaskMapping,
    tasks: initialTasks,
    cardNumber: 1,
    editingId: null,
    isFetchingData: true,
    lastCardMoved: '',
  };

  const ColumnReducer = {
    columns: initialColumns,
  };

  const LabelReducer = {
    labelOptions,
  };

  const AppSettings = {
    appMode: 100,
    backgroundMode: 0,
    isInfoModalHidden: true,
    isToolbarHidden: false,
    isWobbleDisabled: false,
    name: 'Bender Rodriguez',
    isBookMarksVisible: false,
  };

  const storeStateMock = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  const store = mockStore(storeStateMock);

  describe('renders card options', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="app"></div>';
    });

    it('renders the wrapper', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardOptions
            setLabelRef={() => null}
            deleteTask={() => null}
            selectLabel={() => null}
            pickLabel={false}
            toggleLabel={() => null}
            columnId={columnType}
            taskId={taskID}
            addLabel={() => null}
            isEditing
            isDeleteConfirmed={false}
          />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.card-options-wrapper')).to.have.length(1);
    });

    it('removes label onclick', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardOptions
            setLabelRef={() => null}
            deleteTask={() => null}
            selectLabel={() => null}
            pickLabel={false}
            toggleLabel={() => null}
            columnId={columnType}
            taskId={taskID}
            addLabel={() => null}
            isEditing
            isDeleteConfirmed={false}
          />
        </ReactRedux.Provider>,
      );
      wrapper.find('.remove-label').at(0).simulate('click');
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.LABEL_TASK_REMOVE,
        key: 'urgent',
        columnId: 'openissues',
        taskId: 'b277baf7-f384-4d67-bc29-badbb9abd931',
      }]);
    });

    it('updates active label override', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardOptions
            setLabelRef={() => null}
            deleteTask={() => null}
            selectLabel={() => null}
            pickLabel={false}
            toggleLabel={() => null}
            columnId={columnType}
            taskId={taskID}
            addLabel={() => null}
            isDeleteConfirmed={false}
          />
        </ReactRedux.Provider>,
      );
      wrapper.setState({
        activeLabelOverride: true,
      });
      expect(wrapper.state('activeLabelOverride')).to.equal(true);
    });

    it('updates active label override', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardOptions
            setLabelRef={() => null}
            deleteTask={() => null}
            selectLabel={() => null}
            pickLabel={false}
            toggleLabel={() => null}
            columnId={columnType}
            taskId={taskID}
            addLabel={() => null}
            isDeleteConfirmed={false}
          />
        </ReactRedux.Provider>,
      );
      const prevLabelOptions = Object.assign({}, labelOptions);
      delete prevLabelOptions['low-priority'];
      const instance = wrapper.find('CardOptions').instance();
      instance.componentDidUpdate({
        labelOptions: prevLabelOptions,
      });
      // TODO: verify activeLabelOverride is set correctly
      expect(wrapper.state('activeLabelOverride')).to.equal(undefined);
    });
  });
});
