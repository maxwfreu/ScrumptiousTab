import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleWobble, toggleBookMarks as toggleBookMarksAction, toggleWelcomeBanner, toggleScrumptious } from '../Actions';
import { logEvent, initalizeBookMarks, getBooleanFromLocalStorage } from '../../utils';
import 'react-toggle/style.css';

class SettingsPanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      oops: false,
    };

    this.toggleWobble = this.toggleWobble.bind(this);
    this.toggleBookMark = this.toggleBookMark.bind(this);
    this.toggleWelcomeBanner = this.toggleWelcomeBanner.bind(this);
    this.askForPermissions = this.askForPermissions.bind(this);
    this.handleBookMarkPress = this.handleBookMarkPress.bind(this);
    this.toggleDefaultTab = this.toggleDefaultTab.bind(this);
    this.handleTabPress = this.handleTabPress.bind(this);
  }

  componentDidUpdate() {
    const { oops } = this.state;
    if (oops) {
      this.setState({
        oops: false,
      });
    }
  }

  toggleDefaultTab(hideScrumptious) {
    if (hideScrumptious) {
      logEvent('settings', 'Show Kanban');
    } else {
      logEvent('settings', 'Hide Kanban');
    }
    this.props.toggleScrumptious(hideScrumptious);
    if (hideScrumptious) {
      chrome.tabs.update({
        url: 'chrome-search://local-ntp/local-ntp.html',
      });
    }
  }

  toggleWobble(e) {
    const enableWobble = e.target.checked;
    if (enableWobble) {
      logEvent('settings', 'Enable Wobble');
    } else {
      logEvent('settings', 'Disable Wobble');
    }
    this.props.toggleWobble();
  }

  toggleWelcomeBanner(e) {
    const enableWobble = e.target.checked;
    if (enableWobble) {
      logEvent('settings', 'Show Header');
    } else {
      logEvent('settings', 'Hide Header');
    }
    this.props.toggleWelcomeBanner();
  }

  toggleBookMark(showBookMark) {
    if (showBookMark) {
      logEvent('settings', 'Show Bookmarks');
    } else {
      logEvent('settings', 'Hide Bookmarks');
    }
    this.props.toggleBookMarksAction(showBookMark);
  }

  askForPermissions() {
    if (!chrome || !chrome.permissions) {
      this.props.toggleBookMarksAction(false);
      return;
    }
    chrome.permissions.request({
      permissions: ['bookmarks'],
    }, (granted) => {
      if (granted) {
        initalizeBookMarks();
        this.toggleBookMark(true);
      } else {
        console.log('Aww');
      }
    });
  }

  handleBookMarkPress(e) {
    if (!chrome || !chrome.permissions) {
      this.props.toggleBookMarksAction(false);
      this.setState({
        oops: true,
      });
      return;
    }
    e.persist();
    chrome.permissions.contains({ permissions: ['bookmarks'] }, (result) => {
      if (result) {
        this.toggleBookMark(e.target.checked);
      } else {
        this.askForPermissions();
      }
    });
  }

  handleTabPress(e) {
    if (!chrome || !chrome.permissions) {
      this.props.toggleScrumptious(false);
      this.setState({
        oops: true,
      });
      return;
    }
    e.persist();
    this.toggleDefaultTab(e.target.checked);
  }

  render() {
    const {
      isBookMarksVisible,
      isWobbleDisabled,
      isWelcomeBannerHidden,
      hideScrumptious,
    } = this.props;
    const { oops } = this.state;
    return (
      <div className="info-popup-inner">
        {!process.env.FIREFOX && (
          <div className="info-title">
            Bookmarks
            {oops ? (
              <div>
                <Toggle
                  defaultChecked={false}
                  icons={false}
                  onChange={this.handleBookMarkPress}
                />
              </div>
            ) : (
              <Toggle
                defaultChecked={isBookMarksVisible}
                icons={false}
                onChange={this.handleBookMarkPress}
              />
            )}
          </div>
        )}
        <div className={`info-title ${process.env.FIREFOX ? '' : 'not-delicious'}`}>
          Header
          <Toggle
            defaultChecked={!isWelcomeBannerHidden}
            icons={false}
            onChange={this.toggleWelcomeBanner}
          />
        </div>
        <div className="info-title not-delicious">
          Card Wobble
          <Toggle
            defaultChecked={!isWobbleDisabled}
            icons={false}
            onChange={this.toggleWobble}
          />
        </div>
        <p>
          Turn on for a natural movement when you drag your tasks from column to column
        </p>
        {!process.env.FIREFOX && (
          <React.Fragment>
            <div className="info-title not-delicious">
              Default New Tab
              <Toggle
                defaultChecked={hideScrumptious}
                icons={false}
                onChange={this.handleTabPress}
              />
            </div>
            <p>
              Turn on to get back your new tab. Access your Kanban board by clicking on the Scrumptious icon in your extensions toolbar
            </p>
          </React.Fragment>
        )}
        <div className="info-title-subsection settings-subsection">
          <div className="subsection-header">
            More Coming Soon
            <a
              className="suggestion-link"
              href="https://scrumptioustab.com/feature"
              rel="noopener noreferrer"
              target="_blank"
            >
              Make Suggestion
            </a>
          </div>
          <div>
            What kinds of settings do you want to see?<br />
            Send us a note and let us know!
          </div>
        </div>
      </div>
    );
  }
}

SettingsPanel.propTypes = {
  toggleBookMarksAction: PropTypes.func.isRequired,
  toggleWobble: PropTypes.func.isRequired,
  isWobbleDisabled: PropTypes.bool.isRequired,
  isBookMarksVisible: PropTypes.bool.isRequired,
  hideScrumptious: PropTypes.bool.isRequired,
  toggleScrumptious: PropTypes.func.isRequired,
  isWelcomeBannerHidden: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ AppSettings }) => ({
  isWobbleDisabled: AppSettings.isWobbleDisabled,
  isBookMarksVisible: AppSettings.isBookMarksVisible,
  hideScrumptious: AppSettings.hideScrumptious,
  isWelcomeBannerHidden: AppSettings.isWelcomeBannerHidden,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleWobble,
    toggleBookMarksAction,
    toggleScrumptious,
    toggleWelcomeBanner,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPanel);
