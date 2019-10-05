import ScrumptiousConstants from '../ScrumptiousConstants';

export const hideToolbar = () => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TOOLBAR_HIDE,
    });
  }
);

export const showToolbar = () => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.TOOLBAR_SHOW,
    });
  }
);
