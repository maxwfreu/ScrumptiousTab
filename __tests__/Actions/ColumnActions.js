import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ColumnActions from '../../src/components/Actions/ColumnActions';
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

describe('<ColumnActions />', () => {
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

  describe('column actions', () => {
    beforeEach(() => {
      store = mockStore(defaultState);
    });

    it('for reordering columns', () => {
      const startIndex = 0;
      const endIndex = 1;

      const expectedActions = [{
        type: ScrumptiousConstants.COLUMN_REORDER,
        startIndex,
        endIndex,
      }];
      store.dispatch(ColumnActions.reorderColumn(startIndex, endIndex));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for setting header', () => {
      const id = '123';
      const text = 'new header';

      const expectedActions = [{
        type: ScrumptiousConstants.COLUMN_HEADER_UPDATE,
        id,
        text,
      }];
      store.dispatch(ColumnActions.updateColumnHeader(id, text));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for clearing header', () => {
      const id = '123';

      const expectedActions = [{
        type: ScrumptiousConstants.COLUMN_CLEAR,
        id,
      }];
      store.dispatch(ColumnActions.clearColumn(id));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for adding column', () => {
      const index = 3;
      store.dispatch(ColumnActions.addColumn(index));
      const actions = store.getActions();
      expect(actions).to.have.length(1);
      expect(actions[0].type).to.equal(ScrumptiousConstants.COLUMN_ADD);
      expect(actions[0].index).to.equal(index);
      expect(actions[0].id).to.not.equal(null);
    });

    it('for removing column', () => {
      const index = 1;
      const category = 'openissues';

      const expectedActions = [{
        type: ScrumptiousConstants.COLUMN_REMOVE,
        index,
        category,
      }];
      store.dispatch(ColumnActions.removeColumn(index, category));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for archiving column', () => {
      const expectedActions = [{
        type: ScrumptiousConstants.COLUMN_ARCHIVE,
      }];
      store.dispatch(ColumnActions.archiveColumn());
      expect(store.getActions()).to.deep.equal(expectedActions);
    });
  });
});
