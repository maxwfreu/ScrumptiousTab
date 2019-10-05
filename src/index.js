import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import { getBooleanFromLocalStorage } from './utils';

const hideScrumptious = getBooleanFromLocalStorage('hideScrumptious');
const rootEl = document.getElementById('app');

if (!window.location.hash && hideScrumptious && chrome && chrome.tabs) {
  chrome.tabs.update({
    url: 'chrome-search://local-ntp/local-ntp.html',
  });
} else {
  render(<App />, rootEl);
}
