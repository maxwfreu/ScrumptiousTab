import ReactGA from 'react-ga';

export const getBooleanFromLocalStorage = (boolId) => {
  const boolToParse = window.localStorage.getItem(boolId, false);
  if (!boolToParse || boolToParse === null || boolToParse === 'false' || boolToParse === 'undefined') {
    return false;
  }
  return true;
};

export const didChange = (arg1, arg2) => (
  JSON.stringify(arg1) !== JSON.stringify(arg2)
);

export const getToday = () => {
  const d = new Date(); // for now
  let dd = d.getDate();
  let mm = d.getMonth() + 1; // January is 0!
  const yyyy = d.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${mm}/${dd}/${yyyy}`;
};

export const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

export const isSameDate = (d1, d2) => (
  d1.getFullYear() === d2.getFullYear()
  && d1.getMonth() === d2.getMonth()
  && d1.getDate() === d2.getDate()
);

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const monthNamesAbr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const getArchiveDate = (d) => {
  const dd = d.getDate();
  const mm = d.getMonth();
  return `${monthNamesAbr[mm]} ${dd}`;
};

export const initialTasks = {
  '85ee8698-cc31-47b3-8fdd-c6e6d7c41868': {
    name: '',
    category: 'openissues',
    id: '85ee8698-cc31-47b3-8fdd-c6e6d7c41868',
    cardNumber: 1,
    richText: "{\"object\":\"value\",\"document\":{\"object\":\"document\",\"data\":{},\"nodes\":[{\"object\":\"block\",\"type\":\"heading-two\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"This is a task\",\"marks\":[{\"object\":\"mark\",\"type\":\"bold\",\"data\":{}}]}]}]},{\"object\":\"block\",\"type\":\"paragraph\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"Click this card to edit.\",\"marks\":[]}]}]},{\"object\":\"block\",\"type\":\"paragraph\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"\",\"marks\":[]}]}]},{\"object\":\"block\",\"type\":\"paragraph\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"Click \",\"marks\":[]},{\"object\":\"leaf\",\"text\":\"Add label \",\"marks\":[{\"object\":\"mark\",\"type\":\"bold\",\"data\":{}}]},{\"object\":\"leaf\",\"text\":\"to assign a label to a task.\",\"marks\":[]}]}]}]}}"
  },
  '95a9e853-4c13-46c4-8d6c-ceed565093c9': {
    name: '',
    category: 'inprogress',
    id: '95a9e853-4c13-46c4-8d6c-ceed565093c9',
    cardNumber: 2,
    richText: "{\"object\":\"value\",\"document\":{\"object\":\"document\",\"data\":{},\"nodes\":[{\"object\":\"block\",\"type\":\"heading-two\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"This task is in progress\",\"marks\":[]}]}]},{\"object\":\"block\",\"type\":\"paragraph\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"You can include checklists:\",\"marks\":[]}]}]},{\"object\":\"block\",\"type\":\"check-list\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"This hasn't been done yet!\",\"marks\":[]}]}]},{\"object\":\"block\",\"type\":\"check-list\",\"data\":{\"checked\":true},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"But this has\",\"marks\":[]}]}]},{\"object\":\"block\",\"type\":\"block-quote\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"Block quotes are a good way of displaying important information:\",\"marks\":[]}]}]}]}}"
  },
  'b277baf7-f384-4d67-bc29-badbb9abd931': {
    name: '',
    category: 'done',
    id: 'b277baf7-f384-4d67-bc29-badbb9abd931',
    cardNumber: 3,
    richText: "{\"object\":\"value\",\"document\":{\"object\":\"document\",\"data\":{},\"nodes\":[{\"object\":\"block\",\"type\":\"heading-two\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"This task has been completed\",\"marks\":[{\"object\":\"mark\",\"type\":\"bold\",\"data\":{}}]}]}]},{\"object\":\"block\",\"type\":\"paragraph\",\"data\":{},\"nodes\":[{\"object\":\"text\",\"leaves\":[{\"object\":\"leaf\",\"text\":\"Clicking the folder icon will archive this task.\",\"marks\":[]}]}]}]}}"
  },
};

export const initialTaskMapping = {
  archivedTasks: [],
  done: ['b277baf7-f384-4d67-bc29-badbb9abd931'],
  inprogress: ['95a9e853-4c13-46c4-8d6c-ceed565093c9'],
  openissues: ['85ee8698-cc31-47b3-8fdd-c6e6d7c41868'],
};

export const initialLabelOptions = {
  "low-priority": {
    "label": "Low Priority",
    "className": "low-priority",
    "backgroundColor": "#12A4FF",
    "color": "#fff",
    "tasks": {
      "85ee8698-cc31-47b3-8fdd-c6e6d7c41868": true
    }
  },
  "high-priority": {
    "label": "High Priority",
    "className": "high-priority",
    "backgroundColor": "#FDBA09",
    "color": "#fff",
    "tasks": {
      "95a9e853-4c13-46c4-8d6c-ceed565093c9": true
    }
  },
  "urgent": {
    "label": "Urgent",
    "className": "overdue",
    "backgroundColor": "#EC1A45",
    "color": "#fff",
    "tasks": {
      "b277baf7-f384-4d67-bc29-badbb9abd931": true
    }
  },
  "d3d6d347-8c7c-4d56-aa87-0e08929cbbb5": {
    "label": "Custom Label",
    "backgroundColor": "#71CA58",
    "color": "#fff",
    "tasks": {
      "b277baf7-f384-4d67-bc29-badbb9abd931": true
    }
  }
};

export const initialColumns = [
  { id: 'openissues', title: 'To Do', emptyState: 'todo' },
  { id: 'inprogress', title: 'Doing', emptyState: 'doing' },
  { id: 'done', title: 'Done', emptyState: 'done' },
];

export const initGA = () => {
  if (process.env.NODE_ENV === 'test') return;
  ReactGA.initialize('UA-129584763-1', {
    gaOptions: {
      cookieDomain: 'none',
    },
  });
  // enable ga
  if (ga) {
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');
  }
};

export const logPageView = () => {
  if (process.env.NODE_ENV === 'test') return;
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (category = '', action = '', value = null) => {
  if (process.env.NODE_ENV === 'test') return;
  if (category && action && value) {
    ReactGA.event({ category, action, value });
  } else if (category && action) {
    ReactGA.event({ category, action });
  }
};

export const logPageLoad = (value) => {
  ReactGA.timing({
    category: 'App',
    variable: 'load',
    value, // in milliseconds
  });
};

export const logException = (description = '', fatal = false) => {
  if (process.env.NODE_ENV === 'test') return;
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};

/*
  NOTE:
  This really should be broken out in a component or class.
*/
let count = 0;
let prevCount = -1;
let attempts = 0;
let chromeUtil = null;
if (typeof chrome !== 'undefined') {
  chromeUtil = chrome;
};

const processBookmark = (bookmarks) => {
  for (let i = 0; i < bookmarks.length; i += 1) {
    const bookmark = bookmarks[i];
    if (bookmark.id === '2') {
      return;
    }
    if (bookmark.url) {
      count += 1;
      window.localStorage.setItem(`scrumptious-bkm-title-${count}`, bookmark.title);
      window.localStorage.setItem(`scrumptious-bkm-url-${count}`, bookmark.url);
    }

    if (bookmark.children) {
      processBookmark(bookmark.children);
    }
  }
};

const saveBookMarks = () => {
  if (!chromeUtil.bookmarks) return;
  count = 0;
  chromeUtil.bookmarks.getTree(processBookmark);
  const interval = setInterval(() => {
    attempts += 1;
    if (attempts >= 10) {
      clearInterval(interval);
      return;
    }
    if (prevCount !== count) {
      prevCount = count;
    } else {
      window.localStorage.setItem('scrumptious-bkm-length', count);
      clearInterval(interval);
    }
  }, 150);
};

export const initalizeBookMarks = () => {
  if (chromeUtil.bookmarks) {
    saveBookMarks();
    chromeUtil.bookmarks.onCreated.addListener(saveBookMarks);
    chromeUtil.bookmarks.onRemoved.addListener(saveBookMarks);
    chromeUtil.bookmarks.onMoved.addListener(saveBookMarks);
    chromeUtil.bookmarks.onChanged.addListener(saveBookMarks);
  }
};
