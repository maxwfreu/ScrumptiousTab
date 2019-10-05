import { expect } from 'chai';
import { initialLabelOptions, initialColumns } from '../../src/utils';
import ScrumBoardReducer from '../../src/components/Reducers';

const initialEmptyMapping = {
  archivedTasks: [],
  done: [],
  inprogress: [],
  openissues: [],
};

describe('ScrumBoardReducer', () => {
  let defaultState;

  const TaskReducer = {
    taskMapping: initialEmptyMapping,
    tasks: {},
    cardNumber: 1,
    editingId: null,
    isFetchingData: true,
    lastCardMoved: '',
    isSavingEnabled: false,
    refreshFlag: false,
  };

  const ColumnReducer = {
    columns: [],
    isSavingEnabled: false,
  };

  const LabelReducer = {
    labelOptions: {},
    isSavingEnabled: false,
  };

  const AppSettings = {
    appMode: 100,
    backgroundMode: 0,
    hideScrumptious: false,
    hasSeenArchive: false,
    panelToShow: 0,
    isBookMarksVisible: false,
    isInfoModalHidden: true,
    isWobbleDisabled: false,
    isWelcomeBannerHidden: false,
    isToolbarHidden: false,
    shouldUpdateToggle: false,
    name: '',
    isMilitaryTime: false,
    isSavingEnabled: false,
    shhMode: false,
  };

  beforeEach(() => {
    defaultState = {
      AppSettings,
      TaskReducer,
      ColumnReducer,
      LabelReducer,
    };
  });

  it('loads the default app settings', () => {
    const state = ScrumBoardReducer();
    expect(state.AppSettings).to.deep.equal(AppSettings);
  });

  it('loads the default labels', () => {
    const state = ScrumBoardReducer();
    expect(state.LabelReducer).to.deep.equal(LabelReducer);
  });

  it('loads the default columns', () => {
    const state = ScrumBoardReducer();
    expect(state.ColumnReducer).to.deep.equal(ColumnReducer);
  });

  it('loads the default task reducer', () => {
    const state = ScrumBoardReducer();
    expect(state.TaskReducer).to.deep.equal(TaskReducer);
  });

  it('loads the default state', () => {
    const state = ScrumBoardReducer();
    expect(state).to.deep.equal(defaultState);
  });

//   it('for adding task to archive', () => {
//     const columnId = 'openissues';
//     const id = '85ee8698-cc31-47b3-8fdd-c6e6d7c41868';
//     const archiveDate = getToday();

//     const action = {
//       type: ScrumptiousConstants.ARCHIVE_SET,
//       columnId,
//       id,
//       archiveDate,
//     };
//     const updatedState = ScrumBoardReducer(defaultState, action);
//     expect(updatedState).to.deep.equal({
//       ...defaultState,
//       RootReducer: {
//         ...RootReducer,
//         taskData: {
//           ...defaultState.RootReducer.taskData,
//           [columnId]: [
//             defaultState.RootReducer.taskData[columnId][1],
//           ],
//           archivedTasks: [
//             updatedState.RootReducer.taskData.archivedTasks[0],
//           ],
//         },
//       },
//     });
//   });

//   it('for adding task to archive when null', () => {
//     const columnId = 'openissues';
//     const id = '85ee8698-cc31-47b3-8fdd-c6e6d7c41868';
//     const archiveDate = getToday();

//     const action = {
//       type: ScrumptiousConstants.ARCHIVE_SET,
//       columnId,
//       id,
//       archiveDate,
//     };
//     const defaultStateCopy = {
//       ...defaultState,
//       RootReducer: {
//         ...RootReducer,
//         taskData: {
//           ...defaultState.RootReducer.taskData,
//           archivedTasks: null,
//         },
//       },
//     };
//     const updatedState = ScrumBoardReducer(defaultStateCopy, action);
//     expect(updatedState).to.deep.equal({
//       ...defaultStateCopy,
//       RootReducer: {
//         ...RootReducer,
//         taskData: {
//           ...defaultStateCopy.RootReducer.taskData,
//           [columnId]: [
//             defaultStateCopy.RootReducer.taskData[columnId][1],
//           ],
//           archivedTasks: [
//             updatedState.RootReducer.taskData.archivedTasks[0],
//           ],
//         },
//       },
//     });
//   });

//   it('opens archive', () => {
//     const action = {
//       type: ScrumptiousConstants.USERNAME_SET,
//       name: 'Bender',
//     };
//     const updatedState = ScrumBoardReducer(defaultState, action);
//     expect(updatedState).to.deep.equal({
//       ...defaultState,
//       AppSettings: {
//         ...AppSettings,
//         name: 'Bender',
//       },
//     });
//   });

//   it('clears archive', () => {
//     const action = {
//       type: ScrumptiousConstants.ARCHIVE_CLEAR,
//     };
//     defaultState.RootReducer.taskData.archivedTasks.push(task);
//     const updatedState = ScrumBoardReducer(defaultState, action);
//     expect(updatedState).to.deep.equal({
//       ...defaultState,
//       RootReducer: {
//         ...RootReducer,
//         taskData: {
//           ...defaultState.RootReducer.taskData,
//           archivedTasks: [],
//         },
//       },
//     });
//   });

//   it('sets app mode', () => {
//     const appMode = 50;
//     const action = {
//       type: ScrumptiousConstants.APP_MODE_SET,
//       appMode,
//     };
//     const updatedState = ScrumBoardReducer(defaultState, action);
//     expect(updatedState).to.deep.equal({
//       ...defaultState,
//       AppSettings: {
//         ...AppSettings,
//         appMode: 50,
//       }
//     });
//   });

//   it('returns default for invalud type', () => {
//     const action = {
//       type: 'nothing',
//     };
//     const updatedState = ScrumBoardReducer(defaultState, action);
//     expect(updatedState).to.deep.equal(updatedState);
//   });
});
