import update from 'immutability-helper';
import ScrumptiousConstants, { SaveEvents } from '../ScrumptiousConstants';
import { saveTaskData } from '../Actions/DBActions';
import { getToday } from '../../utils';

/*
  Maps column id to array of task ids
*/
const initialEmptyMapping = {
  archivedTasks: [],
  done: [],
  inprogress: [],
  openissues: [],
};

const getInitialTaskState = (isFetchingData = true) => ({
  cardNumber: 1,
  taskMapping: initialEmptyMapping,
  tasks: {},
  editingId: null,
  isSavingEnabled: false,
  isFetchingData,
  lastCardMoved: '',
  refreshFlag: false,
});

const initialState = getInitialTaskState();

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const TaskReducer = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }
  let updatedState = state;
  switch (action.type) {
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH:
      updatedState = update(state, {
        isFetchingData: { $set: true },
      });
      break;
    case ScrumptiousConstants.REFRESH_TASK_DATA:
      updatedState = update(state, {
        taskMapping: { $set: action.taskMapping },
        tasks: { $set: action.tasks },
        cardNumber: { $set: action.cardNumber },
        refreshFlag: { $set: !state.refreshFlag },
      });
      break;
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_SUCCESS:
      updatedState = update(state, {
        taskMapping: { $set: action.taskMapping },
        tasks: { $set: action.tasks },
        isFetchingData: { $set: false },
        cardNumber: { $set: action.cardNumber },
        isSavingEnabled: { $set: true },
      });
      break;
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_FAILURE:
      updatedState = update(state, {
        isFetchingData: { $set: false },
        isSavingEnabled: { $set: false },
      });
      break;
    case ScrumptiousConstants.TASK_ADD: {
      const { id, category } = action;
      const newTask = {
        name: '',
        category,
        id,
      };
      newTask.cardNumber = state.cardNumber;
      const emptyTaskMapping = !state.taskMapping[category] || !state.taskMapping[category].length;
      if (emptyTaskMapping) {
        updatedState = update(state, {
          taskMapping: {
            [category]: { $set: [id] },
          },
          tasks: {
            [id]: { $set: newTask },
          },
          cardNumber: { $set: state.cardNumber + 1 },
          editingId: { $set: id },
        });
        break;
      }
      updatedState = update(state, {
        taskMapping: {
          [category]: {
            $splice: [
              [0, 0, id],
            ],
          },
        },
        tasks: {
          [id]: { $set: newTask },
        },
        cardNumber: { $set: state.cardNumber + 1 },
        editingId: { $set: id },
      });
      break;
    }
    case ScrumptiousConstants.TASK_SET_EDITING:
      updatedState = update(state, {
        editingId: { $set: action.editingId },
      });
      break;
    case ScrumptiousConstants.TASK_MOVE: {
      const { taskMapping } = state;
      const task = taskMapping[action.sourceId][action.source.index];
      const updatedArrays = move(
        taskMapping[action.sourceId],
        taskMapping[action.destinationId],
        action.source, action.destination,
      );
      updatedState = update(state, {
        taskMapping: {
          [action.sourceId]: { $set: updatedArrays[action.sourceId] },
          [action.destinationId]: { $set: updatedArrays[action.destinationId] },
        },
        lastCardMoved: { $set: task },
      });
      break;
    }
    case ScrumptiousConstants.TASK_REORDER: {
      const { taskMapping } = state;
      const updatedArray = reorder(taskMapping[action.id], action.startIndex, action.endIndex);
      updatedState = update(state, {
        taskMapping: {
          [action.id]: { $set: updatedArray },
        },
      });
      break;
    }
    case ScrumptiousConstants.TASK_DELETE: {
      if (!state.taskMapping[action.columnId]) break;
      const taskIndex = state.taskMapping[action.columnId].indexOf(action.id);
      if (taskIndex < 0) break;
      updatedState = update(state, {
        taskMapping: {
          [action.columnId]: { $splice: [[taskIndex, 1]] },
        },
        tasks: {
          $unset: [action.id],
        },
        editingId: { $set: null },
      });
      break;
    }
    case ScrumptiousConstants.TASK_RESTORE: {
      if (!state.taskMapping[action.columnId]) break;
      const taskIndex = state.taskMapping[action.columnId].indexOf(action.id);
      if (taskIndex < 0) break;
      updatedState = update(state, {
        taskMapping: {
          [action.columnId]: { $splice: [[taskIndex, 1]] },
          done: { $splice: [[0, 0, action.id]] },
        },
        editingId: { $set: null },
      });
      break;
    }
    case ScrumptiousConstants.TASK_TEXT_UPDATE: {
      if (!state.tasks[action.id]) break;
      updatedState = update(state, {
        tasks: {
          [action.id]: {
            richText: { $set: action.richText },
          },
        },
      });
      break;
    }
    case ScrumptiousConstants.COLUMN_ADD: {
      if (!action.id || !action.index) break;
      updatedState = update(state, {
        taskMapping: {
          [action.id]: { $set: [] },
        },
      });
      break;
    }
    case ScrumptiousConstants.COLUMN_REMOVE: {
      const { category } = action;
      const taskIdsToDelete = state.taskMapping[category];
      if (taskIdsToDelete) {
        updatedState = update(state, {
          taskMapping: {
            $unset: [category],
          },
          tasks: { $unset: taskIdsToDelete },
        });
      } else {
        updatedState = update(state, {
          taskMapping: {
            $unset: [category],
          },
        });
      }
      break;
    }
    case ScrumptiousConstants.COLUMN_CLEAR: {
      const taskIdsToDelete = state.taskMapping[action.id];
      updatedState = update(state, {
        taskMapping: {
          [action.id]: { $set: [] },
        },
        tasks: { $unset: taskIdsToDelete },
      });
      break;
    }
    case ScrumptiousConstants.ARCHIVE_CLEAR: {
      const taskIdsToDelete = state.taskMapping.archivedTasks;
      updatedState = update(state, {
        taskMapping: {
          archivedTasks: { $set: [] },
        },
        tasks: { $unset: taskIdsToDelete },
      });
      break;
    }
    case ScrumptiousConstants.ARCHIVE_SET: {
      if (!state.taskMapping[action.columnId]) break;
      const ts = new Date();
      const taskIndex = state.taskMapping[action.columnId].indexOf(action.id);
      updatedState = update(state, {
        taskMapping: {
          [action.columnId]: { $splice: [[taskIndex, 1]] },
          archivedTasks: { $push: [action.id] },
        },
        tasks: {
          [action.id]: {
            archivedDate: { $set: getToday() },
            timestamp: { $set: ts.getTime() },
            category: { $set: 'archivedTasks' },
          },
        },
        editingId: { $set: null },
      });
      break;
    }
    case ScrumptiousConstants.COLUMN_ARCHIVE: {
      const doneColumnId = 'done';
      const doneTasks = state.taskMapping[doneColumnId];
      const ts = new Date();
      updatedState = update(state, {
        taskMapping: {
          done: { $set: [] },
          archivedTasks: { $push: doneTasks },
        },
        tasks: (tasks) => {
          const updatedTasks = tasks;
          Object.keys(tasks).forEach((taskId) => {
            if (doneTasks.indexOf(taskId) === -1) return;
            updatedTasks[taskId].archivedDate = getToday();
            updatedTasks[taskId].timestamp = ts.getTime();
          });
          return updatedTasks;
        },
      });
      break;
    }
    default:
      updatedState = state;
      break;
  }

  if (process.env.DEMO_BUILD || action === ScrumptiousConstants.REFRESH_APP) return updatedState;

  if (
    !updatedState.isFetchingData
    && updatedState.isSavingEnabled
    && SaveEvents.includes(action.type)
  ) {
    saveTaskData(updatedState.taskMapping, updatedState.tasks, updatedState.cardNumber);
  }
  return updatedState;
};

export default TaskReducer;
