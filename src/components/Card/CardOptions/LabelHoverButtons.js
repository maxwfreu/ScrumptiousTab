import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Renders buttons next to label option (edit / delete)
const LabelHoverButtons = ({
  showOptions,
  isInputFocused,
  columnId,
  taskId,
  optionKey,
  focusInput,
  deleteLabel,
}) => {
  const hoverButtonsClasses = classnames(
    'pick-label-item-row',
    'hover-icons',
    {
      hide: !showOptions,
      'hover-icons-focused': isInputFocused,
    },
  );
  return (
    <div className={hoverButtonsClasses}>
      <button
        type="button"
        aria-label="Edit Label"
        className="edit-button right"
        onClick={focusInput}
      />
      <button
        type="button"
        aria-label="Delete Label"
        className="delete-button right"
        onClick={() => deleteLabel(
          columnId,
          taskId,
          optionKey,
        )}
      />
    </div>
  );
};

LabelHoverButtons.propTypes = {
  showOptions: PropTypes.bool.isRequired,
  isInputFocused: PropTypes.bool.isRequired,
  focusInput: PropTypes.func.isRequired,
  columnId: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  optionKey: PropTypes.string.isRequired,
  deleteLabel: PropTypes.func.isRequired,
};

export default LabelHoverButtons;
