import { combineReducers } from 'redux';
import LabelReducer from './LabelReducer';
import AppSettings from './AppSettings';
import TaskReducer from './TaskReducer';
import ColumnReducer from './ColumnReducer';

export default combineReducers({
  LabelReducer,
  AppSettings,
  TaskReducer,
  ColumnReducer,
});
