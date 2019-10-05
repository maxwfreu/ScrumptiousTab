import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ScrumBoard from '../src/components/ScrumBoard';
import { initialTasks, initialTaskMapping, initialLabelOptions } from '../src/utils';
import ScrumptiousConstants from '../src/components/ScrumptiousConstants';

const mockStore = configureMockStore([thunk]);

const columns = [
  { id: 'openissues', title: 'To Do', emptyState: 'todo' },
  { id: 'inprogress', title: 'Doing', emptyState: 'doing' },
  { id: 'done', title: 'Done', emptyState: 'done' },
];

describe('<ScrumBoard />', () => {
  let TaskReducer = {
    taskMapping: initialTaskMapping,
    tasks: initialTasks,
    cardNumber: 1,
    editingId: null,
    isFetchingData: false,
    lastCardMoved: '',
    refreshFlag: false,
  };

  let ColumnReducer = {
    columns,
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
    shhMode: false,
    hasSeenArchive: false,
    panelToShow: 0,
    isWelcomeBannerHidden: false,
  };

  let storeStateMock = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  let store = mockStore(storeStateMock);

  describe('basic layout', () => {
    it('renders wrapper', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.column-wrapper')).to.have.length(1);
    });

    it('renders drag drop context', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('DragDropContext')).to.have.length(1);
    });

    it('renders three initial columns', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('Column')).to.have.length(3);
    });

    it('renders more than three initial columns', () => {
      const updatedColumns = columns;
      updatedColumns.push({
        id: 'new-col',
        title: 'New Col',
        emptyState: '',
      });

      TaskReducer = {
        ...TaskReducer,
        taskMapping: {
          ...TaskReducer.taskMapping,
          'new-col': [],
        },
      };

      ColumnReducer = {
        columns: updatedColumns,
      };


      storeStateMock = {
        ...storeStateMock,
        TaskReducer,
        ColumnReducer,
      };

      store = mockStore(storeStateMock);
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('Column')).to.have.length(4);
    });

    it('safely unmounts', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      wrapper.unmount();
      expect(wrapper.find('DragDropContext')).to.have.length(0);
    });
  });

  describe('interactions', () => {
    beforeEach(() => {
      store = mockStore(storeStateMock);
    });

    // it('adds task on hotkey', () => {
    //   const wrapper = mount(
    //     <ReactRedux.Provider store={store}>
    //       <ScrumBoard />
    //     </ReactRedux.Provider>,
    //   );
    //   const wrapperInstance = wrapper.find('ScrumBoard').instance();
    //   wrapperInstance.handleShortCut({
    //     key: 'Enter',
    //     stopPropagation: () => null,
    //     preventDefault: () => null,
    //     target: {
    //       tagName: {
    //         toUpperCase: () => null,
    //       },
    //     },
    //   });
    //   const actions = store.getActions();
    //   expect(actions).to.have.length(1);
    //   expect(actions[0].type).to.equal(ScrumptiousConstants.TASK_ADD);
    //   expect(actions[0].category).to.equal('openissues');
    // });

    // it('doesnt trigger hotkey for incorrect hotkey', () => {
    //   const wrapper = mount(
    //     <ReactRedux.Provider store={store}>
    //       <ScrumBoard />
    //     </ReactRedux.Provider>,
    //   );
    //   const wrapperInstance = wrapper.find('ScrumBoard').instance();
    //   wrapperInstance.handleShortCut({
    //     key: 'b',
    //     stopPropagation: () => null,
    //     preventDefault: () => null,
    //     target: {
    //       tagName: {
    //         toUpperCase: () => null,
    //       },
    //     },
    //   });
    //   const actions = store.getActions();
    //   expect(actions).to.have.length(0);
    // });

    it('moves columns', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      const wrapperInstance = wrapper.find('ScrumBoard').instance();
      wrapperInstance.onDragEnd({
        source: {
          index: 0,
        },
        destination: {
          index: 2,
        },
        type: 'COLUMN',
      });
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.COLUMN_REORDER,
        startIndex: 0,
        endIndex: 2,
      }]);
    });

    it('moves card', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      const wrapperInstance = wrapper.find('ScrumBoard').instance();
      wrapperInstance.onDragEnd({
        source: {
          index: 0,
          droppableId: 'openissues',
        },
        destination: {
          index: 2,
          droppableId: 'done',
        },
        type: 'CARD',
      });
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.TASK_MOVE,
        sourceId: 'openissues',
        destinationId: 'done',
        source: { index: 0, droppableId: 'openissues' },
        destination: { index: 2, droppableId: 'done' },
      }]);
    });

    it('moves card', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      const wrapperInstance = wrapper.find('ScrumBoard').instance();
      wrapperInstance.onDragEnd({
        source: {
          index: 0,
          droppableId: 'openissues',
        },
        destination: {
          index: 1,
          droppableId: 'openissues',
        },
        type: 'CARD',
      });
      const actions = store.getActions();
      expect(actions).to.deep.equal([{
        type: ScrumptiousConstants.TASK_REORDER,
        id: 'openissues',
        startIndex: 0,
        endIndex: 1,
      }]);
    });

    it('moves card', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <ScrumBoard />
        </ReactRedux.Provider>,
      );
      const wrapperInstance = wrapper.find('ScrumBoard').instance();
      wrapperInstance.onDragEnd({});
      const actions = store.getActions();
      expect(actions).to.deep.equal([]);
    });
  });
});
