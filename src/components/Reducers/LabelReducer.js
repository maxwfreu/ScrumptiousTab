import update from 'immutability-helper';
import ScrumptiousConstants, { LabelSaveEvents } from '../ScrumptiousConstants';
import { saveLabelOptions } from '../Actions/DBActions';

require('babel-polyfill');

const getInitialLabelState = () => ({
  labelOptions: {},
  isSavingEnabled: false,
});

const initialState = getInitialLabelState();

const LabelReducer = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }
  let updatedState = state;
  switch (action.type) {
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_SUCCESS:
      updatedState = update(state, {
        isSavingEnabled: { $set: true },
        labelOptions: { $set: action.labelOptions },
      });
      break;
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_FAILURE:
      updatedState = update(state, {
        isSavingEnabled: { $set: false },
      });
      break;
    case ScrumptiousConstants.REFRESH_LABELS: {
      updatedState = update(state, {
        labelOptions: { $set: action.labelOptions },
      });
      break;
    }
    case ScrumptiousConstants.LABEL_SELECTED_SET: {
      const label = state.labelOptions[action.label];
      if (!label) break;
      let taskHasLabel = false;
      const validKey = (action.id in label.tasks);
      if (validKey && label.tasks[action.id]) taskHasLabel = true;
      updatedState = update(state, {
        labelOptions: {
          [action.label]: {
            tasks: {
              [action.id]: { $set: !taskHasLabel },
            },
          },
        },
      });
      break;
    }
    case ScrumptiousConstants.LABEL_TEXT_SET: {
      if (!state.labelOptions[action.key]) break;
      updatedState = update(state, {
        labelOptions: {
          [action.key]: {
            label: { $set: action.text },
          },
        },
      });
      break;
    }
    case ScrumptiousConstants.LABEL_DELETE: {
      if (!state.labelOptions[action.key]) break;
      updatedState = update(state, {
        labelOptions: {
          $unset: [action.key],
        },
      });
      break;
    }
    case ScrumptiousConstants.LABEL_TASK_REMOVE: {
      const label = state.labelOptions[action.key];
      if (!label) break;

      updatedState = update(state, {
        labelOptions: {
          [action.key]: {
            tasks: {
              [action.taskId]: { $set: false },
            },
          },
        },
      });
      break;
    }
    case ScrumptiousConstants.LABEL_SET_COLOR: {
      if (!state.labelOptions[action.key]) break;
      updatedState = update(state, {
        labelOptions: {
          [action.key]: {
            backgroundColor: { $set: action.color },
          },
        },
      });
      break;
    }
    case ScrumptiousConstants.LABEL_OPTION_ADD: {
      if (!action.taskId || !action.id) break;
      const newLabel = {
        label: '',
        backgroundColor: '#12A4FF',
        color: '#fff',
        tasks: {
          [action.taskId]: true,
        },
      };
      updatedState = update(state, {
        labelOptions: {
          [action.id]: { $set: newLabel },
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
  if (updatedState.isSavingEnabled && LabelSaveEvents.includes(action.type)) {
    saveLabelOptions(updatedState.labelOptions);
  }
  return updatedState;
};

export default LabelReducer;
