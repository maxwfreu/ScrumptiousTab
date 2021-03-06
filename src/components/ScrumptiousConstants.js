const ScrumptiousConstants = {
  TASK_ADD: 'TASK_ADD',
  TASK_DELETE: 'TASK_DELETE',
  TASK_MOVE: 'TASK_MOVE',
  TASK_RESTORE: 'TASK_RESTORE',
  TASK_REORDER: 'TASK_REORDER',
  TASK_TEXT_UPDATE: 'TASK_TEXT_UPDATE',
  TASK_SET_EDITING: 'TASK_SET_EDITING',
  TASK_DATA_SAVE_SUCCESS: 'TASK_DATA_SAVE_SUCCESS',
  TASK_DATA_SAVE_FAIL: 'TASK_DATA_SAVE_FAIL',
  COLUMN_DATA_SAVE_FAIL: 'COLUMN_DATA_SAVE_FAIL',
  LABEL_DATA_SAVE_FAIL: 'LABEL_DATA_SAVE_FAIL',
  COLUMN_ADD: 'COLUMN_ADD',
  COLUMN_REMOVE: 'COLUMN_REMOVE',
  COLUMN_ARCHIVE: 'COLUMN_ARCHIVE',
  COLUMN_CLEAR: 'COLUMN_CLEAR',
  COLUMN_HEADER_UPDATE: 'COLUMN_HEADER_UPDATE',
  COLUMN_REORDER: 'COLUMN_REORDER',
  ARCHIVE_SET: 'ARCHIVE_SET',
  ARCHIVE_CLEAR: 'ARCHIVE_CLEAR',
  ARCHIVE_SEEN: 'ARCHIVE_SEEN',
  USERNAME_SET: 'USERNAME_SET',
  APP_MODE_SET: 'APP_MODE_SET',
  LABEL_SELECTED_SET: 'LABEL_SELECTED_SET',
  LABEL_TEXT_SET: 'LABEL_TEXT_SET',
  LABEL_DELETE: 'LABEL_DELETE',
  LABEL_OPTION_ADD: 'LABEL_OPTION_ADD',
  LABEL_TASK_REMOVE: 'LABEL_TASK_REMOVE',
  LABEL_SET_COLOR: 'LABEL_SET_COLOR',
  TOOLBAR_HIDE: 'TOOLBAR_HIDE',
  TOOLBAR_SHOW: 'TOOLBAR_SHOW',
  BACKGROUND_MODE_SET: 'BACKGROUND_MODE_SET',
  WOBBLE_TOGGLE: 'WOBBLE_TOGGLE',
  INFO_MODAL_TOGGLE: 'INFO_MODAL_TOGGLE',
  INFO_MODAL_WITH_PANEL_TOGGLE: 'INFO_MODAL_WITH_PANEL_TOGGLE',
  SCRUMPTIOUS_DATA_FETCH: 'SCRUMPTIOUS_DATA_FETCH',
  SCRUMPTIOUS_DATA_FETCH_SUCCESS: 'SCRUMPTIOUS_DATA_FETCH_SUCCESS',
  SCRUMPTIOUS_DATA_FETCH_FAILURE: 'SCRUMPTIOUS_DATA_FETCH_FAILURE',
  BOOKMARKS_TOGGLE: 'BOOKMARKS_TOGGLE',
  REFRESH_COLUMNS: 'REFRESH_COLUMNS',
  REFRESH_LABELS: 'REFRESH_LABELS',
  REFRESH_TASK_DATA: 'REFRESH_TASK_DATA',
  REFRESH_APP_SETTINGS: 'REFRESH_APP_SETTINGS',
  MILITARY_TIME_TOGGLE: 'MILITARY_TIME_TOGGLE',
  SCRUMPTIOUS_TOGGLE: 'SCRUMPTIOUS_TOGGLE',
  SHH_MODE_TOGGLE: 'SHH_MODE_TOGGLE',
  WELCOME_BANNER_TOGGLE: 'WELCOME_BANNER_TOGGLE',
};

export const SaveEvents = [
  ScrumptiousConstants.TASK_ADD,
  ScrumptiousConstants.TASK_DELETE,
  ScrumptiousConstants.TASK_MOVE,
  ScrumptiousConstants.TASK_RESTORE,
  ScrumptiousConstants.TASK_REORDER,
  ScrumptiousConstants.TASK_TEXT_UPDATE,
  ScrumptiousConstants.COLUMN_REMOVE,
  ScrumptiousConstants.COLUMN_ARCHIVE,
  ScrumptiousConstants.COLUMN_CLEAR,
  ScrumptiousConstants.COLUMN_ADD,
  ScrumptiousConstants.ARCHIVE_SET,
  ScrumptiousConstants.ARCHIVE_CLEAR,
];

// Events that should trigger a label save
export const LabelSaveEvents = [
  ScrumptiousConstants.LABEL_SELECTED_SET,
  ScrumptiousConstants.LABEL_TASK_REMOVE,
  ScrumptiousConstants.LABEL_TEXT_SET,
  ScrumptiousConstants.LABEL_DELETE,
  ScrumptiousConstants.LABEL_OPTION_ADD,
  ScrumptiousConstants.LABEL_SET_COLOR,
];

// Events that should trigger a column save
export const ColumnSaveEvents = [
  ScrumptiousConstants.COLUMN_ADD,
  ScrumptiousConstants.COLUMN_REMOVE,
  ScrumptiousConstants.COLUMN_ARCHIVE,
  ScrumptiousConstants.COLUMN_CLEAR,
  ScrumptiousConstants.COLUMN_HEADER_UPDATE,
  ScrumptiousConstants.COLUMN_REORDER,
];


export default ScrumptiousConstants;
