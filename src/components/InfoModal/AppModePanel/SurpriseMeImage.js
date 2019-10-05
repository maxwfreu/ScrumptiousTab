import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class SurpriseMeImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setBackgroundMode = this.setBackgroundMode.bind(this);
  }

  setBackgroundMode() {
    this.props.updateBackgroundMode(this.props.imageId);
  }

  render() {
    const imgClasses = classnames({
      'active-bg': this.props.backgroundMode === this.props.imageId,
    });
    return (
      <img
        alt={this.props.alt}
        className={imgClasses}
        src={`https://cdn.scrumptioustab.com/optional/${this.props.imageId}.png`}
        onClick={this.setBackgroundMode}
      />
    );
  }
}

SurpriseMeImage.propTypes = {
  alt: PropTypes.string.isRequired,
  backgroundMode: PropTypes.number.isRequired,
  imageId: PropTypes.number.isRequired,
  updateBackgroundMode: PropTypes.func.isRequired,
}

export default SurpriseMeImage;