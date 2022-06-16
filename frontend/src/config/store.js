import {createBrowserHistory} from 'history';
import {compose as _compose, createStore, applyMiddleware} from 'redux';
import {routerMiddleware} from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';
import createReducer from './reducers';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _compose;

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const store = createStore(
    createReducer(history),
    compose(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
  );
  sagaMiddleware.run(sagas);
  return store;
};

export default configureStore();
