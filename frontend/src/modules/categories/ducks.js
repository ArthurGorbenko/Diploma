import {prop, isEmpty} from 'ramda';
import {takeLatest, put, call, select} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {setError} from 'modules/network';
import {startLoading, stopLoading} from 'ui/LoadingOverlay';
import {get, post, del, update} from 'lib/fetch';
import {push} from 'connected-react-router';

export const [CATEGORIES_FETCH, fetchCategories] = createAction('CATEGORIES_FETCH');
export const [CATEGORIES_FETCH_ALL, fetchAllCategories] = createAction('CATEGORIES_FETCH_ALL');
export const [CATEGORY_FETCH, fetchCategory] = createAction('CATEGORY_FETCH', 'id');
export const [CATEGORIES_SET, setCategories] = createAction(
  'CATEGORIES_SET',
  'items',
  'total',
  'totalPages',
);
export const [CATEGORIES_SET_ITEMS, addAllCategories] = createAction('CATEGORIES_SET_ITEMS', 'items');
export const [CATEGORIES_CREATE, createCategory] = createAction('CATEGORIES_CREATE', 'item');
export const [CATEGORIES_POST, postCategory] = createAction('CATEGORIES_POST', 'name');
export const [CATEGORIES_PATCH, patchCategory] = createAction('CATEGORIES_PATCH', 'payload');
export const [CATEGORIES_DELETE, deleteCategory] = createAction('CATEGORIES_DELETE', 'id');
export const [CATEGORIES_PAGE_SET, setPage] = createAction('CATEGORIES_PAGE_SET', 'page');

const initialState = {
  items: null,
  page: 1,
  totalPages: null,
  total: null,
};

export const reducer = createReducer(initialState, {
  [CATEGORIES_SET]: (s, {items, total, totalPages}) => ({...s, items, total, totalPages}),
  [CATEGORIES_SET_ITEMS]: (s, {items}) => ({...s, items}),
  [CATEGORIES_CREATE]: (s, {item}) => ({...s, items: [item]}),
  [CATEGORIES_PAGE_SET]: (s, {page}) => ({...s, page}),
});

const categories = prop('categories');
export const getCategories = createSelector(categories, prop('items'));
export const getPage = createSelector(categories, prop('page'));
export const getTotalPages = createSelector(categories, prop('totalPages'));
export const getTotalCategories = createSelector(categories, prop('total'));
export const getAlertStatus = createSelector(categories, prop('alert'));
export const getItemById = createSelector(
  getCategories,
  (_, categoryId) => categoryId,
  (items, id) => (items ? items.find(el => el.id === +id) : {}),
);

function* fetchCategoriesSaga() {
  try {
    yield put(startLoading());
    const page = yield select(getPage);
    const {data, total_items, items_per_page, error} = yield call(get, `categories?page=${page}`);

    if (error) {
      yield put(setError(error));
      return;
    }

    const totalPages = Math.ceil(total_items / items_per_page);
    yield put(stopLoading());
    yield put(setCategories(data, total_items, totalPages));
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchAllCategoriesSaga() {
  try {
    yield put(startLoading());
    const {data, error} = yield call(get, 'categories?page=0');

    if (error) {
      yield put(setError(error));
      return;
    }
    yield put(stopLoading());
    yield put(addAllCategories(data));
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchCategorySaga({id}) {
  try {
    yield put(startLoading());
    const {data, error} = yield call(get, `categories/${id}`);

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(stopLoading());
    yield put(createCategory(data));
  } catch (e) {
    yield put(setError(e));
  }
}

function* postCategorySaga({name}) {
  try {
    yield put(startLoading());

    const {data, error} = yield call(post, 'categories', JSON.stringify(name));
    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createCategory(data));
    yield put(stopLoading());
    yield put(push(`/categories/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* patchCategorySaga({payload}) {
  const {values, categoryId} = payload;
  try {
    yield put(startLoading());

    const {data, error} = yield call(update, `categories/${categoryId}`, JSON.stringify(values));

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createCategory(data));
    yield put(stopLoading());
    yield put(push(`/categories/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* deleteCategorySaga({id}) {
  try {
    yield put(startLoading());

    const {error} = yield call(del, `categories/${id}`);

    if (error) {
      yield put(setError(error));
      return;
    }
    yield put(stopLoading());
    yield put(fetchCategories());
  } catch (e) {
    yield put(setError(e));
  }
}

export function* saga() {
  yield takeLatest([CATEGORIES_FETCH, CATEGORIES_PAGE_SET], fetchCategoriesSaga);
  yield takeLatest(CATEGORY_FETCH, fetchCategorySaga);
  yield takeLatest(CATEGORIES_FETCH_ALL, fetchAllCategoriesSaga);
  yield takeLatest(CATEGORIES_DELETE, deleteCategorySaga);
  yield takeLatest(CATEGORIES_POST, postCategorySaga);
  yield takeLatest(CATEGORIES_PATCH, patchCategorySaga);
}
