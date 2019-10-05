import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LabelOption from './LabelOption';
import CustomPropTypes from '../../CustomPropTypes';

// Renders the labels currently added to task
const LabelOptionPicker = ({
  pickLabel,
  setLabelRef,
  labelOptions,
  taskId,
  columnId,
  activeLabelOverride,
  addLabel,
  toggleLabel,
  cardOptionsRef,
}) => {
  const pickerClasses = classnames(
    'pick-label-wrapper',
    {
      hide: !pickLabel,
    },
  );
  return (
    <div
      className={pickerClasses}
      ref={setLabelRef}
    >
      <React.Fragment>
        {Object.keys(labelOptions).map((key) => {
          const option = labelOptions[key];
          let isSelected = false;
          const validKey = (taskId in option.tasks);
          if (validKey && option.tasks[taskId]) isSelected = true;
          const selectedClass = isSelected ? 'selected' : '';
          return (
            <LabelOption
              key={key}
              option={option}
              optionKey={key}
              toggleLabel={toggleLabel}
              selectedClass={selectedClass}
              labelOptions={labelOptions}
              columnId={columnId}
              taskId={taskId}
              activeLabelOverride={activeLabelOverride}
              cardOptionsRef={cardOptionsRef}
            />
          );
        })}
        <div className="pick-label-options">
          <button
            type="button"
            className="add-new-label-button"
            onClick={addLabel}
          >
            Add new
          </button>
        </div>
      </React.Fragment>
    </div>
  );
};

LabelOptionPicker.defaultProps = {
  activeLabelOverride: null,
  cardOptionsRef: null,
};

LabelOptionPicker.propTypes = {
  labelOptions: CustomPropTypes.hashmapOf(
    PropTypes.shape({
      label: PropTypes.string,
      className: PropTypes.string,
      backgroundColor: PropTypes.string,
      color: PropTypes.string,
      tasks: CustomPropTypes.hashmapOf(PropTypes.bool),
    }),
  ).isRequired,
  pickLabel: PropTypes.bool.isRequired,
  setLabelRef: PropTypes.func.isRequired,
  taskId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  activeLabelOverride: PropTypes.string,
  addLabel: PropTypes.func.isRequired,
  toggleLabel: PropTypes.func.isRequired,
  cardOptionsRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

export default LabelOptionPicker;
