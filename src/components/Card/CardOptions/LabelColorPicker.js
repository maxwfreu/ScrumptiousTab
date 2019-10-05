import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';


const COLOR_OPTIONS = [
  { backgroundColor: '#EC1A45', color: 'white', id: 'urgent' }, // Red
  { backgroundColor: '#FDBA09', color: 'white', id: 'high-priority' }, // Yellow
  { backgroundColor: '#12A4FF', color: 'white', id: 'low-priority' }, // Blue
  { backgroundColor: '#71CA58', color: 'white', id: 'green' }, // Green
  { backgroundColor: '#46C0A5', color: 'white', id: 'green-blue' }, // Green / Blue
  { backgroundColor: '#7A6AD5', color: 'white', id: 'purple' }, // Purple
  { backgroundColor: '#CF45A6', color: 'white', id: 'pink' }, // Pink
  { backgroundColor: '#A4B0BE', color: 'white', id: 'gray' }, // Gray
];

// renders the colors to assign to a label
const LabelColorPicker = ({
  onColorClick,
  optionKey,
  option,
}) => (
  <div className="pick-label-color-row">
    {COLOR_OPTIONS.map((colorOption) => {
      const bgSelectedClass = classnames({
        selected: option.backgroundColor === colorOption.backgroundColor,
      });
      return (
        <span
          role="button"
          key={colorOption.backgroundColor}
          style={{ backgroundColor: colorOption.backgroundColor }}
          className={`color-option ${bgSelectedClass}`}
          onClick={() => onColorClick(optionKey, colorOption)}
        />
      );
    })}
  </div>
);

LabelColorPicker.propTypes = {
  onColorClick: PropTypes.func.isRequired,
  optionKey: PropTypes.string.isRequired,
  option: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
  }).isRequired,
};

export default LabelColorPicker;
