import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import * as TaskActions from '../../src/components/Actions/TaskActions';
import {
  initialTasks,
  initialTaskMapping,
  initialLabelOptions,
} from '../../src/utils';
import ScrumptiousConstants from '../../src/components/ScrumptiousConstants';

const mockStore = configureMockStore([thunk]);

const initialColumns = [
  { id: 'openissues', title: 'To Do', emptyState: 'todo' },
  { id: 'inprogress', title: 'Doing', emptyState: 'doing' },
  { id: 'done', title: 'Done', emptyState: 'done' },
];

describe('<TasksActions />', () => {
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
  };

  const defaultState = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  let store;
  let clock;
  describe('task actions', () => {
    beforeEach(() => {
      store = mockStore(defaultState);
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });


    it('for adding tasks', () => {
      const category = 'openissues';
      const task = {
        name: '',
        category,
        id: '123',
      };
      const expectedActions = [
        {
          type: ScrumptiousConstants.TASK_ADD,
          id: task.id,
          category,
        },
      ];
      store.dispatch(TaskActions.addTask(task.id, category));
      clock.tick(500);
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for deleting tasks', () => {
      const columnId = 'openissues';
      const id = '123';
      const expectedActions = [{
        type: ScrumptiousConstants.TASK_DELETE,
        columnId,
        id,
      }];
      store.dispatch(TaskActions.deleteTask(columnId, id));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for updating task text', () => {
      const columnId = 'openissues';
      const id = '123';
      const richText = {};

      const expectedActions = [{
        type: ScrumptiousConstants.TASK_TEXT_UPDATE,
        columnId,
        id,
        richText,
      }];
      store.dispatch(TaskActions.updateRichText(columnId, id, richText));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for adding task to archive', () => {
      const columnId = 'openissues';
      const id = '123';

      const expectedActions = [{
        type: ScrumptiousConstants.ARCHIVE_SET,
        columnId,
        id,
      }];
      store.dispatch(TaskActions.archiveTask(columnId, id));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for moving task', () => {
      const sourceId = 'source';
      const destinationId = 'destination';
      const source = {};
      const destination = {};

      const expectedActions = [{
        type: ScrumptiousConstants.TASK_MOVE,
        sourceId,
        destinationId,
        source,
        destination,
      }];
      store.dispatch(TaskActions.moveTask(sourceId, destinationId, source, destination));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for reordering task', () => {
      const id = 'source';
      const startIndex = 1;
      const endIndex = 0;

      const expectedActions = [{
        type: ScrumptiousConstants.TASK_REORDER,
        id,
        startIndex,
        endIndex,
      }];
      store.dispatch(TaskActions.reorderTask(id, startIndex, endIndex));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });
  });
});
