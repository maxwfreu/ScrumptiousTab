import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as LabelActions from '../../src/components/Actions/LabelActions';
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

describe('<LabelActions />', () => {
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

  describe('label actions', () => {
    beforeEach(() => {
      store = mockStore(defaultState);
    });

    it('for setting selected label', () => {
      const columnId = 'columnId';
      const id = 'labelId';
      const label = 'My Label';
      const expectedActions = [{
        type: ScrumptiousConstants.LABEL_SELECTED_SET,
        columnId,
        id,
        label,
      }];
      store.dispatch(LabelActions.setLabels(columnId, id, label));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for changing label text', () => {
      const key = 'columnId';
      const text = 'New Label';

      const expectedActions = [{
        type: ScrumptiousConstants.LABEL_TEXT_SET,
        key,
        text,
      }];
      store.dispatch(LabelActions.changeLabelText(key, text));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for removing label from task', () => {
      const columnId = 'columnId';
      const taskId = 'taskId';
      const key = 'columnId';
      const expectedActions = [{
        type: ScrumptiousConstants.LABEL_TASK_REMOVE,
        columnId,
        taskId,
        key,
      }];
      store.dispatch(LabelActions.removeLabelFromTask(columnId, taskId, key));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for removing label from task', () => {
      const key = 'columnId';
      const color = '#ccc';
      const expectedActions = [{
        type: ScrumptiousConstants.LABEL_SET_COLOR,
        key,
        color,
      }];
      store.dispatch(LabelActions.setLabelColor(key, color));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });

    it('for adding column', () => {
      const columnId = 'columnId';
      const taskId = 'taskId';
      store.dispatch(LabelActions.addLabel(columnId, taskId));

      const actions = store.getActions();
      expect(actions).to.have.length(1);
      expect(actions[0].type).to.equal(ScrumptiousConstants.LABEL_OPTION_ADD);
      expect(actions[0].columnId).to.equal(columnId);
      expect(actions[0].taskId).to.equal(taskId);
      expect(actions[0].id).to.not.equal(null);
    });

    it('for deleting label from task', () => {
      const columnId = 'columnId';
      const taskId = 'taskId';
      const key = 'columnId';
      const expectedActions = [{
        type: ScrumptiousConstants.LABEL_DELETE,
        columnId,
        taskId,
        key,
      }];
      store.dispatch(LabelActions.deleteLabel(columnId, taskId, key));
      expect(store.getActions()).to.deep.equal(expectedActions);
    });
  });
});
