import { expect } from 'chai';
import { initialLabelOptions } from '../../src/utils';
import ScrumptiousConstants from '../../src/components/ScrumptiousConstants';
import LabelReducer from '../../src/components/Reducers/LabelReducer';

describe('Label Reducer', () => {
  let defaultState;

  beforeEach(() => {
    defaultState = {
      labelOptions: initialLabelOptions,
    };
  });

  it('for setting selected label', () => {
    const columnId = 'inprogress';
    const existingId = '85ee8698-cc31-47b3-8fdd-c6e6d7c41868';
    const id = '95a9e853-4c13-46c4-8d6c-ceed565093c9';
    const label = 'low-priority';

    const action = {
      type: ScrumptiousConstants.LABEL_SELECTED_SET,
      columnId,
      id,
      label,
    };
    const updatedState = LabelReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      ...defaultState,
      labelOptions: {
        ...defaultState.labelOptions,
        [label]: {
          ...defaultState.labelOptions[label],
          tasks: {
            [existingId]: true,
            [id]: true,
          },
        },
      },
    });
  });

  it('for changing label text', () => {
    const key = 'high-priority';
    const text = 'New Label';

    const action = {
      type: ScrumptiousConstants.LABEL_TEXT_SET,
      key,
      text,
    };
    const updatedState = LabelReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      labelOptions: {
        ...defaultState.labelOptions,
        [key]: {
          ...defaultState.labelOptions[key],
          label: text,
        },
      },
    });
  });

  it('for deleting label', () => {
    const columnId = 'inprogress';
    const taskId = '95a9e853-4c13-46c4-8d6c-ceed565093c9';
    const key = 'high-priority';
    const action = {
      type: ScrumptiousConstants.LABEL_DELETE,
      columnId,
      taskId,
      key,
    };
    const updatedState = LabelReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      labelOptions: {
        'low-priority': defaultState.labelOptions['low-priority'],
        urgent: defaultState.labelOptions.urgent,
        'd3d6d347-8c7c-4d56-aa87-0e08929cbbb5': defaultState.labelOptions['d3d6d347-8c7c-4d56-aa87-0e08929cbbb5'],
      },
    });
  });

  it('for removing label from task', () => {
    const columnId = 'inprogress';
    const taskId = '95a9e853-4c13-46c4-8d6c-ceed565093c9';
    const key = 'high-priority';
    const action = {
      type: ScrumptiousConstants.LABEL_TASK_REMOVE,
      columnId,
      taskId,
      key,
    };
    const updatedState = LabelReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      labelOptions: {
        ...defaultState.labelOptions,
        'high-priority': {
          ...defaultState.labelOptions['high-priority'],
          tasks: {
            [taskId]: false,
          },
        },
      },
    });
  });

  it('sets label option color', () => {
    const key = 'low-priority';
    const color = '#ccc';
    const action = {
      type: ScrumptiousConstants.LABEL_SET_COLOR,
      key,
      color,
    };
    const updatedState = LabelReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      labelOptions: {
        ...defaultState.labelOptions,
        'low-priority': {
          ...defaultState.labelOptions['low-priority'],
          backgroundColor: '#ccc',
        },
      },
    });
  });

  it('add label option', () => {
    const action = {
      type: ScrumptiousConstants.LABEL_OPTION_ADD,
      taskId: '95a9e853-4c13-46c4-8d6c-ceed565093c9',
      id: 'new-label-id',
    };
    const newLabel = {
      label: '',
      backgroundColor: '#12A4FF',
      color: '#fff',
      tasks: {
        '95a9e853-4c13-46c4-8d6c-ceed565093c9': true,
      },
    };
    const updatedState = LabelReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      labelOptions: {
        ...defaultState.labelOptions,
        'new-label-id': newLabel,
      },
    });
  });
});
