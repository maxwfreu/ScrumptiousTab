import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { initGA, logPageView, logPageLoad } from '../utils';
import store from './store';
import Main from './Main';

class App extends Component {
  /*
    Initializes React-GA and sends page load analytics
  */
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
    const that = this;
    this.mountedAt = performance.now();
    window.addEventListener('load', () => {
      const now = performance.now();
      const loadTime = (now - that.mountedAt);
      logPageLoad(loadTime);
    });
  }

  /*
    Return main app component wrapped in provider
  */
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

export default App;
