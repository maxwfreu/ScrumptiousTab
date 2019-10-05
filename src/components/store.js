import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Reducers from './Reducers';

const store = createStore(Reducers, applyMiddleware(thunk));
window.store = store;
export default store;
