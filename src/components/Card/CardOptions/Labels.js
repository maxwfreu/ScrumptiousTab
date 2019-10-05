import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from '../../CustomPropTypes';

// Renders the labels currently added to task
const Labels = ({
  labelOptions,
  taskId,
  columnId,
  removeLabelFromTask,
}) => (
  <div className="card-options-inner-wrap">
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
            <button
              type="button"
              aria-label="Remove Label"
              className="remove-label"
              onClick={() => removeLabelFromTask(columnId, taskId, key)}
            />
          </div>
        );
      })
    }
  </div>
);

Labels.propTypes = {
  labelOptions: CustomPropTypes.hashmapOf(
    PropTypes.shape({
      label: PropTypes.string,
      className: PropTypes.string,
      backgroundColor: PropTypes.string,
      color: PropTypes.string,
      tasks: CustomPropTypes.hashmapOf(PropTypes.bool),
    }),
  ).isRequired,
  columnId: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  removeLabelFromTask: PropTypes.func.isRequired,
};

export default Labels;
