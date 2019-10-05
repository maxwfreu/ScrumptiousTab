import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ArchivePanel from '../src/components/InfoModal/ArchivePanel';
import { initialTasks, initialTaskMapping, initialLabelOptions, initialColumns } from '../src/utils';
import ScrumptiousConstants from '../src/components/ScrumptiousConstants';

const mockStore = configureMockStore([thunk]);

describe('<ArchivePanel />', () => {
  const TaskReducer = {
    taskMapping: initialTaskMapping,
    tasks: initialTasks,
    cardNumber: 1,
    editingId: null,
    isFetchingData: true,
    lastCardMoved: '',
    refreshFlag: false,
  };

  const ColumnReducer = {
    columns: initialColumns,
  };

  const LabelReducer = {
    labelOptions: initialLabelOptions,
  };

  const AppSettings = {
    appMode: 100,
    backgroundMode: 0,
    isInfoModalHidden: true,
    isToolbarHidden: false,
    isWobbleDisabled: false,
    name: '',
    isBookMarksVisible: false,
    hasSeenArchive: false,
    panelToShow: 0,
  };

  const storeStateMock = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  let store = mockStore(storeStateMock);

  describe('basics', () => {
    beforeEach(() => {
      const ts1 = new Date(1524496639321);
      const ts2 = new Date();
      storeStateMock.TaskReducer.tasks = {
        ...TaskReducer.tasks,
        'card-id-1': {
          name: '',
          category: 'archivedTasks',
          id: 'card-id-1',
          timestamp: ts1.getTime(),
        },
        'card-id-2': {
          name: '',
          category: 'archivedTasks',
          id: 'card-id-2',
          timestamp: ts2.getTime(),
        },
      };
      storeStateMock.TaskReducer.taskMapping = {
        ...TaskReducer.taskMapping,
        archivedTasks: ['card-id-1', 'card-id-2'],
      };
      store = mockStore(storeStateMock);
      store = mockStore(storeStateMock);
    });

    it('unmounts safely', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ArchivePanel />
        </ReactRedux.Provider>,
      );
      wrapper.unmount();
      expect(wrapper.find('.archive-panel')).to.have.length(0);
    });

    it('renders sections from multiple days', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ArchivePanel />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.archive-date')).to.have.length(2);
    });
  });

  describe('while in empty state', () => {
    it('renders the archive panel', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ArchivePanel />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('ArchivePanel').find('.archive-panel')).to.have.length(1);
    });
  });

  describe('with tasks', () => {
    beforeEach(() => {
      storeStateMock.TaskReducer.tasks = {
        ...TaskReducer.tasks,
        'card-id': {
          name: '',
          category: 'archivedTasks',
          id: 'card-id',
        },
      };
      storeStateMock.TaskReducer.taskMapping = {
        ...TaskReducer.taskMapping,
        archivedTasks: ['card-id'],
      };
      store = mockStore(storeStateMock);
    });
    it('renders the archive panel', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ArchivePanel />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('ArchivePanel').find('.archive-panel')).to.have.length(1);
    });

    it('panel contains card', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ArchivePanel />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('Card')).to.have.length(1);
    });
  });

  describe('interactions', () => {
    beforeEach(() => {
      const ts1 = new Date(1544496639321);
      const ts2 = new Date();
      storeStateMock.TaskReducer.tasks = {
        ...TaskReducer.tasks,
        'card-id-1': {
          name: '',
          category: 'archivedTasks',
          id: 'card-id-1',
          timestamp: ts1.getTime(),
        },
        'card-id-2': {
          name: '',
          category: 'archivedTasks',
          id: 'card-id-2',
          timestamp: ts2.getTime(),
        },
      };
      storeStateMock.TaskReducer.taskMapping = {
        ...TaskReducer.taskMapping,
        archivedTasks: ['card-id-1', 'card-id-2'],
      };
      store = mockStore(storeStateMock);
    });

    it('shows confirmation on clear all', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ArchivePanel />
        </ReactRedux.Provider>,
      );
      let clearBtn = wrapper.find('.archive-button');
      expect(clearBtn.props().style).to.deep.equal({});
      clearBtn.simulate('click');
      clearBtn = wrapper.find('.archive-button');
      expect(clearBtn.props().style).to.deep.equal({
        borderColor: 'red',
        color: 'red',
      });
    });

    it('dispatches clear all action', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ArchivePanel />
        </ReactRedux.Provider>,
      );
      const clearBtn = wrapper.find('.archive-button');
      expect(clearBtn.props().style).to.deep.equal({});
      clearBtn.simulate('click');
      clearBtn.simulate('click');
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.ARCHIVE_CLEAR,
      }]);
    });
  });
});
