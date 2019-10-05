import ScrumptiousConstants from '../ScrumptiousConstants';

export const clearArchive = () => (
  (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.ARCHIVE_CLEAR,
    });
  }
);
