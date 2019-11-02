import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Main from './Main';

const App = () => (
  <Provider store={store}>
    <Main />
  </Provider>
);

export default App;
