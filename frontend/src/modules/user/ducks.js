import {prop, isEmpty, flatten, pick} from 'ramda';
import {takeLatest, put, call} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {get} from 'lib/fetch';
import {setError} from 'modules/network';
import {credentials} from 'config/api';

export const [USER_FETCH, fetchUser] = createAction('USER_FETCH', 'uuid', 'license');
export const [USER_SET, setUser] = createAction('USER_SET', 'data');
export const [USER_LOCALE, setLocale] = createAction('USER_LOCALE', 'locale');
export const [USER_AUTH, setAuth] = createAction('USER_AUTH');

const initialState = {
  license: null,
  id: null,
  uuid: null,
  name: null,
  logo: null,
  role: null,
  expiration_date: null,
  categoryIds: null,
  labels: null,
  available_designs: null,
  locale: credentials.get().locale || 'fr',
  pin: null,
  isAuth: false,
};

export const reducer = createReducer(initialState, {
  [USER_SET]: (s, {data}) => ({...s, ...data}),
  [USER_LOCALE]: (s, {locale}) => ({...s, locale}),
  [USER_AUTH]: s => ({...s, isAuth: true}),
});

const user = prop('user');
export const getId = createSelector(user, prop('id'));
export const getUUID = createSelector(user, prop('uuid'));
export const getLicense = createSelector(user, prop('license'));
export const getUserName = createSelector(user, prop('name'));
export const getUserRole = createSelector(user, prop('role'));
export const getCategories = createSelector(user, prop('categoryIds'));
export const getLabels = createSelector(user, prop('labels'));
export const getDesigns = createSelector(user, prop('available_designs'));
export const getExpirationDate = createSelector(user, prop('expiration_date'));
export const getLocale = createSelector(user, prop('locale'));
export const getIsAuth = createSelector(user, prop('isAuth'));
export const getPin = createSelector(user, prop('pin'));

function* fetchUserSaga({uuid, license}) {
  if (!license || !uuid) return; // should not happen

  // set this before as they are used in fetch api
  credentials.set({uuid, license});

  const {data, error} = yield call(get, 'shops/current');

  if (error || isEmpty(data.data)) {
    yield put(setError(error));
    return;
  }

  const {id, name, logo, root, expiration_date, categories, available_designs, pin} = data[0];
  const categoryIds = categories ? categories.map(pick(['id', 'name'])) : null;
  const labels = categories ? flatten(categories.map(prop('labels'))) : null;
  const role = root ? 'admin' : 'client';
  credentials.set({role});
  yield put(
    setUser({
      id,
      name,
      logo,
      role,
      uuid,
      license,
      expiration_date,
      categoryIds,
      labels,
      available_designs,
      pin,
    }),
  );
}

function* setLocaleLsSaga(value) {
  yield credentials.set(value);
}

export function* saga() {
  yield takeLatest(USER_FETCH, fetchUserSaga);
  yield takeLatest(USER_LOCALE, setLocaleLsSaga);
}
