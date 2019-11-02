import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getArchiveDate, isSameDate } from '../../utils';
import { clearArchive } from '../Actions/ArchiveActions';
import EmptyState from '../EmptyState';
import Card from '../Card';

class ArchivePanel extends Component {
  /*
    Render date section divider
  */
  static renderSectionDivider(sortedTasks, index) {
    const currentTask = sortedTasks[index];
    const currentDate = new Date(currentTask.timestamp);
    if (index === 0) {
      return (
        <div className="archive-date">
          {getArchiveDate(currentDate)}
        </div>
      );
    }
    const prevTask = sortedTasks[index - 1];
    const prevDate = new Date(prevTask.timestamp);
    const sameDate = isSameDate(prevDate, currentDate);
    // At end
    if (!sameDate) {
      return (
        <div className="archive-date">
          {getArchiveDate(currentDate)}
        </div>
      );
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
    };
    this.onClearArchive = this.onClearArchive.bind(this);
    this.setConfirmButtonRef = this.setConfirmButtonRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /*
    Attach mouse down click to dismiss panel
  */
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  /*
    Remove mousedown
  */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /*
    Either confirm deletion or clear all
  */
  onClearArchive() {
    const { confirmDelete } = this.state;
    const { dispatchClearArchive } = this.props;
    if (confirmDelete) {
      dispatchClearArchive();
    }
    this.setState(prevState => ({
      confirmDelete: !prevState.confirmDelete,
    }));
  }

  /*
    Set ref for clear all button
  */
  setConfirmButtonRef(node) {
    this.confirmWrapperRef = node;
  }

  /*
    Handels closing panel and reseting confirm delete
  */
  handleClickOutside(e) {
    const { confirmDelete } = this.state;
    const containsButton = this.confirmWrapperRef.contains(e.target);
    if (confirmDelete && !containsButton) {
      this.setState({
        confirmDelete: false,
      });
    }
  }

  render() {
    const { items, appMode } = this.props;
    const { confirmDelete } = this.state;

    let sortedTasks = [];
    if (items) {
      sortedTasks = items.sort((a, b) => {
        const bstamp = b.timestamp || 0;
        const astamp = a.timestamp || 0;
        return bstamp - astamp;
      });
    }
    let clearStyle = {};
    if (confirmDelete) {
      clearStyle = {
        borderColor: 'red',
        color: 'red',
      };
    }
    const emptyClass = sortedTasks.length === 0 ? 'archive-empty' : '';
    return (
      <div className="archive-panel" id="archivePanel">
        <div className="archive-panel-title">
          <div className="archive-panel-name">
            Archive
          </div>
          <div
            className="archive-button clear-all-button"
            onClick={this.onClearArchive}
            onKeyDown={() => null}
            style={clearStyle}
            role="button"
            tabIndex={0}
            ref={this.setConfirmButtonRef}
          >
            {confirmDelete ? 'Are you sure?' : 'Delete All'}
          </div>
        </div>
        <div className={`archive-panel-card-wrapper ${emptyClass}`}>
          {sortedTasks.length === 0 && (
            <EmptyState appMode={appMode} isArchive />
          )}
          {sortedTasks.map((task, index) => (
            <Fragment key={task.id}>
              {ArchivePanel.renderSectionDivider(sortedTasks, index)}
              <Card
                isArchived
                taskId={task.id}
                type="archivedTasks"
                addingID={null}
                draggableRef={React.createRef()}
                draggableProps={{}}
                dragHandleProps={{}}
                isDragging={false}
                outerStyle={{}}
              />
            </Fragment>
          ))}
        </div>
      </div>
    );
  }
}

ArchivePanel.defaultProps = {
  items: [],
};

ArchivePanel.propTypes = {
  appMode: PropTypes.number.isRequired,
  dispatchClearArchive: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = ({ AppSettings, TaskReducer }) => ({
  items: TaskReducer.taskMapping.archivedTasks.map(id => TaskReducer.tasks[id]),
  appMode: AppSettings.appMode,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    dispatchClearArchive: clearArchive,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ArchivePanel);
