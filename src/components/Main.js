import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import loadable from '@loadable/component';
import localforage from 'localforage';
import classnames from 'classnames';
import {
  toggleInfoModal as toggleInfoModalAction,
} from './Actions';
import {
  fetchScrumptiousData as fetchScrumptiousDataAction,
  refreshTaskData as refreshTaskDataAction,
  refreshAppData as refreshAppDataAction,
  refreshColumnData as refreshColumnDataAction,
  refreshLabelData as refreshLabelDataAction,
} from './Actions/DBActions';
import '../styles/App.scss';
import '../styles/Column.scss';
import '../styles/Card.scss';
import '../styles/DarkMode.scss';
import '../styles/Bookmark.scss';

import(/* webpackPrefetch: true */'../styles/IconToolbar.scss');
import(/* webpackPrefetch: true */'../styles/Archive.scss');

const WelcomeBanner = loadable(() => import(/* webpackPrefetch: true */'./WelcomeBanner'));
const BookmarkBar = loadable(() => import(/* webpackPrefetch: true */'./BookmarkBar'));
const InfoModal = loadable(() => import(/* webpackPrefetch: true */'./InfoModal'));
const ScrumBoard = loadable(() => import(/* webpackPrefetch: true */'./ScrumBoard'));
const KeyBoardListener = loadable(() => import(/* webpackPrefetch: true */'./KeyBoardListener'));

const APP_KEYS = [
  'app-mode',
  'backgroundMode',
  'isToolbarHidden',
  'isWobbleDisabled',
  'show-bookmark',
  'username',
  'isMilitaryTime',
];

class Main extends Component {
  /*
    Fetches task data and preloads current background.
  */
  constructor(props) {
    super(props);
    let bgURL = `https://cdn.scrumptioustab.com/${process.env.APP_ENV}/background`;
    if (props.backgroundMode !== 0) {
      bgURL = `https://cdn.scrumptioustab.com/optional/${props.backgroundMode}`;
    }
    if (props.backgroundMode < 8) {
      const img = new Image();
      img.src = bgURL;
    }

    this.state = {
      closedTab: false,
      bgURL: '',
    };

    this.hideInfo = this.hideInfo.bind(this);
    this.setInfoRef = this.setInfoRef.bind(this);
    this.refreshStore = this.refreshStore.bind(this);
    this.refreshLocalStorage = this.refreshLocalStorage.bind(this);
    this.blurTab = this.blurTab.bind(this);
    this.getBackgroundURL = this.getBackgroundURL.bind(this);
  }

  componentDidMount() {
    const { backgroundMode } = this.props;
    const that = this;
    const bucket = backgroundMode === 9 ? 'photo-1' : 'photo-2';
    localforage.getItem(bucket).then((image) => {
      const blob = new Blob([image]);
      const imageURI = window.URL.createObjectURL(blob);
      that.setState({
        bgURL: imageURI,
      });
    }).catch((err) => {
      console.log(err);
    });
    window.focus();
    window.addEventListener('focus', this.refreshStore);
    window.addEventListener('storage', this.refreshLocalStorage);
    window.addEventListener('blur', this.blurTab);
    this.props.fetchScrumptiousData();
  }

  componentDidUpdate(prevProps) {
    const { backgroundMode, shouldUpdateToggle } = this.props;
    if (prevProps.backgroundMode === backgroundMode
      && prevProps.shouldUpdateToggle === shouldUpdateToggle) return;
    const that = this;
    const bucket = backgroundMode === 9 ? 'photo-1' : 'photo-2';
    localforage.getItem(bucket).then((image) => {
      const blob = new Blob([image]);
      const imageURI = window.URL.createObjectURL(blob);
      that.setState({
        bgURL: imageURI,
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.refreshStore);
    window.removeEventListener('storage', this.refreshLocalStorage);
    window.removeEventListener('blur', this.blurTab);
  }

  /*
    Sets ref around InfoModal component
  */
  setInfoRef(node) {
    this.infoRef = node;
  }

  blurTab() {
    this.setState({
      closedTab: true,
    });
  }

  refreshLocalStorage(e) {
    const { refreshAppData } = this.props;
    window.localStorage.setItem(e.key, e.newValue);
    if (APP_KEYS.includes(e.key)) {
      refreshAppData();
    }
  }

  refreshStore(e) {
    const { closedTab } = this.state;
    const { refreshTaskData, refreshColumnData, refreshLabelData } = this.props;

    if (closedTab) {
      refreshTaskData();
      refreshColumnData();
      refreshLabelData();
      this.setState({
        closedTab: false,
      });
    }
  }

  /*
    Closes the InfoModal
  */
  hideInfo(event) {
    const { toggleInfoModal, isInfoModalHidden } = this.props;
    if (isInfoModalHidden) return;
    if (this.infoRef.contains(event.target)) return;
    toggleInfoModal(true);
  }

  /*
    Fetches the background url of the app.
    Appens a version to url for cache busting.
    Version is CurMonth_MondayOfWeek_CurYear
  */
  getBackgroundURL() {
    const { bgURL } = this.state;
    const { backgroundMode } = this.props;
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const diff = currentDate.getDate()
      - currentDay
      + (currentDay === 0 ? -6 : 1);
    const monday = new Date(currentDate.setDate(diff));
    monday.setHours(0, 0, 0);
    const version = `${monday.getMonth()}_${monday.getDate()}_${monday.getFullYear()}`;

    let backgroundURL = `https://cdn.scrumptioustab.com/${process.env.APP_ENV}/background.png?v=${version}`;
    if (backgroundMode !== 0) {
      backgroundURL = `https://cdn.scrumptioustab.com/optional/${backgroundMode}.png`;
    }
    if (backgroundMode > 8) {
      backgroundURL = bgURL;
    }
    return backgroundURL;
  }

  render() {
    const {
      appMode,
      isInfoModalHidden,
      isBookMarksVisible,
    } = this.props;

    const bgURL = this.getBackgroundURL();
    const backgroundClasses = classnames(
      'bg-img',
      {
        'bg-loaded': bgURL !== '',
      },
    );
    const appModeClass = classnames(
      {
        light: appMode === 0,
        'dark-mode': appMode === 50,
        'image-mode': appMode !== 0 && appMode !== 50,
      },
    );
    const bookMarkClasses = classnames(
      {
        'with-bookmarks': isBookMarksVisible,
      },
    );
    const appWrapperClasses = classnames(
      'App-wrapper',
      appModeClass,
      bookMarkClasses,
    );
    const appClasses = classnames(
      'App',
      appModeClass,
      bookMarkClasses,
      {
        'app-info-open': !isInfoModalHidden,
      },
    );

    return (
      <div>
        <div
          className={appWrapperClasses}
          onClick={this.hideInfo}
        >
          <BookmarkBar />
          <div
            className={appClasses}
          >
            <WelcomeBanner showInfo={this.showInfo} />
            <KeyBoardListener />
            <ScrumBoard />
          </div>
          <div ref={this.setInfoRef}>
            <InfoModal
              showInfoModal={!isInfoModalHidden}
            />
          </div>
        </div>
        {appMode === 100 && (
          <img
            src={bgURL}
            className={backgroundClasses}
            alt="Scrumptious Background"
          />
        )}
        {appMode !== 100 && (
          <div
            className={`bg-static ${appModeClass}`}
          />
        )}
      </div>
    );
  }
}

Main.propTypes = {
  appMode: PropTypes.number.isRequired,
  backgroundMode: PropTypes.number.isRequired,
  isInfoModalHidden: PropTypes.bool.isRequired,
  isBookMarksVisible: PropTypes.bool.isRequired,
  shouldUpdateToggle: PropTypes.bool.isRequired,
  toggleInfoModal: PropTypes.func.isRequired,
  fetchScrumptiousData: PropTypes.func.isRequired,
  refreshTaskData: PropTypes.func.isRequired,
  refreshAppData: PropTypes.func.isRequired,
  refreshColumnData: PropTypes.func.isRequired,
  refreshLabelData: PropTypes.func.isRequired,
};

const mapStateToProps = ({ AppSettings }) => ({
  appMode: AppSettings.appMode,
  backgroundMode: AppSettings.backgroundMode,
  isInfoModalHidden: AppSettings.isInfoModalHidden,
  isBookMarksVisible: AppSettings.isBookMarksVisible,
  shouldUpdateToggle: AppSettings.shouldUpdateToggle,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleInfoModal: toggleInfoModalAction,
    fetchScrumptiousData: fetchScrumptiousDataAction,
    refreshTaskData: refreshTaskDataAction,
    refreshAppData: refreshAppDataAction,
    refreshColumnData: refreshColumnDataAction,
    refreshLabelData: refreshLabelDataAction,
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Main);
