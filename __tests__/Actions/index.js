import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as Actions from '../../src/components/Actions';
import {
  initialTasks,
  initialTaskMapping,
  initialLabelOptions,
} from '../../src/utils';
import ScrumptiousConstants from '../../src/components/ScrumptiousConstants';

const mockStore = configureMockStore([thunk]);

const initialColumns = [
  { id: 'openissues', title: 'To Do', emptyState: 'todo' },
  { id: 'inprogress', title: 'Doing', emptyState: 'doing' },
  { id: 'done', title: 'Done', emptyState: 'done' },
];

describe('<Actions />', () => {
  const TaskReducer = {
    taskMapping: initialTaskMapping,
    tasks: initialTasks,
    cardNumber: 1,
    editingId: null,
    isFetchingData: true,
    lastCardMoved: '',
  };

  const ColumnReducer = {
    columns: initialColumns,
  };

  const LabelReducer = {
    labelOptions: initialLabelOptions,
  };

  const AppSettings = {
    appMode: 100,
    backgroundMode: 0,
    hideScrumptious: false,
    isInfoModalHidden: true,
    isToolbarHidden: false,
    isWobbleDisabled: false,
    name: '',
    isBookMarksVisible: false,
    panelToShow: 0,
    hasSeenArchive: false,
  };

  const defaultState = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  let store;

  describe('app actions', () => {
    beforeEach(() => {
      store = mockStore(defaultState);
    });

    it('updates name', () => {
      const name = 'Joe Shmo';
      const expectedActions = [{
        type: ScrumptiousConstants.USERNAME_SET,
        name,
      }];
      store.dispatch(Actions.updateName(name));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('sets app mode', () => {
      const appMode = 50;
      const expectedActions = [{
        type: ScrumptiousConstants.APP_MODE_SET,
        appMode,
      }];
      store.dispatch(Actions.setAppMode(appMode));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('sets backgroundmode mode', () => {
      const backgroundMode = 0;
      const expectedActions = [{
        type: ScrumptiousConstants.BACKGROUND_MODE_SET,
        backgroundMode,
        isCustomUpdate: false,
      }];
      store.dispatch(Actions.setBackgroundMode(backgroundMode));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('toggles card wobble', () => {
      const expectedActions = [{
        type: ScrumptiousConstants.WOBBLE_TOGGLE,
      }];
      store.dispatch(Actions.toggleWobble());
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('toggles info modal off', () => {
      const isInfoModalHidden = true;
      const expectedActions = [{
        type: ScrumptiousConstants.INFO_MODAL_TOGGLE,
        isInfoModalHidden,
        panelToShow: 0,
      }];
      store.dispatch(Actions.toggleInfoModal(isInfoModalHidden));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('toggles info modal on', () => {
      const isInfoModalHidden = false;
      const expectedActions = [{
        type: ScrumptiousConstants.INFO_MODAL_TOGGLE,
        isInfoModalHidden,
        panelToShow: 0,
      }];
      store.dispatch(Actions.toggleInfoModal(isInfoModalHidden));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('toggles bookmarks off', () => {
      const isBookMarksVisible = false;
      const expectedActions = [{
        type: ScrumptiousConstants.BOOKMARKS_TOGGLE,
        isBookMarksVisible,
      }];
      store.dispatch(Actions.toggleBookMarks(isBookMarksVisible));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('toggles bookmarks on', () => {
      const isBookMarksVisible = true;
      const expectedActions = [{
        type: ScrumptiousConstants.BOOKMARKS_TOGGLE,
        isBookMarksVisible,
      }];
      store.dispatch(Actions.toggleBookMarks(isBookMarksVisible));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });
  });
});
