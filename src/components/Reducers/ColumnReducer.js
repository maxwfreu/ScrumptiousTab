import update from 'immutability-helper';
import ScrumptiousConstants, { ColumnSaveEvents } from '../ScrumptiousConstants';
import { saveColumnData } from '../Actions/DBActions';

const initialState = {
  columns: [],
  isSavingEnabled: false,
};

const safelyGetIndex = (arr, id) => (arr.map(e => (e && e.id)).indexOf(id));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ColumnReducer = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  let updatedState = state;

  switch (action.type) {
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_SUCCESS:
      updatedState = update(state, {
        isSavingEnabled: { $set: true },
        columns: { $set: action.columns },
      });
      break;
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_FAILURE:
      updatedState = update(state, {
        isSavingEnabled: { $set: false },
      });
      break;
    case ScrumptiousConstants.REFRESH_COLUMNS: {
      updatedState = update(state, {
        columns: { $set: action.columns },
      });
      break;
    }
    case ScrumptiousConstants.COLUMN_ADD: {
      if (!action.id || !action.index) break;
      const { columns } = state;
      let hasTodo = false;
      let hasDoing = false;
      let hasDone = false;
      let emptyState = '';
      for (let i = 0; i < columns.length; i += 1) {
        const curCol = columns[i];
        if (curCol.emptyState === 'todo') hasTodo = true;
        if (curCol.emptyState === 'doing') hasDoing = true;
        if (curCol.emptyState === 'done') hasDone = true;
      }

      if (!hasTodo) {
        emptyState = 'todo';
      } else if (!hasDoing) {
        emptyState = 'doing';
      } else if (!hasDone) {
        emptyState = 'done';
      }

      const newCol = { id: action.id, title: 'New Column', emptyState };
      updatedState = update(state, {
        columns: { $splice: [[action.index, 0, newCol]] },
      });
      break;
    }
    case ScrumptiousConstants.COLUMN_REMOVE: {
      const { index } = action;
      if (index > state.columns.length) break;
      updatedState = update(state, {
        columns: { $splice: [[action.index, 1]] },
      });
      break;
    }
    case ScrumptiousConstants.COLUMN_REORDER: {
      const { columns } = state;
      const updatedArray = reorder(columns, action.startIndex, action.endIndex);
      updatedState = update(state, {
        columns: { $set: updatedArray },
      });
      break;
    }
    case ScrumptiousConstants.COLUMN_HEADER_UPDATE: {
      const columnIndex = safelyGetIndex(state.columns, action.id);
      if (columnIndex < 0) {
        updatedState = state;
        break;
      }
      updatedState = update(state, {
        columns: {
          [columnIndex]: {
            title: { $set: action.text },
          },
        },
      });
      break;
    }
    default:
      updatedState = state;
      break;
  }

  if (
    process.env.DEMO_BUILD
    || !updatedState.isSavingEnabled
    || action === ScrumptiousConstants.REFRESH_APP
  ) {
    return updatedState;
  }

  if (updatedState.isSavingEnabled && ColumnSaveEvents.includes(action.type)) {
    saveColumnData(updatedState.columns);
  }
  return updatedState;
};

export default ColumnReducer;
