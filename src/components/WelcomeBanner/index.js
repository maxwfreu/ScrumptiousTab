import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import AutosizeInput from 'react-input-autosize';
import { updateName, toggleMilitaryTime as toggleMilitaryTimeAction, toggleSHHMode } from '../Actions';
import NewAlert from './NewAlert';
import { monthNames } from '../../utils';
import '../../styles/WelcomeBanner.scss';
import {
  toggleInfoModal as toggleInfoModalAction,
} from '../Actions';

class WelcomeBanner extends PureComponent {
  constructor(props) {
    super(props);
    const isNameSet = props.name && props.name.length > 0;
    this.state = {
      date: new Date(),
      isNameSet: !!isNameSet,
      isInputFocused: false,
    };

    this.updateName = this.updateName.bind(this);
    this.setName = this.setName.bind(this);
    this.getTimeOfDayGreeting = this.getTimeOfDayGreeting.bind(this);
    this.focusInput = this.focusInput.bind(this);

    this.toggleTimeType = this.toggleTimeType.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setInputWrapperRef = this.setInputWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleBackgroundMode = this.toggleBackgroundMode.bind(this);
    this.toggleZENMODE = this.toggleZENMODE.bind(this);
    this.showInfo = this.showInfo.bind(this);
  }

  /*
    Set interval for clock on mount
  */
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      10000,
    );
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  /*
    Remove the interval when the component unmounts
  */
  componentWillUnmount() {
    clearInterval(this.timerID);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /*
    Set ref for welcome component
  */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /*
    Get time formatted HH:MM
  */
  getTime() {
    const { date } = this.state;
    const { isMilitaryTime } = this.props;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes; // =>  30

    if (isMilitaryTime) {
      return `${hours}:${minutes}`;
    }
    hours = hours > 12 ? hours - 12 : hours; // => 9
    if (hours === 0) {
      hours = 12;
    }
    return `${hours}:${minutes}`;
  }

  /*
    Get today formatted as July 21
  */
  getToday() {
    const { date } = this.state;
    const dd = date.getDate();
    const mm = date.getMonth(); // January is 0!
    return `${monthNames[mm]} ${dd}`;
  }

  /*
    Get greeting specific to time
  */
  getTimeOfDayGreeting() {
    const { date } = this.state;
    if (date.getHours() < 11) {
      return 'morning';
    }
    if (date.getHours() < 17) {
      return 'afternoon';
    }
    return 'evening';
  }

  /*
    Update users name. Used on blur
  */
  setName(ev) {
    const name = ev.target.value;
    if (!name && name.length === 0) {
      return;
    }
    const { isNameSet } = this.state;
    if (!isNameSet) {
      this.setState({
        isNameSet: true,
      });
    }
  }

  setInputWrapperRef(node) {
    this.inputWrapperRef = node;
  }

  focusInput() {
    this.setState({
      isInputFocused: true,
    });
  }

  handleClickOutside(e) {
    const { isInputFocused } = this.state;
    if (this.inputWrapperRef && !this.inputWrapperRef.input.contains(e.target) && isInputFocused) {
      this.inputWrapperRef.blur();
      this.setState({
        isInputFocused: false,
      });
    }
  }

  /*
    Open the InfoModal component
  */
  showInfo(panelToShow=0) {
    const { toggleInfoModal } = this.props;
    toggleInfoModal(false, panelToShow);
  }

  /*
    Set current time
  */
  tick() {
    const { date } = this.state;
    const newMinutes = (new Date()).getMinutes();
    const oldMinutes = date.getMinutes();
    if (newMinutes === oldMinutes) return;
    this.setState({
      date: new Date(),
    });
  }

  /*
    Update users name. Used on Change
  */
  updateName(ev) {
    const name = ev.target.value;
    const { updateName: updateUserName } = this.props;
    updateUserName(name);
    if (!name && name.length === 0) {
      this.setState({
        isNameSet: false,
      });
    }
  }

  /*
    Switch time between standard and military
  */
  toggleTimeType() {
    const { toggleMilitaryTime } = this.props;
    toggleMilitaryTime();
  }

  toggleBackgroundMode() {
    const { toggleSHHMode: toggleSHHModeAction } = this.props;
    toggleSHHModeAction(false);
  }

  toggleZENMODE() {
    const { toggleSHHMode: toggleSHHModeAction } = this.props;
    toggleSHHModeAction(true);
  }

  render() {
    const today = this.getToday();
    const time = this.getTime();
    const timeOfDayGreeting = this.getTimeOfDayGreeting();
    const { name, shhMode, isWelcomeBannerHidden } = this.props;
    const { isNameSet } = this.state;
    const greeting = `Good ${timeOfDayGreeting},`;
    const sshModeClass = shhMode ? 'shh-mode' : '';
    if (isWelcomeBannerHidden) {
      return null;
    }
    return (
      <div className="welcome-banner-wrapper">
        <div className="welcome-banner-row">
          <NewAlert showInfo={this.showInfo} />
          <span className={`today ${sshModeClass}`}>{`${today}`}</span>
          <div className={`welcome ${sshModeClass}`} ref={this.setWrapperRef}>
            {isNameSet && (
              <React.Fragment>
                <div className="welcome-greeting-mini">
                  {'Hello,'}
                  &nbsp;
                </div>
                <div className="welcome-greeting">
                  {greeting}
                  &nbsp;
                </div>
              </React.Fragment>
            )}
            <div className="shh-mode-name">
              {name}
            </div>
            {!shhMode && (
              <AutosizeInput
                ref={this.setInputWrapperRef}
                key="name-input-key"
                value={name}
                onFocus={this.focusInput}
                onChange={this.updateName}
                onBlur={this.setName}
                maxLength={25}
                placeholder="What is your name?"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="welcome-banner-row time-row">
          <span className={`time ${sshModeClass}`} onClick={this.toggleTimeType}>{`${time}`}</span>
        </div>
        <div className="welcome-banner-row slider-row">
          <div className="right-row-inner">
            <div className="zen-toggle-wrapper">
              <button
                type="button"
                className={`board-toggle  ${shhMode ? '' : 'active'}`}
                onClick={this.toggleBackgroundMode}
              />
              <button
                type="button"
                className={`zen-toggle  ${shhMode ? 'active' : ''}`}
                onClick={this.toggleZENMODE}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WelcomeBanner.propTypes = {
  name: PropTypes.string,
  updateName: PropTypes.func.isRequired,
  toggleInfoModal: PropTypes.func.isRequired,
  isMilitaryTime: PropTypes.bool.isRequired,
  isWelcomeBannerHidden: PropTypes.bool.isRequired,
  toggleMilitaryTime: PropTypes.func.isRequired,
  shhMode: PropTypes.bool.isRequired,
};

WelcomeBanner.defaultProps = {
  name: '',
};


const mapStateToProps = ({ AppSettings }) => ({
  name: AppSettings.name,
  isMilitaryTime: AppSettings.isMilitaryTime,
  isWelcomeBannerHidden: AppSettings.isWelcomeBannerHidden,
  shhMode: AppSettings.shhMode,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateName,
    toggleMilitaryTime: toggleMilitaryTimeAction,
    toggleSHHMode,
    toggleInfoModal: toggleInfoModalAction,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeBanner);
