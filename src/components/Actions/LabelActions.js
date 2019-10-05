import ScrumptiousConstants from '../ScrumptiousConstants';

const uuidv4 = require('uuid/v4');

export const setLabels = (columnId, id, label) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.LABEL_SELECTED_SET,
      columnId,
      id,
      label,
    });
  }
);

export const changeLabelText = (key, text) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.LABEL_TEXT_SET,
      key,
      text,
    });
  }
);

export const deleteLabel = (columnId, taskId, key) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.LABEL_DELETE,
      key,
      columnId,
      taskId,
    });
  }
);

export const removeLabelFromTask = (columnId, taskId, key) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.LABEL_TASK_REMOVE,
      key,
      columnId,
      taskId,
    });
  }
);

export const setLabelColor = (key, color) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.LABEL_SET_COLOR,
      key,
      color,
    });
  }
);

export const addLabel = (columnId, taskId) => (
  (dispatch) => {
    const id = uuidv4();
    dispatch({
      type: ScrumptiousConstants.LABEL_OPTION_ADD,
      columnId,
      taskId,
      id,
    });
  }
);
