import ScrumptiousConstants from '../ScrumptiousConstants';

export const updateName = name => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.USERNAME_SET,
      name,
    });
  }
);

export const setAppMode = appMode => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.APP_MODE_SET,
      appMode,
    });
  }
);

export const setBackgroundMode = (backgroundMode, isCustomUpdate = false) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.BACKGROUND_MODE_SET,
      backgroundMode,
      isCustomUpdate,
    });
  }
);

export const toggleWobble = () => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.WOBBLE_TOGGLE,
    });
  }
);

export const toggleInfoModal = (isInfoModalHidden, panelToShow = 0) => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.INFO_MODAL_TOGGLE,
      isInfoModalHidden,
      panelToShow,
    });
  }
);

export const toggleBookMarks = isBookMarksVisible => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.BOOKMARKS_TOGGLE,
      isBookMarksVisible,
    });
  }
);

export const toggleScrumptious = hideScrumptious => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.SCRUMPTIOUS_TOGGLE,
      hideScrumptious,
    });
  }
);

export const toggleMilitaryTime = () => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.MILITARY_TIME_TOGGLE,
    });
  }
);

export const toggleSHHMode = isShh => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.SHH_MODE_TOGGLE,
      isShh,
    });
  }
);

export const toggleWelcomeBanner = () => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.WELCOME_BANNER_TOGGLE,
    });
  }
);

export const setArchiveSeen = () => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.ARCHIVE_SEEN,
    });
  }
);
