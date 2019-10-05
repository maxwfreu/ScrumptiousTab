import localforage from 'localforage';
import ScrumptiousConstants from '../ScrumptiousConstants';
import {
  initialColumns,
  initialLabelOptions,
  initialTaskMapping,
  initialTasks,
  getBooleanFromLocalStorage,
  logException,
} from '../../utils';

const LZString = require('lz-string');

const dbName = 'scrumptious_task_data';

const store = localforage.createInstance({ name: dbName });

const decompress = str => JSON.parse(LZString.decompress(str));
const decompressFromUTF16 = str => JSON.parse(LZString.decompressFromUTF16(str));

let chromeUtil = null;
if (typeof chrome !== 'undefined' && chrome !== undefined && chrome && chrome !== null) {
  chromeUtil = chrome;
}

export const setChromeStorageData = obj => (
  new Promise((resolve, reject) => {
    try {
      if (!chromeUtil || !chromeUtil.storage) return;
      chromeUtil.storage.sync.set(obj, () => {
        resolve();
      });
    } catch (err) {
      reject(err);
      logException('Failed to set chrome storage data');
    }
  })
);

export const getChromeStorageData = obj => (
  new Promise((resolve, reject) => {
    try {
      if (!chromeUtil || !chromeUtil.storage) return;
      chromeUtil.storage.sync.get(obj, (result) => {
        resolve(result);
      });
    } catch (err) {
      reject(err);
      logException('Failed to fetch chrome storage data');
    }
  })
);

/*
  Fetches task data from localForage.
*/
export const fetchScrumptiousData = () => (
  async (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH,
    });

    // True if we are loading the application for the first time.
    // TODO: Update this to check if we actually have tasks
    let introDataInitialized = getBooleanFromLocalStorage('introDataInitialized');
    // We are no longer compressing data, but for those who have old extensions
    // we need to make sure we handle their compressed tasks correctly.
    let useUTF16Compression = getBooleanFromLocalStorage('useUTF16Compression');

    if (process.env.DEMO_BUILD) {
      introDataInitialized = false;
      useUTF16Compression = true;
    }

    try {
      let taskMapping = {};
      let tasks = {};
      let labelOptions = {};
      let columns = {};
      let cardNumber = 1;

      if (!introDataInitialized) {
        taskMapping = initialTaskMapping;
        tasks = initialTasks;
        labelOptions = initialLabelOptions;
        columns = initialColumns;
        await Promise.all([
          store.setItem('taskMapping', taskMapping),
          store.setItem('tasks', tasks),
          store.setItem('cardNumber', cardNumber),
          store.setItem('labelOptions', labelOptions),
          store.setItem('columns', columns),
        ]);
        window.localStorage.setItem('introDataInitialized', true);
        window.localStorage.setItem('useUTF16Compression', true);
      } else {
        [taskMapping, tasks, cardNumber, columns, labelOptions] = await Promise.all([
          store.getItem('taskMapping'),
          store.getItem('tasks'),
          store.getItem('cardNumber'),
          store.getItem('columns'),
          store.getItem('labelOptions'),
        ]);
      }
      // These variables will be strings if their data has been compressed.
      // If so, determine the compression type and decompress.
      if (typeof taskMapping === 'string') {
        if (!useUTF16Compression) {
          taskMapping = decompress(taskMapping);
        } else {
          taskMapping = decompressFromUTF16(taskMapping);
        }
      }
      if (typeof tasks === 'string') {
        if (!useUTF16Compression) {
          tasks = decompress(tasks);
        } else {
          tasks = decompressFromUTF16(tasks);
        }
      }
      if (typeof columns === 'string') {
        if (!useUTF16Compression) {
          columns = decompress(columns);
        } else {
          columns = decompressFromUTF16(columns);
        }
      }
      if (typeof labelOptions === 'string') {
        if (!useUTF16Compression) {
          labelOptions = decompress(labelOptions);
        } else {
          labelOptions = decompressFromUTF16(labelOptions);
        }
      }

      dispatch({
        type: ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_SUCCESS,
        taskMapping,
        tasks,
        cardNumber,
        labelOptions,
        columns,
      });
    } catch (err) {
      dispatch({
        type: ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_FAILURE,
      });
    }
  }
);

export const refreshTaskData = () => (
  async (dispatch) => {
    try {
      let taskMapping = {};
      let tasks = {};
      let cardNumber = 1;
      const useUTF16Compression = getBooleanFromLocalStorage('useUTF16Compression');

      [taskMapping, tasks, cardNumber] = await Promise.all([
        store.getItem('taskMapping'),
        store.getItem('tasks'),
        store.getItem('cardNumber'),
      ]);
      if (typeof taskMapping === 'string') {
        if (useUTF16Compression) {
          taskMapping = decompressFromUTF16(taskMapping);
        } else {
          taskMapping = decompress(taskMapping);
        }
      }
      if (typeof tasks === 'string') {
        if (useUTF16Compression) {
          tasks = decompressFromUTF16(tasks);
        } else {
          tasks = decompress(tasks);
        }
      }

      dispatch({
        type: ScrumptiousConstants.REFRESH_TASK_DATA,
        taskMapping,
        tasks,
        cardNumber,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_FAILURE,
      });
    }
  }
);

export const refreshAppData = () => (
  async (dispatch) => {
    dispatch({
      type: ScrumptiousConstants.REFRESH_APP_SETTINGS,
    });
  }
);

export const refreshColumnData = () => (
  async (dispatch) => {
    try {
      let columns = [];
      [columns] = await Promise.all([
        store.getItem('columns'),
      ]);
      if (typeof columns === 'string') {
        const useUTF16Compression = getBooleanFromLocalStorage('useUTF16Compression');
        if (useUTF16Compression) {
          columns = decompressFromUTF16(columns);
        } else {
          columns = decompress(columns);
        }
      }
      dispatch({
        type: ScrumptiousConstants.REFRESH_COLUMNS,
        columns,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_FAILURE,
      });
    }
  }
);

export const refreshLabelData = () => (
  async (dispatch) => {
    try {
      let labelOptions = [];
      [labelOptions] = await Promise.all([
        store.getItem('labelOptions'),
      ]);
      if (typeof labelOptions === 'string') {
        const useUTF16Compression = getBooleanFromLocalStorage('useUTF16Compression');
        if (useUTF16Compression) {
          labelOptions = decompressFromUTF16(labelOptions);
        } else {
          labelOptions = decompress(labelOptions);
        }
      }
      dispatch({
        type: ScrumptiousConstants.REFRESH_LABELS,
        labelOptions,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: ScrumptiousConstants.SCRUMPTIOUS_DATA_FETCH_FAILURE,
      });
    }
  }
);

/*
  Saves task data to localForage.
  Logs an exception in case of failure
*/
export const saveTaskData = (taskMapping, tasks, cardNumber) => {
  try {
    store.setItem('taskMapping', taskMapping);
    store.setItem('tasks', tasks);
    store.setItem('cardNumber', cardNumber);
  } catch (err) {
    logException(ScrumptiousConstants.TASK_DATA_SAVE_FAIL);
  }
};

export const saveColumnDataLocally = (columns, timestamp = null, saveToCache = false) => {
  try {
    store.setItem('columns', columns);
  } catch (err) {
    logException(ScrumptiousConstants.COLUMN_DATA_SAVE_FAIL);
  }
};

export const saveColumnData = (columns) => {
  try {
    saveColumnDataLocally(columns);
  } catch (err) {
    logException(ScrumptiousConstants.COLUMN_DATA_SAVE_FAIL);
  }
};

export const saveLabelOptionsLocally = (labelOptions, timestamp = null, saveToCache = false) => {
  try {
    store.setItem('labelOptions', labelOptions);
  } catch (err) {
    logException(ScrumptiousConstants.LABEL_DATA_SAVE_FAIL);
  }
};

export const saveLabelOptions = (labelOptions) => {
  try {
    saveLabelOptionsLocally(labelOptions);
  } catch (err) {
    logException(ScrumptiousConstants.LABEL_DATA_SAVE_FAIL);
  }
};
