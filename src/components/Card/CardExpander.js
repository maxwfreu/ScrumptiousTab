import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const MAX_HEIGHT = 250;

class CardExpander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOverHeightLimit: false,
      isExpanded: false,
    };
    this.expanderRef = React.createRef();
    this.checkClientHeight = this.checkClientHeight.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  componentDidMount() {
    this.checkClientHeight();
  }

  componentDidUpdate() {
    this.checkClientHeight();
  }

  checkClientHeight() {
    if (this.props.isEditing) return;
    const { clientHeight } = this.expanderRef.current;
    if (clientHeight > MAX_HEIGHT && !this.state.isOverHeightLimit) {
      this.setState({
        isOverHeightLimit: true,
      });
    } else if (clientHeight < MAX_HEIGHT && this.state.isOverHeightLimit) {
      this.setState({
        isOverHeightLimit: false,
      });
    }
  }

  toggleExpand(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
    }));
  }

  render() {
    const withOverlay = !this.props.isEditing && this.state.isOverHeightLimit;
    const withClose = !this.props.isEditing && this.state.isExpanded;
    const expanderClasses = classnames(
      'card-content',
      {
        placeholder: this.props.isEmpty,
        isEditing: this.props.isEditing,
        'with-overlay': withOverlay && !this.state.isExpanded,
        'with-closed-overlay': withOverlay && this.state.isExpanded,
      },
    );
    return (
      <div className={expanderClasses} ref={this.expanderRef}>
        {this.props.children}
        {withOverlay && !this.state.isExpanded && (
          <div className="with-overlay-expand-container">
            <button onClick={this.toggleExpand}>Expand</button>
          </div>
        )}
        {withClose && (
          <div className="with-overlay-close-container">
            <button onClick={this.toggleExpand}>Close</button>
          </div>
        )}
      </div>
    );
  }
}

CardExpander.propTypes = {
  isEmpty: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default CardExpander;
