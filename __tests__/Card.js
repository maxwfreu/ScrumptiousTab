import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Value } from 'slate';
import sinon from 'sinon';
import Card from '../src/components/Card';
import { initialTasks, initialTaskMapping, initialLabelOptions, initialColumns } from '../src/utils';

const mockStore = configureMockStore([thunk]);

describe('<Card />', () => {
  // Create our initial value...
  // const initialValue = () => Value.fromJSON({
  //   document: {
  //     key: `${+(new Date())}`,
  //     nodes: [
  //       {
  //         kind: 'block',
  //         type: 'paragraph',
  //         nodes: [
  //           {
  //             kind: 'text',
  //             leaves: [{ text: '' }],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // });
  // const tasks = initialTasks;
  // const taskContent = JSON.stringify(initialValue().toJSON());
  // const mockTask = {
  //   name: 'This is a task',
  //   category: 'openissues',
  //   content: taskContent,
  //   id: 'card-id',
  //   labels: [],
  // };
  // tasks.openissues.push(mockTask);
  let storeStateMock;
  let store;

  describe('while not editing', () => {
    beforeEach(() => {
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

      storeStateMock = {
        AppSettings,
        TaskReducer,
        ColumnReducer,
        LabelReducer,
      };

      store = mockStore(storeStateMock);
    });
    it('renders the basic card with editor', () => {
      const shallowWrapper = mount(
        <ReactRedux.Provider store={store}>
          <Card
            taskId="85ee8698-cc31-47b3-8fdd-c6e6d7c41868"
            task={initialTasks['85ee8698-cc31-47b3-8fdd-c6e6d7c41868']}
            type="openissues"
            draggableRef={React.createRef()}
            draggableProps={{}}
            dragHandleProps={{}}
          />
        </ReactRedux.Provider>,
      );
      expect(shallowWrapper.find('.card')).to.have.length(1);
    });

    it('renders the basic card with editor', () => {
      const mountedWrapper = mount(
        <ReactRedux.Provider store={store}>
          <Card
            taskId="85ee8698-cc31-47b3-8fdd-c6e6d7c41868"
            task={initialTasks['85ee8698-cc31-47b3-8fdd-c6e6d7c41868']}
            type="openissues"
            draggableRef={React.createRef()}
            draggableProps={{}}
            dragHandleProps={{}}
          />
        </ReactRedux.Provider>,
      );
      expect(mountedWrapper.find('CardEditor')).to.have.length(1);
    });
  });

  describe('while editing', () => {
    beforeEach(() => {
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

      storeStateMock = {
        AppSettings,
        TaskReducer,
        ColumnReducer,
        LabelReducer,
      };

      store = mockStore(storeStateMock);
    });
    it('updates to editing mode on click', () => {
      const shallowWrapper = mount(
        <ReactRedux.Provider store={store}>
          <Card
            taskId="85ee8698-cc31-47b3-8fdd-c6e6d7c41868"
            task={initialTasks['85ee8698-cc31-47b3-8fdd-c6e6d7c41868']}
            type="openissues"
            draggableRef={React.createRef()}
            draggableProps={{}}
            dragHandleProps={{}}
          />
        </ReactRedux.Provider>,
      );
      const propagationSpy = sinon.spy();
      shallowWrapper.find('.card-wrapper').simulate('click', { stopPropagation: propagationSpy });
      expect(propagationSpy.called).to.equal(true);
    });
  });
});
