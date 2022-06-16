import {prop, isEmpty, isNil} from 'ramda';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {takeLatest, put, call, select} from 'redux-saga/effects';
import {get, post, update, del} from 'lib/fetch';
import {setError} from 'modules/network';
import {getId, getUserRole} from 'modules/user';
import {startLoading, stopLoading} from 'ui/LoadingOverlay';
import {push} from 'connected-react-router';

export const [PRODUCTS_FETCH, fetchProducts] = createAction('PRODUCTS_FETCH', 'filter');
export const [PRODUCTS_FETCH_BY_SHOP, fetchProductsByShop] = createAction(
  'PRODUCTS_FETCH_BY_SHOP',
  'id',
  'filter',
);
export const [PRODUCT_FETCH, fetchProduct] = createAction('PRODUCT_FETCH', 'id');
export const [PRODUCTS_SET, setProducts] = createAction('PRODUCTS_SET', 'items', 'total', 'totalPages');
export const [PRODUCTS_SET_ITEMS, setAllProducts] = createAction('PRODUCTS_SET_ITEMS', 'items');
export const [PRODUCTS_SET_ITEM, setOneProduct] = createAction('PRODUCTS_SET_ITEM', 'item');
export const [PRODUCTS_DELETE, deleteProduct] = createAction('PRODUCTS_DELETE', 'id');
export const [PRODUCTS_POST, postProduct] = createAction('PRODUCTS_POST', 'formData');
export const [PRODUCTS_PATCH, patchProduct] = createAction('PRODUCTS_PATCH', 'payload');
export const [PRODUCTS_PAGE_SET, setPage] = createAction('PRODUCTS_PAGE_SET', 'page');
export const [PRODUCTS_FILTER_SET, setFilter] = createAction('PRODUCTS_FILTER_SET', 'filter');

const initialState = {
  items: null,
  item: null,
  total: null,
  totalPages: null,
  page: 1,
  filter: null,
};

export const reducer = createReducer(initialState, {
  [PRODUCTS_SET]: (s, {items, total, totalPages}) => ({...s, items, total, totalPages}),
  [PRODUCTS_SET_ITEMS]: (s, {items}) => ({...s, items}),
  [PRODUCTS_SET_ITEM]: (s, {item}) => ({...s, item}),
  [PRODUCTS_PAGE_SET]: (s, {page}) => ({...s, page}),
  [PRODUCTS_FILTER_SET]: (s, {filter}) => ({...s, filter}),
});

const products = prop('products');
export const getItems = createSelector(products, prop('items'));
export const getItem = createSelector(products, prop('item'));
export const getTotal = createSelector(products, prop('total'));
export const getTotalPages = createSelector(products, prop('totalPages'));
export const getPage = createSelector(products, prop('page'));
export const getFilter = createSelector(products, prop('filter'));
export const getItemById = createSelector(
  getItem,
  getItems,
  (_, productId) => productId,
  (item, items, id) =>
    item && item.id === +id ? item : items && items[0] ? items.find(el => el.id === +id) : {},
);

function* fetchProductsSaga({filter = null}) {
  /*
    shop: 'null' -> only default products
    shop_id: {id} -> only shop products
    no param -> if admin, all products
    no param -> if shop, all default products of shop category + shop products
  */
  try {
    yield put(startLoading());

    const userRole = yield select(getUserRole);

    if (!filter) {
      filter = yield select(getFilter);
    }

    const page = yield select(getPage);
    let url = `products?page=${filter === 'all' ? 0 : page}`;

    if (filter === 'default' || userRole === 'admin') {
      url += '&shop=null';
    }
    if (filter === 'mine') {
      const shop_id = yield select(getId);
      url += `&shop=${shop_id}`;
    }
    if (typeof filter === 'number') {
      url += `&category=${filter}`;
    }

    const {data, total_items, items_per_page, error} = yield call(get, url);
    if (error) {
      yield put(setError(error));
      return;
    }
    yield put(stopLoading());

    if (filter === 'all') {
      yield put(setAllProducts(data));
      return;
    }

    const totalPages = Math.ceil(total_items / items_per_page);
    yield put(setProducts(data, total_items, totalPages));
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchProductsByShopSaga({id, filter = null}) {
  try {
    yield put(startLoading());

    let url = `shops/${id}/products?page=0`;

    if (filter) url += `&category=${filter}`;

    const {data, error} = yield call(get, url);

    if (error || isNil(data)) {
      yield put(setError(error));
      return;
    }
    yield put(setAllProducts(data));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchProductSaga({id}) {
  try {
    yield put(startLoading());
    const {data, error} = yield call(get, `products/${id}`);

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(setOneProduct(data));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

function* postProductsSaga({formData}) {
  try {
    yield put(startLoading());

    const {data, error} = yield call(post, 'products', JSON.stringify(formData));
    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(setOneProduct(data));
    yield put(stopLoading());
    yield put(push(`/products/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* patchProductsSaga({payload}) {
  const {values, productId} = payload;
  try {
    yield put(startLoading());

    const {data, error} = yield call(update, `products/${productId}`, JSON.stringify(values));

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(setOneProduct(data));
    yield put(stopLoading());
    yield put(push(`/products/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* deleteProductsSaga({id}) {
  try {
    yield put(startLoading());

    const {error} = yield call(del, `products/${id}`);
    if (error) {
      yield put(setError(error));
      return;
    }
    yield put(fetchProducts());
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

export function* saga() {
  yield takeLatest([PRODUCTS_FETCH, PRODUCTS_FILTER_SET, PRODUCTS_PAGE_SET], fetchProductsSaga);
  yield takeLatest([PRODUCTS_FETCH_BY_SHOP], fetchProductsByShopSaga);
  yield takeLatest(PRODUCT_FETCH, fetchProductSaga);
  yield takeLatest(PRODUCTS_POST, postProductsSaga);
  yield takeLatest(PRODUCTS_PATCH, patchProductsSaga);
  yield takeLatest(PRODUCTS_DELETE, deleteProductsSaga);
}
