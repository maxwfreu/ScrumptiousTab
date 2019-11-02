import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isKeyHotkey } from 'is-hotkey';
import PropTypes from 'prop-types';
import {
  addTask as addTaskAction,
} from './Actions/TaskActions';

const isAddTaskKey = isKeyHotkey('enter');
const uuidv4 = require('uuid/v4');

class KeyBoardListener extends PureComponent {
  constructor(props) {
    super(props);
    this.handleShortCut = this.handleShortCut.bind(this);
  }

  /*
    Add keyboard shortcut listener on mount
  */
  componentDidMount() {
    document.addEventListener('keydown', this.handleShortCut);
  }

  /*
    Remove keyboard shortcut listener on unmount
  */
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleShortCut);
  }

  /*
    Handle user add task shortcut
  */
  handleShortCut(e) {
    const { editingId, addTask, firstColID } = this.props;
    const isInput = e.target.tagName.toUpperCase() === 'INPUT';
    if (isAddTaskKey(e) && !editingId && !isInput && firstColID) {
      const id = uuidv4();
      e.stopPropagation();
      e.preventDefault();
      addTask(id, firstColID);
    }
  }

  render() {
    return null;
  }
}

KeyBoardListener.propTypes = {
  addTask: PropTypes.func.isRequired,
  firstColID: PropTypes.string,
  editingId: PropTypes.string,
};

KeyBoardListener.defaultProps = {
  editingId: '',
  firstColID: '',
};

const getFirstColID = (colReducer) => {
  if (colReducer.columns.length > 0) {
    return colReducer.columns[0].id;
  }
  return '';
};

const mapStateToProps = ({ TaskReducer, ColumnReducer }) => ({
  editingId: TaskReducer.editingId,
  firstColID: getFirstColID(ColumnReducer),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addTask: addTaskAction,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(KeyBoardListener);
