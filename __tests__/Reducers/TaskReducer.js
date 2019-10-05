import { expect } from 'chai';
import { initialTasks, initialTaskMapping } from '../../src/utils';
import ScrumptiousConstants from '../../src/components/ScrumptiousConstants';
import TaskReducer from '../../src/components/Reducers/TaskReducer';

const initialEmptyMapping = {
  archivedTasks: [],
  done: [],
  inprogress: [],
  openissues: [],
};

describe('Reducers', () => {
  let defaultState;
  const category = 'openissues';
  const task = {
    name: '',
    category,
    id: '123',
    cardNumber: 1,
  };

  beforeEach(() => {
    defaultState = {
      taskMapping: initialTaskMapping,
      tasks: initialTasks,
      cardNumber: 1,
      editingId: null,
      isFetchingData: true,
      lastCardMoved: '',
      isSavingEnabled: false,
      refreshFlag: false,
    };
  });

  it('loads the default state', () => {
    const state = TaskReducer();
    expect(state).to.deep.equal({
      ...defaultState,
      taskMapping: initialEmptyMapping,
      tasks: {},
    });
  });

  it('adds task', () => {
    const action = {
      type: ScrumptiousConstants.TASK_ADD,
      id: task.id,
      category,
    };
    const updatedState = TaskReducer(defaultState, action);

    expect(updatedState).to.deep.equal({
      ...defaultState,
      taskMapping: {
        ...initialTaskMapping,
        [category]: [
          task.id,
          initialTaskMapping[category][0],
        ],
      },
      tasks: {
        ...initialTasks,
        [task.id]: {
          ...task,
        },
      },
      cardNumber: 2,
      editingId: task.id,
    });
  });

  it('adds task on empty board', () => {
    const action = {
      type: ScrumptiousConstants.TASK_ADD,
      id: task.id,
      category,
    };

    const defaultStateCopy = JSON.parse(JSON.stringify({
      ...defaultState,
      taskMapping: initialEmptyMapping,
      tasks: {},
    }));
    const updatedState = TaskReducer(defaultStateCopy, action);
    expect(updatedState).to.deep.equal({
      ...defaultStateCopy,
      taskMapping: {
        ...initialEmptyMapping,
        [category]: [
          task.id,
        ],
      },
      tasks: {
        [task.id]: {
          ...task,
        },
      },
      cardNumber: 2,
      editingId: task.id,
    });
  });

  it('moves task', () => {
    const sourceId = 'openissues';
    const destinationId = 'done';
    const source = {
      index: 0,
      droppableId: 'openissues',
    };
    const destination = {
      index: 0,
      droppableId: 'done',
    };

    const action = {
      type: ScrumptiousConstants.TASK_MOVE,
      sourceId,
      destinationId,
      source,
      destination,
    };
    const updatedState = TaskReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      ...defaultState,
      taskMapping: {
        ...defaultState.taskMapping,
        openissues: [],
        done: [
          defaultState.taskMapping.openissues[0],
          defaultState.taskMapping.done[0],
        ],
      },
      lastCardMoved: defaultState.taskMapping.openissues[0],
    });
  });

  it('sets editing Id', () => {
    const editingId = '123';

    const action = {
      type: ScrumptiousConstants.TASK_SET_EDITING,
      editingId,
    };

    const updatedState = TaskReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      ...defaultState,
      editingId,
    });
  });

  it('reorders task', () => {
    const id = 'openissues';
    const startIndex = 1;
    const endIndex = 0;

    const action = {
      type: ScrumptiousConstants.TASK_REORDER,
      id,
      startIndex,
      endIndex,
    };
    const defaultStateCopy = JSON.parse(JSON.stringify(defaultState));

    defaultStateCopy.taskMapping.openissues.push(task.id);
    defaultStateCopy.tasks[task.id] = task;

    const updatedState = TaskReducer(defaultStateCopy, action);
    expect(updatedState).to.deep.equal({
      ...defaultStateCopy,
      taskMapping: {
        ...defaultStateCopy.taskMapping,
        openissues: [
          defaultStateCopy.taskMapping.openissues[1],
          defaultStateCopy.taskMapping.openissues[0],
        ],
      },
    });
  });

  it('for updating task text', () => {
    const columnId = 'openissues';
    const id = '85ee8698-cc31-47b3-8fdd-c6e6d7c41868';
    const richText = 'new rich text';

    const action = {
      type: ScrumptiousConstants.TASK_TEXT_UPDATE,
      columnId,
      id,
      richText,
    };
    const updatedState = TaskReducer(defaultState, action);
    const updatedTask = defaultState.tasks[id];
    updatedTask.richText = richText;
    expect(updatedState).to.deep.equal({
      ...defaultState,
      tasks: {
        ...defaultState.tasks,
        [id]: {
          ...updatedTask,
        },
      },
    });
  });

  it('for deleting tasks', () => {
    const columnId = 'openissues';
    const id = '85ee8698-cc31-47b3-8fdd-c6e6d7c41868';
    const action = {
      type: ScrumptiousConstants.TASK_DELETE,
      columnId,
      id,
    };
    const defaultStateCopy = JSON.parse(JSON.stringify(defaultState));
    const updatedState = TaskReducer(defaultState, action);
    const idx = defaultStateCopy.taskMapping.openissues.indexOf(id);
    defaultStateCopy.taskMapping.openissues.splice(idx, 1);
    delete defaultStateCopy.tasks[id];
    expect(updatedState).to.deep.equal({
      ...defaultStateCopy,
      editingId: null,
    });
  });

  it('clears all tasks in column', () => {
    const action = {
      type: ScrumptiousConstants.COLUMN_CLEAR,
      id: 'openissues',
    };
    const updatedState = TaskReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      ...defaultState,
      taskMapping: {
        ...defaultState.taskMapping,
        openissues: [],
      },
      tasks: {
        '95a9e853-4c13-46c4-8d6c-ceed565093c9': initialTasks['95a9e853-4c13-46c4-8d6c-ceed565093c9'],
        'b277baf7-f384-4d67-bc29-badbb9abd931': initialTasks['b277baf7-f384-4d67-bc29-badbb9abd931'],
      },
    });
  });

  it('created empty task info on adding column', () => {
    const id = 'new-id';
    const action = {
      type: ScrumptiousConstants.COLUMN_ADD,
      index: 1,
      id,
    };
    const updatedState = TaskReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      ...defaultState,
      taskMapping: {
        ...defaultState.taskMapping,
        [id]: [],
      },
    });
  });

  it('remove tasks and taskmapping entries on column removal', () => {
    const action = {
      type: ScrumptiousConstants.COLUMN_REMOVE,
      category: 'openissues',
    };
    const updatedState = TaskReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      ...defaultState,
      taskMapping: {
        archivedTasks: [],
        done: ['b277baf7-f384-4d67-bc29-badbb9abd931'],
        inprogress: ['95a9e853-4c13-46c4-8d6c-ceed565093c9'],
      },
      tasks: {
        '95a9e853-4c13-46c4-8d6c-ceed565093c9': initialTasks['95a9e853-4c13-46c4-8d6c-ceed565093c9'],
        'b277baf7-f384-4d67-bc29-badbb9abd931': initialTasks['b277baf7-f384-4d67-bc29-badbb9abd931'],
      },
    });
  });

  it('for archiving all tasks in column when archivedTasks is null', () => {
    const action = {
      type: ScrumptiousConstants.COLUMN_ARCHIVE,
    };
    const updatedState = TaskReducer(defaultState, action);
    expect(updatedState.taskMapping).to.deep.equal({
      archivedTasks: ['b277baf7-f384-4d67-bc29-badbb9abd931'],
      done: [],
      inprogress: ['95a9e853-4c13-46c4-8d6c-ceed565093c9'],
      openissues: ['85ee8698-cc31-47b3-8fdd-c6e6d7c41868'],
    });
  });
});
