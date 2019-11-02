import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Plain from 'slate-plain-serializer';
import { Value } from 'slate';
import loadable from '@loadable/component';
import ArchiveButton from './ArchiveButton';
import {
  archiveTask,
  deleteTask,
  setEditingId,
  restoreTask,
} from '../Actions/TaskActions';
import {
  setLabels,
  changeLabelText,
  addLabel,
} from '../Actions/LabelActions';
import {
  toggleInfoModal,
  setArchiveSeen,
} from '../Actions';
import CardEditor from './CardEditor';
import {
  clearSelection,
  didChange,
} from '../../utils';
// import CardOptions from './CardOptions';

const CardOptions = loadable(() => import('./CardOptions'));
// const CardEditor = loadable(() => import('./CardEditor'));

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDeleting: false,
      isArchiving: false,
      pickLabel: false,
      animationClass: '',
      endEditingFlip: false,
      isDeleteConfirmed: false,
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setLabelRef = this.setLabelRef.bind(this);
    this.textAreaRef = React.createRef();

    this.restoreTask = this.restoreTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.archiveTask = this.archiveTask.bind(this);
    this.editContent = this.editContent.bind(this);

    this.endEditing = this.endEditing.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.startEditingOnEditor = this.startEditingOnEditor.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.selectLabel = this.selectLabel.bind(this);
    this.toggleLabel = this.toggleLabel.bind(this);
    this.addLabel = this.addLabel.bind(this);

    this.focusEditor = this.focusEditor.bind(this);

    this.isContentEmpty = this.isContentEmpty.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);

    const { type, taskId, lastCardMoved } = this.props;

    const isDone = type === 'done';
    if (isDone) {
      const doneAnimationClass = (lastCardMoved === taskId && isDone) ? 'animate' : '';

      const that = this;

      if (doneAnimationClass !== '') {
        this.setState({
          animationClass: doneAnimationClass,
        });
        setTimeout(() => {
          that.setState({
            animationClass: 'done',
          });
        }, 800);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      taskId,
      editingId,
      isDragging,
      outerStyle,
      refreshFlag,
    } = this.props;
    if (nextProps.refreshFlag !== refreshFlag) return true;
    if (nextProps.editingId === taskId) return true;
    if (editingId === taskId && nextProps.isEditing !== taskId) return true;
    if (isDragging || nextProps.isDragging) return true;
    const outerStyleChanged = didChange(outerStyle, nextProps.outerStyle);
    if (outerStyleChanged) return true;
    const stateChanged = didChange(this.state, nextState);
    return stateChanged;
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  setLabelRef(node) {
    this.labelRef = node;
  }

  handleClickOutside(event) {
    const { pickLabel, isDeleteConfirmed } = this.state;
    const { editingId, taskId } = this.props;
    const isEditing = editingId === taskId;
    if (event.target.getAttribute('aria-label') !== 'Delete Label' && isDeleteConfirmed) {
      this.setState({
        isDeleteConfirmed: false,
      });
    }
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (isEditing) {
        this.endEditing();
      }
    } else if (this.labelRef && !this.labelRef.contains(event.target)) {
      if (pickLabel) {
        this.setState({
          pickLabel: false,
        });
      }
    }
  }

  editContent() {
    this.props.setEditingId(this.props.taskId);
  }

  endEditing() {
    clearSelection();
    this.props.setEditingId(null);
    this.setState({
      pickLabel: false,
      endEditingFlip: !this.state.endEditingFlip,
    });
  }


  startEditing(e) {
    const { isArchived, taskId, editingId } = this.props;
    const isEditing = taskId === editingId;
    if (isEditing || isArchived) return;
    clearSelection();
    e.stopPropagation();
    this.props.toggleInfoModal(true);
    this.props.setEditingId(taskId);
  }

  focusEditor(e) {
    e.stopPropagation();
    this.props.setEditingId(this.props.taskId);
  }

  startEditingOnEditor(e, editorRef) {
    const { isArchived, taskId, editingId } = this.props;
    const isEditing = taskId === editingId;
    if (isEditing || isArchived) return;
    editorRef.focus();
    this.props.toggleInfoModal(true);
    this.props.setEditingId(taskId);
  }

  restoreTask(e) {
    e.stopPropagation();
    const timeoutDelay = 300;
    setTimeout(() => {
      const { type, taskId } = this.props;
      this.props.restoreTask(type, taskId);
    }, timeoutDelay);
    if (timeoutDelay !== 0) {
      this.setState({
        isDeleting: true,
      });
    }
  }

  deleteTask(e) {
    e.stopPropagation();
    const timeoutDelay = 300;
    const { isDeleteConfirmed } = this.state;
    if (!isDeleteConfirmed) {
      this.setState({
        isDeleteConfirmed: true,
      });
      return;
    }
    setTimeout(() => {
      const { type, taskId } = this.props;
      this.props.deleteTask(type, taskId);
    }, timeoutDelay);
    if (timeoutDelay !== 0) {
      this.setState({
        isDeleting: true,
      });
    }
  }

  isContentEmpty() {
    const { richText } = this.props.task;
    const emptyStr = '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"line","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}}';
    return (richText === emptyStr || !richText || richText === '');
  }

  archiveTask() {
    if (this.isContentEmpty()) return;
    setTimeout(() => {
      const { hasSeenArchive, type, taskId } = this.props;
      this.props.archiveTask(type, taskId);
      if (!hasSeenArchive) {
        this.props.toggleInfoModal(false, 1);
        this.props.setArchiveSeen();
      }
    }, 600);
    this.setState({
      isDeleting: true,
      isArchiving: true,
    });
  }

  selectLabel() {
    this.setState({
      pickLabel: true,
    });
  }

  toggleLabel(value) {
    const { type, taskId } = this.props;
    this.props.setLabels(type, taskId, value);
  }

  addLabel() {
    const { type, taskId } = this.props;
    this.props.addLabel(type, taskId);
  }

  render() {
    const {
      isDeleting,
      isArchiving,
      pickLabel,
      animationClass,
      isDeleteConfirmed,
    } = this.state;
    const {
      task,
      taskId,
      type,
      draggableRef,
      draggableProps,
      dragHandleProps,
      outerStyle,
      isArchived,
      name,
      editingId,
      taskIndex,
      value: richTextVal,
      lastCardMoved,
    } = this.props;
    let deletingClass = isDeleting ? 'scale-out-center' : '';
    if (isArchiving) {
      deletingClass = 'fade-out';
    }
    const isEditing = editingId === taskId;
    const relativePosStyle = isEditing ? { position: 'relative' } : {};
    const wrapperEditingClass = isEditing ? 'is-editing-card' : 'not-editing';
    const emptyClass = (!isEditing && !task.richText) ? 'empty-card' : '';

    let { richText } = task;
    if (this.isContentEmpty()) richText = null;
    let value = richTextVal;
    if (isArchived) {
      const parsed = JSON.parse(richText);
      if (parsed) value = Value.fromJSON(parsed);
    }
    const isEmpty = this.isContentEmpty();
    const isDone = type === 'done';

    let doneClass = '';
    if (isDone) {
      doneClass = 'no-initial-animation';
      if (lastCardMoved === taskId) {
        doneClass = '';
      }
    }

    return (
      <div
        ref={draggableRef}
        {...draggableProps}
        {...dragHandleProps}
        className={`card-wrapper draw-outline ${animationClass} ${doneClass} ${deletingClass} ${wrapperEditingClass}`}
        style={{
          ...outerStyle,
          ...relativePosStyle,
        }}
        key={taskId}
        onClick={e => this.startEditing(e, this.inputRef)}
      >
        <div
          className={`draggable card ${emptyClass}`}
          ref={this.setWrapperRef}
        >
          {type === 'done' && !isEmpty && (
            <ArchiveButton archiveTask={this.archiveTask} />
          )}
          {isArchived && (
            <button type="button" className="restore-card-button" onClick={this.restoreTask} aria-label="Restore Task">
              Restore
            </button>
          )}
          {!isEditing && !richText && (
            <Fragment>
              {name && name !== '' && name !== 'null' && name !== null ? (
                <div className="placeholder">
                  {'What do you have to do, '}
                  {name}
                  ?
                </div>
              ) : (
                <div className="placeholder"> What do you have to do? </div>
              )}
            </Fragment>
          )}

          <CardEditor
            id={taskId}
            isEditing={isEditing}
            columnId={type}
            taskId={taskId}
            taskIndex={taskIndex}
            readOnly={isArchived}
            name={name}
            value={value}
            editingId={editingId}
            endEditing={this.endEditing}
          />
          <div style={{ position: 'relative', zIndex: 999 }}>
            <CardOptions
              isEditing={isEditing}
              isArchived={isArchived}
              isDeleteConfirmed={isDeleteConfirmed}
              setLabelRef={this.setLabelRef}
              deleteTask={this.deleteTask}
              selectLabel={this.selectLabel}
              pickLabel={pickLabel}
              toggleLabel={this.toggleLabel}
              columnId={type}
              taskId={taskId}
              addLabel={this.addLabel}
            />
          </div>
        </div>
        {!isEditing && (
          <button
            className={`hover-delete-btn ${isDeleteConfirmed ? 'confirm-delete-hover' : ''}`}
            onClick={this.deleteTask}
            type="button"
            aria-label="Delete Label"
          />
        )}
      </div>
    );
  }
}

Card.defaultProps = {
  draggableProps: {},
  dragHandleProps: {},
  task: {},
  type: '',
  isDragging: false,
  isArchived: false,
  outerStyle: {},
  editingId: '',
};

Card.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    priority: PropTypes.string,
    cardNumber: PropTypes.number,
    richText: PropTypes.string,
  }),
  taskId: PropTypes.string.isRequired,
  draggableRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
  editingId: PropTypes.string,
  draggableProps: PropTypes.object,
  dragHandleProps: PropTypes.object,
  deleteTask: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
  archiveTask: PropTypes.func.isRequired,
  type: PropTypes.string,
  isArchived: PropTypes.bool,
  outerStyle: PropTypes.object,
  setEditingId: PropTypes.func.isRequired,
  refreshFlag: PropTypes.bool.isRequired,
  hasSeenArchive: PropTypes.bool.isRequired,
  setArchiveSeen: PropTypes.func.isRequired,
};

const getValue = (task) => {
  let value = Plain.deserialize('');
  if (!task) return value;
  const { richText } = task;
  if (!richText) return value;
  const parsedVal = richText ? JSON.parse(richText) : false;
  if (parsedVal) {
    value = Value.fromJSON(parsedVal);
    const isValue = Value.isValue(value);
    if (!isValue) value = Plain.deserialize('');
  }
  return value;
};

const mapStateToProps = ({ AppSettings, TaskReducer }, ownProps) => ({
  name: AppSettings.name,
  editingId: TaskReducer.editingId,
  task: TaskReducer.tasks[ownProps.taskId],
  value: getValue(TaskReducer.tasks[ownProps.taskId]),
  lastCardMoved: TaskReducer.lastCardMoved,
  refreshFlag: TaskReducer.refreshFlag,
  hasSeenArchive: AppSettings.hasSeenArchive,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    restoreTask,
    deleteTask,
    archiveTask,
    setLabels,
    changeLabelText,
    addLabel,
    setEditingId,
    toggleInfoModal,
    setArchiveSeen,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Card);
