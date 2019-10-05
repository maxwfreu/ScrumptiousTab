import { expect } from 'chai';
import { getToday, initialTasks, initialTaskMapping, initialLabelOptions } from '../../src/utils';
import ScrumptiousConstants from '../../src/components/ScrumptiousConstants';
import ColumnReducer from '../../src/components/Reducers/ColumnReducer';

const initialColumns = [
  { id: 'openissues', title: 'To Do', emptyState: 'todo' },
  { id: 'inprogress', title: 'Doing', emptyState: 'doing' },
  { id: 'done', title: 'Done', emptyState: 'done' },
];

describe('Reducers', () => {
  let defaultState;
  const category = 'openissues';
  const task = {
    name: '',
    category,
    id: '123',
    cardNumber: 1,
  };

  beforeEach(() => {
    defaultState = {
      columns: initialColumns,
    };
  });

  it('doesnt do anything', () => {
    expect(true).to.equal(true);
  });

  it('reorders columns', () => {
    const startIndex = 0;
    const endIndex = 1;

    const action = {
      type: ScrumptiousConstants.COLUMN_REORDER,
      startIndex,
      endIndex,
    };
    const updatedState = ColumnReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      columns: [
        initialColumns[1],
        initialColumns[0],
        initialColumns[2],
      ],
    });
  });

  it('adds columns', () => {
    const id = 'new-id';
    const action = {
      type: ScrumptiousConstants.COLUMN_ADD,
      index: 1,
      id,
    };
    const updatedState = ColumnReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      ...defaultState,
      columns: [
        defaultState.columns[0],
        updatedState.columns[1],
        defaultState.columns[1],
        defaultState.columns[2],
      ],
    });
  });

  const validateEmptyStateUpdate = (index1, index2) => {
    const id = 'new-id';
    const action = {
      type: ScrumptiousConstants.COLUMN_ADD,
      index: 1,
      id,
    };
    const defaultStateCopy = {
      columns: [
        defaultState.columns[index1],
        defaultState.columns[index2],
      ],
    };
    const updatedState = ColumnReducer(defaultStateCopy, action);
    expect(updatedState).to.deep.equal({
      columns: [
        defaultStateCopy.columns[0],
        updatedState.columns[1],
        defaultStateCopy.columns[1],
      ],
    });
  };

  describe('adds columns with old empty state', () => {
    it('first col', () => {
      validateEmptyStateUpdate(0, 1);
    });

    it('second col', () => {
      validateEmptyStateUpdate(1, 2);
    });

    it('third col', () => {
      validateEmptyStateUpdate(0, 2);
    });
  });


  it('removes columns', () => {
    const action = {
      type: ScrumptiousConstants.COLUMN_REMOVE,
      index: 0,
    };
    const updatedState = ColumnReducer(defaultState, action);
    expect(updatedState).to.deep.equal({
      columns: [
        initialColumns[1],
        initialColumns[2],
      ],
    });
  });

  it('for setting header text', () => {
    const id = 'openissues';
    const text = 'new header';

    const action = {
      type: ScrumptiousConstants.COLUMN_HEADER_UPDATE,
      id,
      text,
    };
    const defaultStateCopy = JSON.parse(JSON.stringify(defaultState));
    const updatedState = ColumnReducer(defaultState, action);
    const updatedCol = defaultStateCopy.columns[0];
    updatedCol.title = text;
    expect(updatedState).to.deep.equal({
      columns: [
        updatedCol,
        defaultStateCopy.columns[1],
        defaultStateCopy.columns[2],
      ],
    });
  });

  it('doesnt setting header text for invalid id', () => {
    const id = 'invalid';
    const text = 'new header';

    const action = {
      type: ScrumptiousConstants.COLUMN_HEADER_UPDATE,
      id,
      text,
    };
    const updatedState = ColumnReducer(defaultState, action);
    expect(updatedState).to.deep.equal(defaultState);
  });
});
