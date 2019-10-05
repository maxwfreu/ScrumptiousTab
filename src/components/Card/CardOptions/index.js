import React, {
  Fragment,
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import loadable from '@loadable/component';
import { removeLabelFromTask } from '../../Actions/LabelActions';
import CustomPropTypes from '../../CustomPropTypes';
import Labels from './Labels';

const LabelOption = loadable(() => import('./LabelOption'));
const LabelOptionPicker = loadable(() => import('./LabelOptionPicker'));

class CardOptions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeLabelOverride: null,
    };

    this.setCardOptionsRef = this.setCardOptionsRef.bind(this);
    this.renderInactive = this.renderInactive.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { activeLabelOverride } = this.state;
    const { labelOptions, isEditing, isArchived } = this.props;
    let newKey = '';
    Object.keys(labelOptions).forEach((key) => {
      if (!(key in prevProps.labelOptions)) {
        newKey = key;
      }
    });
    if (!isEditing || isArchived) {
      this.setState({
        activeLabelOverride: null,
      });
    } else if (newKey && newKey !== '') {
      this.setState({
        activeLabelOverride: newKey,
      });
    }
  }

  setCardOptionsRef(node) {
    this.cardOptionsRef = node;
  }

  renderInactive() {
    const { labelOptions, taskId } = this.props;
    const labels = [];
    Object.keys(labelOptions).forEach((key) => {
      const labelInfo = labelOptions[key];
      const validKey = (taskId in labelInfo.tasks);
      if (!validKey) return null;
      if (validKey && !labelInfo.tasks[taskId]) return null;
      labels.push(key);
    });
    if (!labels.length) return null;
    return (
      <div className="card-options-inner-not-editing">
        {
          Object.keys(labelOptions).map((key) => {
            const labelInfo = labelOptions[key];
            const validKey = (taskId in labelInfo.tasks);
            if (!validKey) return null;
            if (validKey && !labelInfo.tasks[taskId]) return null;
            return (
              <div
                key={key}
                className="demo-priority"
                style={{
                  backgroundColor: labelInfo.backgroundColor,
                  color: labelInfo.color,
                }}
              >
                <p>{labelInfo.label}</p>
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    const {
      labelOptions,
      columnId,
      taskId,
      pickLabel,
      isEditing,
      isArchived,
      isDeleteConfirmed,
    } = this.props;
    const { activeLabelOverride } = this.state;
    if (!isEditing || isArchived) {
      return this.renderInactive();
    }
    return (
      <div className="card-options-wrapper" ref={this.setCardOptionsRef}>
        <div className="card-options-inner">
          <Labels
            labelOptions={labelOptions}
            columnId={columnId}
            taskId={taskId}
            removeLabelFromTask={this.props.removeLabelFromTask}
          />
          <div className="card-option-bottom-row">
            <div>
              <button
                type="button"
                aria-label="Delete Label"
                className={`delete-button ${isDeleteConfirmed ? 'delete-button-confirm' : ''}`}
                onClick={this.props.deleteTask}
              />
            </div>
            <div>
              <button
                type="button"
                aria-label="Pick Label"
                className="pick-label"
                onClick={this.props.selectLabel}
              >
                Add Label
              </button>
              <LabelOptionPicker
                pickLabel={pickLabel}
                setLabelRef={this.props.setLabelRef}
                labelOptions={labelOptions}
                taskId={taskId}
                columnId={columnId}
                activeLabelOverride={activeLabelOverride}
                addLabel={this.props.addLabel}
                toggleLabel={this.props.toggleLabel}
                cardOptionsRef={this.cardOptionsRef}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CardOptions.propTypes = {
  columnId: PropTypes.string.isRequired,
  pickLabel: PropTypes.bool.isRequired,
  isDeleteConfirmed: PropTypes.bool.isRequired,
  labelOptions: CustomPropTypes.hashmapOf(
    PropTypes.shape({
      label: PropTypes.string,
      className: PropTypes.string,
      backgroundColor: PropTypes.string,
      color: PropTypes.string,
      tasks: CustomPropTypes.hashmapOf(PropTypes.bool),
    }),
  ).isRequired,
  isArchived: PropTypes.bool,
  isEditing: PropTypes.bool,
  taskId: PropTypes.string.isRequired,
};

CardOptions.defaultProps = {
  isArchived: false,
  isEditing: false,
};

const mapStateToProps = ({ LabelReducer }) => ({
  labelOptions: LabelReducer.labelOptions,
});


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    removeLabelFromTask,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(CardOptions);
