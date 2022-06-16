import {prop} from 'ramda';
import {takeLatest, put} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {credentials} from 'config/api';
import {clearLoading} from 'ui/LoadingOverlay';
import {toggleAlert} from 'ui/Alert/ducks';

export const [NETWORK_ERROR, setError] = createAction('NETWORK_ERROR', 'error');

export const reducer = createReducer(
  {
    error: null,
  },
  {
    [NETWORK_ERROR]: (s, {error}) => ({...s, error}),
  },
);

const network = prop('network');
export const getError = createSelector(network, prop('error'));

function* errorSaga({error}) {
  console.log('Error:', error);
  yield put(clearLoading());

  // todo : handle error "not found" (view / edit pages for example)
  if (error === 'not found') {
    yield put(push('/notFound'));
  } else if (
    error === 'invalid license' ||
    error === 'disabled license' ||
    error === 'expired license'
  ) {
    credentials.delete();
    yield put(push('/support'));
  } else if (error === 'constraint violation') {
    yield put(toggleAlert(true));
  }
}

export function* saga() {
  yield takeLatest(NETWORK_ERROR, errorSaga);
}
