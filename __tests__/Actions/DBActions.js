import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as DBActions from '../../src/components/Actions/DBActions';
import {
  initialColumns,
  initialLabelOptions,
  initialTasks,
  initialTaskMapping,
} from '../../src/utils';
import ScrumptiousConstants from '../../src/components/ScrumptiousConstants';

const mockStore = configureMockStore([thunk]);

describe('<DBActions />', () => {
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

  beforeEach(() => {
    store = mockStore(defaultState);
  });

  it('successfully fetches data', async () => {
    const expectedActions = [
      {
        type: ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH,
      },
      {
        type: ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_SUCCESS,
        taskMapping: initialTaskMapping,
        tasks: initialTasks,
        cardNumber: 1,
        columns: initialColumns,
        labelOptions: initialLabelOptions,
      },
    ];
    await store.dispatch(DBActions.fetchScrumptiousData());
    expect(store.getActions()).to.deep.equal(expectedActions);
  });

  // it('successfully saves data', async () => {
  //   const expectedActions = [
  //     {
  //       type: ScrumptiousConstants.TASK_DATA_SAVE_SUCCESS,
  //     },
  //   ];
  //   await store.dispatch(DBActions.saveTaskData(initialTaskMapping, initialTasks));
  //   expect(store.getActions()).to.deep.equal(expectedActions);
  // });
});
