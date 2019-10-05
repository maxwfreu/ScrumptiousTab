import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '../src/components/Column';
import { initialTasks, initialTaskMapping, initialLabelOptions } from '../src/utils';
import ScrumptiousConstants from '../src/components/ScrumptiousConstants';

const mockStore = configureMockStore([thunk]);

const columns = [
  { id: 'openissues', title: 'To Do', emptyState: 'todo' },
  { id: 'inprogress', title: 'Doing', emptyState: 'doing' },
  { id: 'done', title: 'Done', emptyState: 'done' },
];

describe('<Column />', () => {
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
  };

  const storeStateMock = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  let store = mockStore(storeStateMock);

  describe('basic layout', () => {
    beforeEach(() => {
      store = mockStore(storeStateMock);
    });

    it('renders wrapper', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <DragDropContext onDragEnd={() => null}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    key="openissues"
                    title="To Do"
                    type="openissues"
                    emptyState="todo"
                    index={0}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.column-wrapper-draggable')).to.have.length(1);
    });

    it('renders dropdown onclick', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <DragDropContext onDragEnd={() => null}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    key="openissues"
                    title="To Do"
                    type="openissues"
                    emptyState="todo"
                    index={0}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ReactRedux.Provider>,
      );
      wrapper.find('.menu-dots').simulate('click');
      expect(wrapper.find('.col-menu-dropdown')).to.have.length(1);
    });
  });

  describe('basic layout', () => {
    beforeEach(() => {
      store = mockStore(storeStateMock);
    });
    it('adds task on click', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <DragDropContext onDragEnd={() => null}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    key="openissues"
                    title="To Do"
                    type="openissues"
                    emptyState="todo"
                    index={0}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ReactRedux.Provider>,
      );
      wrapper.find('.add-task').simulate('click');
      const action = store.getActions();
      expect(action[0].type).to.equal(ScrumptiousConstants.TASK_ADD);
      expect(action[0].category).to.equal('openissues');
    });

    it('updates header on change', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <DragDropContext onDragEnd={() => null}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    key="openissues"
                    title="To Do"
                    type="openissues"
                    emptyState="todo"
                    index={0}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ReactRedux.Provider>,
      );
      const instance = wrapper.find('Column').instance();
      instance.updateColumnHeader({
        target: {
          value: 'new header',
        },
      });
      const action = store.getActions();
      expect(action).to.deep.equal([{
        type: ScrumptiousConstants.COLUMN_HEADER_UPDATE,
        id: 'openissues',
        text: 'new header',
      }]);
    });

    it('prevents default on keydown', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <DragDropContext onDragEnd={() => null}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    key="openissues"
                    title="To Do"
                    type="openissues"
                    emptyState="todo"
                    index={0}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ReactRedux.Provider>,
      );
      const input = wrapper.find('input');
      const eventSpy = sinon.spy();
      const ev = {
        stopPropagation: eventSpy,
        preventDefault: () => null,
        keyCode: 13,
      };
      input.simulate('keydown', ev);
      expect(eventSpy.called).to.equal(true);
    });

    it('updates header on blur', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <DragDropContext onDragEnd={() => null}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    key="openissues"
                    title="To Do"
                    type="openissues"
                    emptyState="todo"
                    index={0}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ReactRedux.Provider>,
      );
      const instance = wrapper.find('Column').instance();
      instance.updateColumnHeaderBlur({
        target: {
          value: 'new header',
        },
      });
      const action = store.getActions();
      expect(action).to.deep.equal([{
        type: ScrumptiousConstants.COLUMN_HEADER_UPDATE,
        id: 'openissues',
        text: 'new header',
      }]);
    });

    it('archives column', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <DragDropContext onDragEnd={() => null}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    key="openissues"
                    title="To Do"
                    type="openissues"
                    emptyState="todo"
                    index={0}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ReactRedux.Provider>,
      );
      const instance = wrapper.find('Column').instance();
      instance.archiveColumn();
      const action = store.getActions();
      expect(action).to.deep.equal([{
        type: ScrumptiousConstants.COLUMN_ARCHIVE,
      }]);
    });

    it('removes column', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <DragDropContext onDragEnd={() => null}>
            <Droppable
              droppableId="board"
              type="COLUMN"
              direction="horizontal"
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Column
                    key="openissues"
                    title="To Do"
                    type="openissues"
                    emptyState="todo"
                    index={0}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ReactRedux.Provider>,
      );
      const instance = wrapper.find('Column').instance();
      instance.removeColumn();
      const action = store.getActions();
      expect(action).to.deep.equal([{
        type: ScrumptiousConstants.COLUMN_REMOVE,
        index: 0,
        category: 'openissues',
      }]);
    });
  });
});
