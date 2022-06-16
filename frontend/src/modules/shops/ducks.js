import {prop, isEmpty} from 'ramda';
import {takeLatest, put, call, select} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {get, del, post, update} from 'lib/fetch';
import {setError} from 'modules/network';
import {startLoading, stopLoading} from 'ui/LoadingOverlay';
import {push} from 'connected-react-router';
import {credentials} from 'config/api';

export const [SHOPS_FETCH, fetchShops] = createAction('SHOPS_FETCH');
export const [SHOP_FETCH, fetchShop] = createAction('SHOP_FETCH', 'id');
export const [SHOPS_FETCH_ALL, fetchAllShops] = createAction('SHOPS_FETCH_ALL');
export const [SHOPS_SET_ITEMS, addAllShops] = createAction('SHOPS_SET_ITEMS', 'items');
export const [SHOPS_SET, setShops] = createAction('SHOPS_SET', 'items', 'total', 'totalPages');
export const [SHOPS_PAGE_SET, setPage] = createAction('SHOPS_PAGE_SET', 'page');
export const [SHOPS_DELETE, deleteShop] = createAction('SHOPS_DELETE', 'id');
export const [SHOPS_CREATE, createShop] = createAction('SHOPS_CREATE', 'item');
export const [SHOPS_POST, postShop] = createAction('SHOPS_POST', 'formData');
export const [SHOPS_PATCH, patchShop] = createAction('SHOPS_PATCH', 'payload');

const initialState = {
  items: null,
  page: 1,
  totalPages: null,
  total: null,
};

export const reducer = createReducer(initialState, {
  [SHOPS_SET]: (s, {items, total, totalPages}) => ({...s, items, total, totalPages}),
  [SHOPS_SET_ITEMS]: (s, {items}) => ({...s, items}),
  [SHOPS_PAGE_SET]: (s, {page}) => ({...s, page}),
  [SHOPS_CREATE]: (s, {item}) => ({...s, items: [item]}),
});

const shops = prop('shops');
export const getShops = createSelector(shops, prop('items'));
export const getPage = createSelector(shops, prop('page'));
export const getTotalPages = createSelector(shops, prop('totalPages'));
export const getTotalShops = createSelector(shops, prop('total'));
export const getClientShops = createSelector(getShops, shops => shops.filter(el => !el.root));
export const getItemById = createSelector(
  getShops,
  (_, shopId) => shopId,
  (items, id) => (items ? items.find(el => el.id === +id) : {}),
);
export const getShopCategories = createSelector(
  getShops,
  (_, {currentShop}) => currentShop,
  (items, id) => {
    if (!id) return [];
    return items.filter(el => el.id === id)[0].categories;
  },
);
export const getShopDesigns = createSelector(
  getShops,
  (_, {currentShop}) => currentShop,
  (items, id) => {
    if (!id) return [];
    return items.filter(el => el.id === id)[0].designs;
  },
);

function* fetchShopsSaga() {
  try {
    yield put(startLoading());
    const page = yield select(getPage);
    const {data, total_items, items_per_page, error} = yield call(get, `shops?page=${page}`);
    if (error) {
      yield put(setError(error));
      return;
    }
    const totalPages = Math.ceil(total_items / items_per_page);
    yield put(setShops(data, total_items, totalPages));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchShopSaga({id}) {
  try {
    yield put(startLoading());

    let url = `shops/${id}`;
    if (credentials.get().role === 'client') {
      url = 'shops/current';
    }

    const {data, error} = yield call(get, url);

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createShop(data));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchAllShopsSaga() {
  try {
    yield put(startLoading());
    const {data, error} = yield call(get, 'shops?page=0');

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(stopLoading());
    yield put(addAllShops(data));
  } catch (e) {
    yield put(setError(e));
  }
}

function* postShopsSaga({formData}) {
  try {
    yield put(startLoading());
    formData.expiration_date = '01/01/2052';
    formData.subscription_date = '2022/06/12';
    const {data, error} = yield call(post, 'shops', JSON.stringify(formData));
    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createShop(data));
    yield put(stopLoading());
    yield put(push(`/shops/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* patchShopsSaga({payload}) {
  const {values, shopId} = payload;
  try {
    yield put(startLoading());

    const {data, error} = yield call(update, `shops/${shopId}`, JSON.stringify(values));

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createShop(data));
    yield put(stopLoading());
    yield put(push(`/shops/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* deleteShopSaga({id}) {
  try {
    yield put(startLoading());
    const {error} = yield call(del, `shops/${id}`);
    if (error) {
      yield put(setError(error));
      return;
    }
    yield put(fetchShops());
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

export function* saga() {
  yield takeLatest([SHOPS_FETCH, SHOPS_PAGE_SET], fetchShopsSaga);
  yield takeLatest(SHOPS_FETCH_ALL, fetchAllShopsSaga);
  yield takeLatest(SHOPS_POST, postShopsSaga);
  yield takeLatest(SHOPS_PATCH, patchShopsSaga);
  yield takeLatest(SHOPS_DELETE, deleteShopSaga);
  yield takeLatest(SHOP_FETCH, fetchShopSaga);
}
