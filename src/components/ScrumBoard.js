import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  moveTask as moveAction,
  reorderTask as reorderAction,
} from './Actions/TaskActions';
import {
  reorderColumn as reorderColumnAction,
} from './Actions/ColumnActions';
import Column from './Column';

class ScrumBoard extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  /*
    Drag event for both columns and cards.
  */
  onDragEnd(result) {
    const { reorderColumn, reorderTask, moveTask } = this.props;
    const { source, destination, type } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (type === 'COLUMN') {
      reorderColumn(source.index, destination.index);
      return;
    }
    if (source.droppableId === destination.droppableId) {
      reorderTask(source.droppableId, source.index, destination.index);
    } else {
      moveTask(source.droppableId, destination.droppableId, source, destination);
    }
  }

  render() {
    const { columns, isFetchingData, isWelcomeBannerHidden } = this.props;
    const columnWrapperClasses = classnames(
      'column-wrapper',
      {
        'no-col-wrapper-padding': columns.length !== 3,
        'without-banner': isWelcomeBannerHidden,
      },
    );
    if (isFetchingData) {
      return (
        <div className={columnWrapperClasses}>
          <div className="app-loading">
            <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle className="spinner-path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
          </div>
        </div>
      );
    }
    return (
      <div className={columnWrapperClasses}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable
            droppableId="board"
            type="COLUMN"
            direction="horizontal"
          >
            {provided => (
              <div
                ref={provided.innerRef}
                className="scrumboard-horizontal-scroll-override"
                {...provided.droppableProps}
              >
                {columns.map((column, index) => (
                  <Column
                    key={column.id}
                    title={column.title}
                    type={column.id}
                    emptyState={column.emptyState}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

ScrumBoard.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      emptyState: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isWelcomeBannerHidden: PropTypes.bool.isRequired,
  isFetchingData: PropTypes.bool.isRequired,
  moveTask: PropTypes.func.isRequired,
  reorderTask: PropTypes.func.isRequired,
  reorderColumn: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ColumnReducer, TaskReducer, AppSettings }) => ({
  columns: ColumnReducer.columns,
  isFetchingData: TaskReducer.isFetchingData,
  isWelcomeBannerHidden: AppSettings.isWelcomeBannerHidden,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    moveTask: moveAction,
    reorderTask: reorderAction,
    reorderColumn: reorderColumnAction,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ScrumBoard);
