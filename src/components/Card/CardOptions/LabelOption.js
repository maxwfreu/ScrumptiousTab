import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { changeLabelText, deleteLabel, setLabelColor } from '../../Actions/LabelActions';
import LabelColorPicker from './LabelColorPicker';
import LabelHoverButtons from './LabelHoverButtons';

// Renders a label option (assignable to a task)
class LabelOption extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
      isInputFocused: false,
      value: props.option.label,
      didRecieveActiveLabel: false,
    };

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.toggleLabel = this.toggleLabel.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setLabelText = this.setLabelText.bind(this);

    this.onInputClick = this.onInputClick.bind(this);
    this.onColorClick = this.onColorClick.bind(this);

    this.setOptionsRef = this.setOptionsRef.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }

  componentDidMount() {
    document.getElementById('app').addEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate() {
    const { isInputFocused, didRecieveActiveLabel } = this.state;
    const { activeLabelOverride, optionKey } = this.props;
    if (isInputFocused) {
      ReactDOM.findDOMNode(this.inputRef).focus();
    } else if (activeLabelOverride === optionKey && !didRecieveActiveLabel) {
      this.setState({
        isInputFocused: true,
        didRecieveActiveLabel: true,
      });
    }
  }

  componentWillUnmount() {
    document.getElementById('app').removeEventListener('mousedown', this.handleClickOutside);
  }

  onMouseOver() {
    this.setState({
      showOptions: true,
    });
  }

  onMouseLeave() {
    this.setState({
      showOptions: false,
    });
  }

  onInputClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const { isInputFocused } = this.state;
    const { optionKey } = this.props;
    if (isInputFocused) return;
    this.props.toggleLabel(optionKey);
  }

  onColorClick(optionKey, colorOption) {
    this.props.setLabelColor(
      optionKey,
      colorOption.backgroundColor,
    );
  }

  setOptionsRef(node) {
    this.optionsRef = node;
  }

  setInputRef(node) {
    this.inputRef = node;
  }

  setLabelText(e) {
    const { optionKey } = this.props;
    this.props.changeLabelText(optionKey, e.target.value);
  }

  handleClickOutside(event) {
    if (!this.optionsRef) return;
    const { cardOptionsRef, optionKey, option } = this.props;
    const { isInputFocused } = this.state;
    const containsTarget = this.optionsRef.contains(event.target);
    if (isInputFocused && !containsTarget) {
      if (cardOptionsRef && !cardOptionsRef.contains(event.target)) {
        if (!option.label) {
          this.props.changeLabelText(optionKey, 'Custom Label');
        }
        event.stopPropagation();
        this.setState({
          isInputFocused: false,
        });
        return;
      }
      this.setState({
        isInputFocused: false,
      });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const { optionKey, option } = this.props;
      if (!option.label) {
        this.props.changeLabelText(optionKey, 'Custom Label');
      }
      this.setState({
        isInputFocused: false,
      });
    }
  }

  focusInput() {
    this.inputRef.focus();
    this.setState({
      isInputFocused: true,
    });
  }

  toggleLabel(e) {
    e.preventDefault();
    e.stopPropagation();
    const { optionKey } = this.props;
    this.props.toggleLabel(optionKey);
  }

  render() {
    const { isInputFocused, showOptions } = this.state;
    const { option, optionKey, selectedClass, taskId, columnId } = this.props;
    const focusedClass = isInputFocused ? 'focused' : '';
    const focusedStyle = isInputFocused ? { marginBottom: '20px' } : {};
    return (
      <div className="pick-label-item" onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave} ref={this.setOptionsRef}>
        <div className={`pick-label-item-row ${focusedClass}`}>
          <span className={`label-select ${selectedClass}`} onClick={this.toggleLabel} />
          <div className={`pick-label-input-row ${focusedClass}`}>
            <input
              key={`label-option-${optionKey}`}
              ref={this.setInputRef}
              className={`demo-priority editable ${focusedClass}`}
              style={{
                backgroundColor: option.backgroundColor,
                color: option.color,
                borderColor: option.backgroundColor,
              }}
              defaultValue={option.label}
              placeholder="Custom Label"
              onChange={this.setLabelText}
              readOnly={!isInputFocused}
              onKeyPress={this.handleKeyPress}
              onClick={this.onInputClick}
            />
            {isInputFocused && (
              <LabelColorPicker
                onColorClick={this.onColorClick}
                optionKey={optionKey}
                option={option}
              />
            )}
          </div>
        </div>
        <LabelHoverButtons
          showOptions={showOptions}
          isInputFocused={isInputFocused}
          columnId={columnId}
          taskId={taskId}
          optionKey={optionKey}
          deleteLabel={this.props.deleteLabel}
          focusInput={this.focusInput}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    changeLabelText,
    deleteLabel,
    setLabelColor,
  }, dispatch)
);

export default connect(null, mapDispatchToProps)(LabelOption);
