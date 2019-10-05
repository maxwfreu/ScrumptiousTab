import ScrumptiousConstants from '../ScrumptiousConstants';

const uuidv4 = require('uuid/v4');

export const reorderColumn = (startIndex, endIndex) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.COLUMN_REORDER,
      startIndex,
      endIndex,
    });
  }
);

export const updateColumnHeader = (id, text) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.COLUMN_HEADER_UPDATE,
      id,
      text,
    });
  }
);

export const clearColumn = id => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.COLUMN_CLEAR,
      id,
    });
  }
);

export const addColumn = index => (
  (dispatch) => {
    const id = uuidv4();
    dispatch({
      type: ScrumptiousConstants.COLUMN_ADD,
      id,
      index,
    });
  }
);

export const removeColumn = (index, category) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.COLUMN_REMOVE,
      index,
      category,
    });
  }
);

export const archiveColumn = () => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.COLUMN_ARCHIVE,
    });
  }
);
