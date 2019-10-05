import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import NaturalDragAnimation from 'natural-drag-animation-rbdnd';
import AutosizeInput from 'react-input-autosize';
import { logEvent } from '../utils';
import {
  updateColumnHeader,
  clearColumn,
  addColumn,
  removeColumn,
  archiveColumn,
} from './Actions/ColumnActions';
import { addTask } from './Actions/TaskActions';
import Card from './Card';
import EmptyState from './EmptyState';

const uuidv4 = require('uuid/v4');

class Column extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropDown: false,
      isInputFocused: false,
    };

    this.focusInput = this.focusInput.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setInputWrapperRef = this.setInputWrapperRef.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setInputWrapperRef(node) {
    this.inputWrapperRef = node;
  }

  getItemStyle = (isDragging, draggableStyle, taskId) => {
    if (!isDragging && ((this.adding && this.addingID === taskId))) {
      this.adding = false;
      this.addingID = null;

      return {
        ...draggableStyle,
        animation: 'slide-in-top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      };
    }

    return {
      ...draggableStyle,
    };
  }

  handleClickOutside = (event) => {
    const { isInputFocused } = this.state;
    if (isInputFocused && this.inputWrapperRef && !this.inputWrapperRef.input.contains(event.target)) {
      this.inputWrapperRef.blur();
      this.setState({
        isInputFocused: false,
      });
      return;
    }
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        showDropDown: false,
      });
    }
  }

  toggleMenu = () => {
    logEvent('columns', 'Show Column Menu');
    this.setState(state => ({
      showDropDown: !state.showDropDown,
    }));
  }

  clearColumn = () => {
    logEvent('columns', 'Clear Column');
    const { type, dispatchClearColumn } = this.props;
    dispatchClearColumn(type);
    this.setState({
      showDropDown: false,
    });
  }

  addColumn = () => {
    logEvent('columns', 'Add Column');
    const { index, dispatchAddColumn } = this.props;
    dispatchAddColumn(index + 1);
    setTimeout(() => {
      const columns = document.querySelectorAll('.column-wrapper-draggable');
      if (!columns) return;
      const column = columns[index + 1];
      if (!column) return;
      const scrumContainer = document.querySelector('.scrumboard-horizontal-scroll-override');
      const { offsetLeft } = column;
      const { width } = column.getBoundingClientRect();
      scrumContainer.scrollTo({
        top: 0,
        left: offsetLeft - width,
        behavior: 'smooth',
      });
    }, 200);
    this.setState({
      showDropDown: false,
    });
  }

  removeColumn = () => {
    logEvent('columns', 'Remove Column');
    const { index, type, dispatchRemoveColumn } = this.props;
    dispatchRemoveColumn(index, type);
    this.setState({
      showDropDown: false,
    });
  }

  archiveColumn = () => {
    logEvent('columns', 'Archive Column');
    const { dispatchArchiveColumn } = this.props;
    dispatchArchiveColumn();
    this.setState({
      showDropDown: false,
    });
  }

  updateColumnHeader = (ev) => {
    const { type } = this.props;
    this.props.updateColumnHeader(type, ev.target.value);
  }

  updateColumnHeaderBlur = (ev) => {
    logEvent('columns', 'Update Column Header');
    const { type } = this.props;
    this.props.updateColumnHeader(type, ev.target.value || 'New Column');
  }

  addTask = () => {
    const { type, cardNumber } = this.props;
    logEvent('tasks', 'Add Task', cardNumber);
    const id = uuidv4();
    this.props.addTask(id, type);
    this.adding = true;
    this.addingID = id;
  }

  focusInput() {
    this.setState({
      isInputFocused: true,
    });
  }

  render() {
    const {
      appMode,
      type,
      index,
      items,
      title,
      emptyState,
      editingId,
      isWobbleDisabled,
      shhMode,
      maxWidth,
    } = this.props;
    const { showDropDown } = this.state;
    const colShhModeClass = shhMode ? 'shh-mode' : '';
    return (
      <Draggable draggableId={type} index={index} isDragDisabled={editingId !== null || shhMode}>
        {(columnProvided, columnSnapshot) => (
          <div
            ref={columnProvided.innerRef}
            className="column-wrapper-draggable"
            {...columnProvided.draggableProps}
            {...columnProvided.dragHandleProps}
          >
            <Droppable droppableId={type} type="CARD" direction="vertical">
              {provided => (
                <div
                  className={`column ${columnSnapshot.isDragging ? 'column-dragging' : ''} ${colShhModeClass}`}
                >
                  <div className="column-header">
                    <div className="column-header-section">
                      <button type="button" className="menu-dots" onClick={this.toggleMenu} />
                      {showDropDown && (
                        <div className="col-menu-dropdown" ref={this.setWrapperRef}>
                          {type !== 'done' && (
                            <Fragment>
                              <button type="button" className="col-menu-button remove" onClick={this.clearColumn}>Delete Tasks</button>
                              <div className="col-menu-divider" />
                              <button type="button" className="col-menu-button" onClick={this.addColumn}>Add Column</button>
                              <button type="button" className="col-menu-button remove" onClick={this.removeColumn}>Remove Column</button>
                            </Fragment>
                          )}
                          {type === 'done' && (
                            <Fragment>
                              <button type="button" className="col-menu-button" onClick={this.archiveColumn}>Archive Tasks</button>
                              <button type="button" className="col-menu-button remove" onClick={this.clearColumn}>Delete Tasks</button>
                              <div className="col-menu-divider" />
                              <button type="button" className="col-menu-button" onClick={this.addColumn}>Add Column</button>
                            </Fragment>
                          )}
                        </div>
                      )}
                      <AutosizeInput
                        ref={this.setInputWrapperRef}
                        key={`column-name-key-${index}`}
                        name={`column-name-${index}`}
                        value={title}
                        onFocus={this.focusInput}
                        onChange={this.updateColumnHeader}
                        maxLength={25}
                        onBlur={this.updateColumnHeaderBlur}
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      />
                      <span>{items.length}</span>
                    </div>
                    <button
                      type="button"
                      aria-label="Add Task"
                      onClick={this.addTask}
                      className="add-task"
                    >
                      Add Task
                    </button>
                  </div>
                  <div
                    ref={provided.innerRef}
                    className="column-contents"
                  >
                    {items.length === 0 ? (
                      <div className="column-empty-state-wrapper">
                        <EmptyState
                          appMode={appMode}
                          stateType={emptyState}
                        />
                      </div>
                    ) : (
                      <Fragment>
                        {items.map((item, idx) => (
                          <Draggable
                            key={item}
                            draggableId={item}
                            index={idx}
                            isDragDisabled={item === editingId}
                          >
                            {(dragProvided, snapshot) => (
                              <div style={{ width: 'calc(100% + 6px)', marginLeft: '8px' }}>
                                <NaturalDragAnimation
                                  style={dragProvided.draggableProps.style}
                                  snapshot={snapshot}
                                  rotationMultiplier={isWobbleDisabled ? 0 : 1.3}
                                >
                                  {style => (
                                    <Card
                                      taskId={item}
                                      key={item}
                                      type={type}
                                      editingId={editingId}
                                      draggableRef={dragProvided.innerRef}
                                      draggableProps={dragProvided.draggableProps}
                                      dragHandleProps={dragProvided.dragHandleProps}
                                      isDragging={snapshot.isDragging}
                                      outerStyle={this.getItemStyle(
                                        snapshot.isDragging,
                                        style,
                                        item,
                                      )}
                                    />
                                  )}
                                </NaturalDragAnimation>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </Fragment>
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    );
  }
}
const mapStateToProps = ({ AppSettings, TaskReducer }, ownProps) => ({
  items: TaskReducer.taskMapping[ownProps.type] || [],
  cardNumber: TaskReducer.cardNumber,
  editingId: TaskReducer.editingId,
  isWobbleDisabled: AppSettings.isWobbleDisabled,
  appMode: AppSettings.appMode,
  shhMode: AppSettings.shhMode,
});

Column.defaultProps = {
  editingId: null,
  emptyState: '',
};

Column.propTypes = {
  appMode: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  addTask: PropTypes.func.isRequired,
  dispatchClearColumn: PropTypes.func.isRequired,
  dispatchAddColumn: PropTypes.func.isRequired,
  dispatchRemoveColumn: PropTypes.func.isRequired,
  editingId: PropTypes.string,
  emptyState: PropTypes.string,
  shhMode: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addTask,
    updateColumnHeader,
    dispatchClearColumn: clearColumn,
    dispatchAddColumn: addColumn,
    dispatchRemoveColumn: removeColumn,
    dispatchArchiveColumn: archiveColumn,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Column);
