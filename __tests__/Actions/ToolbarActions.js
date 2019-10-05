import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ToolbarActions from '../../src/components/Actions/ToolbarActions';
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

describe('<ToolbarActions />', () => {
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
    isInfoModalHidden: true,
    isToolbarHidden: false,
    isWobbleDisabled: false,
    name: '',
    isBookMarksVisible: false,
  };

  const defaultState = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  let store;

  describe('toolbar actions', () => {
    beforeEach(() => {
      store = mockStore(defaultState);
    });

    it('hides toolbar', () => {
      const expectedActions = [{
        type: ScrumptiousConstants.TOOLBAR_HIDE,
      }];
      store.dispatch(ToolbarActions.hideToolbar());
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('shows toolbar', () => {
      const expectedActions = [{
        type: ScrumptiousConstants.TOOLBAR_SHOW,
      }];
      store.dispatch(ToolbarActions.showToolbar());
      expect(store.getActions()).to.deep.equal(expectedActions);
    });
  });
});
