import update from 'immutability-helper';
import ScrumptiousConstants from '../ScrumptiousConstants';
import { getBooleanFromLocalStorage } from '../../utils';

const getBackgroundMode = () => {
  let backgroundMode = window.localStorage.getItem('backgroundMode', 0);
  if (backgroundMode === null || isNaN(backgroundMode)) {
    backgroundMode = 0;
  }
  return parseInt(backgroundMode, 10);
};

const getAppMode = () => {
  let appMode = window.localStorage.getItem('app-mode', 100);
  if (appMode === null || isNaN(appMode)) {
    appMode = 100;
  }
  return parseInt(appMode, 10);
};

const getInitialAppSettings = () => {
  const isToolbarHidden = getBooleanFromLocalStorage('isToolbarHidden');
  const isWobbleDisabled = getBooleanFromLocalStorage('isWobbleDisabled');
  const isBookMarksVisible = getBooleanFromLocalStorage('show-bookmark');
  const isMilitaryTime = getBooleanFromLocalStorage('isMilitaryTime');
  const hideScrumptious = getBooleanFromLocalStorage('hideScrumptious');
  const isWelcomeBannerHidden = getBooleanFromLocalStorage('isWelcomeBannerHidden');
  const shhMode = getBooleanFromLocalStorage('shhMode');
  const hasSeenArchive = getBooleanFromLocalStorage('hasSeenArchive');
  const appMode = getAppMode();
  const backgroundMode = getBackgroundMode();
  return {
    appMode,
    backgroundMode,
    hideScrumptious,
    isBookMarksVisible,
    shouldUpdateToggle: false,
    isInfoModalHidden: true,
    isWobbleDisabled,
    isWelcomeBannerHidden,
    isToolbarHidden,
    isMilitaryTime,
    isSavingEnabled: false,
    name: window.localStorage.getItem('username', '') || '',
    shhMode,
    panelToShow: 0,
    hasSeenArchive,
  };
};

const initialState = getInitialAppSettings();

const AppSettings = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  let updatedState = state;
  switch (action.type) {
    case ScrumptiousConstants.REFRESH_APP_SETTINGS: {
      const name = window.localStorage.getItem('username', '') || '';
      const backgroundMode = getBackgroundMode();
      const appMode = getAppMode();
      const isToolbarHidden = getBooleanFromLocalStorage('isToolbarHidden');
      const isWobbleDisabled = getBooleanFromLocalStorage('isWobbleDisabled');
      const isBookMarksVisible = getBooleanFromLocalStorage('show-bookmark');
      const isMilitaryTime = getBooleanFromLocalStorage('isMilitaryTime');
      const hideScrumptious = getBooleanFromLocalStorage('hideScrumptious');

      updatedState = update(state, {
        name: { $set: name },
        backgroundMode: { $set: backgroundMode },
        appMode: { $set: appMode },
        hideScrumptious: { $set: hideScrumptious },
        isToolbarHidden: { $set: isToolbarHidden },
        isWobbleDisabled: { $set: isWobbleDisabled },
        isBookMarksVisible: { $set: isBookMarksVisible },
        isMilitaryTime: { $set: isMilitaryTime },
      });
      break;
    }
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_SUCCESS:
      updatedState = update(state, {
        isSavingEnabled: { $set: true },
      });
      break;
    case ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_FAILURE:
      updatedState = update(state, {
        isSavingEnabled: { $set: false },
      });
      break;
    case ScrumptiousConstants.BOOKMARKS_TOGGLE: {
      updatedState = update(state, {
        isBookMarksVisible: { $set: action.isBookMarksVisible },
      });
      break;
    }
    case ScrumptiousConstants.SCRUMPTIOUS_TOGGLE: {
      updatedState = update(state, {
        hideScrumptious: { $set: action.hideScrumptious },
      });
      break;
    }
    case ScrumptiousConstants.USERNAME_SET: {
      updatedState = update(state, {
        name: { $set: action.name },
      });
      break;
    }
    case ScrumptiousConstants.APP_MODE_SET: {
      updatedState = update(state, {
        appMode: { $set: action.appMode },
      });
      break;
    }
    case ScrumptiousConstants.BACKGROUND_MODE_SET: {
      updatedState = update(state, {
        backgroundMode: { $set: action.backgroundMode },
        shouldUpdateToggle: { $set: action.isCustomUpdate ? !state.shouldUpdateToggle : state.shouldUpdateToggle },
      });
      break;
    }
    case ScrumptiousConstants.TOOLBAR_HIDE: {
      updatedState = update(state, {
        isToolbarHidden: { $set: true },
      });
      break;
    }
    case ScrumptiousConstants.TOOLBAR_SHOW: {
      updatedState = update(state, {
        isToolbarHidden: { $set: false },
      });
      break;
    }
    case ScrumptiousConstants.WOBBLE_TOGGLE: {
      updatedState = update(state, {
        isWobbleDisabled: { $set: !state.isWobbleDisabled },
      });
      break;
    }
    case ScrumptiousConstants.INFO_MODAL_TOGGLE: {
      updatedState = update(state, {
        isInfoModalHidden: { $set: action.isInfoModalHidden },
        panelToShow: { $set: action.panelToShow },
      });
      break;
    }
    case ScrumptiousConstants.MILITARY_TIME_TOGGLE:
      updatedState = update(state, {
        isMilitaryTime: { $set: !state.isMilitaryTime },
      });
      break;
    case ScrumptiousConstants.SHH_MODE_TOGGLE:
      updatedState = update(state, {
        shhMode: { $set: action.isShh },
      });
      break;
    case ScrumptiousConstants.WELCOME_BANNER_TOGGLE:
      updatedState = update(state, {
        isWelcomeBannerHidden: { $set: !state.isWelcomeBannerHidden },
      });
      break;
    case ScrumptiousConstants.ARCHIVE_SEEN:
      updatedState = update(state, {
        hasSeenArchive: { $set: true },
      });
      break;
    default:
      updatedState = state;
      break;
  }

  if (
    process.env.DEMO_BUILD
    || !updatedState.isSavingEnabled
    || action === ScrumptiousConstants.REFRESH_APP
  ) {
    return updatedState;
  }

  window.localStorage.setItem('isToolbarHidden', updatedState.isToolbarHidden);
  window.localStorage.setItem('isWobbleDisabled', updatedState.isWobbleDisabled);
  window.localStorage.setItem('backgroundMode', updatedState.backgroundMode);
  window.localStorage.setItem('app-mode', updatedState.appMode);
  window.localStorage.setItem('username', updatedState.name);
  window.localStorage.setItem('show-bookmark', updatedState.isBookMarksVisible);
  window.localStorage.setItem('isMilitaryTime', updatedState.isMilitaryTime);
  window.localStorage.setItem('hideScrumptious', updatedState.hideScrumptious);
  window.localStorage.setItem('isWelcomeBannerHidden', updatedState.isWelcomeBannerHidden);
  window.localStorage.setItem('shhMode', updatedState.shhMode);
  window.localStorage.setItem('hasSeenArchive', updatedState.hasSeenArchive);
  return updatedState;
};

export default AppSettings;
