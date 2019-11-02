import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAppMode, setBackgroundMode } from '../../Actions';
import DragAndDrop from '../DragAndDrop';
import SurpriseMeImage from './SurpriseMeImage';

class AppModePanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.updateAppMode = this.updateAppMode.bind(this);
    this.setLightMode = this.setLightMode.bind(this);
    this.setDarkMode = this.setDarkMode.bind(this);
    this.setScrumptiousMode = this.setScrumptiousMode.bind(this);
    this.setSurpriseMeMode = this.setSurpriseMeMode.bind(this);
    this.updateBackgroundMode = this.updateBackgroundMode.bind(this);
  }

  updateBackgroundMode(backgroundMode) {
    this.props.setBackgroundMode(backgroundMode);
  }

  setLightMode() {
    this.updateAppMode(0);
  }

  setDarkMode() {
    this.updateAppMode(50);
  }

  setScrumptiousMode() {
    this.updateAppMode(100);
  }

  setSurpriseMeMode() {
    this.updateBackgroundMode(0);
  }

  updateAppMode(appMode) {
    this.props.setAppMode(appMode);
  }

  render() {
    const { appMode, backgroundMode } = this.props;
    const lightBtnClass = appMode === 0 ? 'active' : '';
    const darkBtnClass = appMode === 50 ? 'active' : '';
    const scrumptiousBtnClass = appMode === 100 ? 'active' : '';
    return (
      <div className="info-popup-inner">
        <div className="info-title">
          Modes
        </div>
        <div className="app-mode-btn-wrappers">
          <button className={`app-mode-btn light-mode ${lightBtnClass}`} onClick={this.setLightMode} type="button">
            <div className="app-mode-img light-mode-img" />
            Light
          </button>
          <button className={`app-mode-btn dark-mode ${darkBtnClass}`} onClick={this.setDarkMode} type="button">
            <div className="app-mode-img dark-mode-img" />
            Dark
          </button>
          <button className={`app-mode-btn scrumptious-mode ${scrumptiousBtnClass}`} onClick={this.setScrumptiousMode} type="button">
            <div className="app-mode-img scrumptious-mode-img" />
            Scrumptious
          </button>
        </div>
        <div className={`info-title with-padding selectable-images-wrapper ${appMode !== 100 ? 'disabled' : ''}`}>
          Choose Image
          <div className="selectable-images">
            {appMode !== 100 && (
              <div className="choose-scrumptious-mode">
                <div>
                  Choose <b>Scrumptious Mode</b> to pick a custom image.
                </div>
              </div>
            )}
            <div className="selectable-row">
              <div
                className={`surprise-me-wrapper ${backgroundMode === 0 ? 'active-bg' : ''}`}
                onClick={this.setSurpriseMeMode}
              >
                <div className="surprise-me">Suprise Me</div>
                We choose a new background image <br/>for you every week
              </div>
              <div className="surprise-me-right">
                <SurpriseMeImage
                  alt="Hills"
                  backgroundMode={backgroundMode}
                  updateBackgroundMode={this.updateBackgroundMode}
                  imageId={1}
                />
                <SurpriseMeImage
                  alt="Sheep"
                  backgroundMode={backgroundMode}
                  updateBackgroundMode={this.updateBackgroundMode}
                  imageId={2}
                />
                <SurpriseMeImage
                  alt="Forest"
                  backgroundMode={backgroundMode}
                  updateBackgroundMode={this.updateBackgroundMode}
                  imageId={3}
                />
                <SurpriseMeImage
                  alt="Shore"
                  backgroundMode={backgroundMode}
                  updateBackgroundMode={this.updateBackgroundMode}
                  imageId={4}
                />
              </div>
            </div>
            <div className="selectable-row">
              <SurpriseMeImage
                alt="Cabin"
                backgroundMode={backgroundMode}
                updateBackgroundMode={this.updateBackgroundMode}
                imageId={5}
              />
              <SurpriseMeImage
                alt="Beach"
                backgroundMode={backgroundMode}
                updateBackgroundMode={this.updateBackgroundMode}
                imageId={6}
              />
              <SurpriseMeImage
                alt="Dock"
                backgroundMode={backgroundMode}
                updateBackgroundMode={this.updateBackgroundMode}
                imageId={7}
              />
              <SurpriseMeImage
                alt="City"
                backgroundMode={backgroundMode}
                updateBackgroundMode={this.updateBackgroundMode}
                imageId={8}
              />
            </div>
          </div>
        </div>
        <DragAndDrop
          appMode={appMode}
          backgroundMode={backgroundMode}
          setBackgroundMode={this.props.setBackgroundMode}
        />
      </div>
    );
  }
}

AppModePanel.propTypes = {
  appMode: PropTypes.number.isRequired,
  setAppMode: PropTypes.func.isRequired,
  backgroundMode: PropTypes.number.isRequired,
  setBackgroundMode: PropTypes.func.isRequired,
};

const mapStateToProps = ({ AppSettings }) => ({
  appMode: AppSettings.appMode,
  backgroundMode: AppSettings.backgroundMode,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setAppMode,
    setBackgroundMode,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AppModePanel);
