import ScrumptiousConstants from '../ScrumptiousConstants';

export const addTask = (id, category) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TASK_ADD,
      id,
      category,
    });
  }
);

export const restoreTask = (columnId, id) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TASK_RESTORE,
      columnId,
      id,
    });
  }
);

export const deleteTask = (columnId, id) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TASK_DELETE,
      columnId,
      id,
    });
  }
);

export const archiveTask = (columnId, id) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.ARCHIVE_SET,
      columnId,
      id,
    });
  }
);

export const updateRichText = (columnId, id, richText) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TASK_TEXT_UPDATE,
      columnId,
      id,
      richText,
    });
  }
);

export const setEditingId = editingId => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TASK_SET_EDITING,
      editingId,
    });
  }
);

export const moveTask = (sourceId, destinationId, source, destination) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TASK_MOVE,
      sourceId,
      destinationId,
      source,
      destination,
    });
  }
);

export const reorderTask = (id, startIndex, endIndex) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TASK_REORDER,
      id,
      startIndex,
      endIndex,
    });
  }
);
