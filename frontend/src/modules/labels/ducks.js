import {prop, isEmpty, equals} from 'ramda';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {takeLatest, put, call, select} from 'redux-saga/effects';
import {get, post, update, del} from 'lib/fetch';
import {setError} from 'modules/network';
import {startLoading, stopLoading} from 'ui/LoadingOverlay';
import {push} from 'connected-react-router';

export const [LABELS_FETCH, fetchLabels] = createAction('LABELS_FETCH');
export const [LABELS_FETCH_ALL, fetchAllLabels] = createAction('LABELS_FETCH_ALL', 'categoryId');
export const [LABELS_FETCH_ALL_OF_PRODUCT, fetchAllLabelsProduct] = createAction(
  'LABELS_FETCH_ALL_OF_PRODUCT',
  'productId',
);
export const [CATEGORY_ID_SET, setCategoryId] = createAction('CATEGORY_ID_SET', 'categoryId');
export const [LABEL_FETCH, fetchLabel] = createAction('LABEL_FETCH', 'id');
export const [LABELS_SET, setlabels] = createAction('LABELS_SET', 'items', 'total', 'totalPages');
export const [LABELS_CREATE, createLabel] = createAction('LABELS_CREATE', 'item');
export const [LABELS_DELETE, deleteLabel] = createAction('LABELS_DELETE', 'id');
export const [LABELS_POST, postLabel] = createAction('LABELS_POST', 'formData');
export const [LABELS_PATCH, patchLabel] = createAction('LABELS_PATCH', 'payload');
export const [LABELS_PAGE_SET, setPage] = createAction('LABELS_PAGE_SET', 'page');

const initialState = {
  items: null,
  total: null,
  totalPages: null,
  page: 1,
  categoryId: null,
};

export const reducer = createReducer(initialState, {
  [LABELS_SET]: (s, {items, total, totalPages}) => ({...s, items, total, totalPages}),
  [LABELS_CREATE]: (s, {item}) => ({...s, items: [item]}),
  [LABELS_PAGE_SET]: (s, {page}) => ({...s, page}),
  [CATEGORY_ID_SET]: (s, {categoryId}) => ({...s, categoryId}),
});

const labels = prop('labels');
export const getLabels = createSelector(labels, prop('items'));
export const getTotal = createSelector(labels, prop('total'));
export const getTotalPages = createSelector(labels, prop('totalPages'));
export const getPage = createSelector(labels, prop('page'));
export const getCategoryId = createSelector(labels, prop('categoryId'));
export const getItemById = createSelector(
  getLabels,
  (_, props) => props.currentId,
  (items, id) => (items ? items.find(el => el.id === +id) : {}),
);

function* fetchLabelsSaga() {
  const page = yield select(getPage);
  const categoryId = yield select(getCategoryId);

  if (!categoryId) {
    yield console.log('categoryId needed to fetch Labels');
    return;
  }

  try {
    yield put(startLoading());
    const {data, total_items, items_per_page, error} = yield call(
      get,
      `categories/${categoryId}/labels?page=${page}`,
    );
    if (error) {
      yield put(setError(error));
      return;
    }

    const totalPages = Math.ceil(total_items / items_per_page);

    yield put(setlabels(data, total_items, totalPages));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchAllLabelsSaga({categoryId = false}) {
  if (!categoryId) {
    categoryId = yield select(getCategoryId);
  }
  const labels = yield select(getLabels);

  if (!categoryId) {
    if (!equals(labels, [])) {
      yield put(setlabels([]));
    }
    return;
  }

  try {
    yield put(startLoading());
    const {data, error} = yield call(get, `categories/${categoryId}/labels?page=0`);
    if (error) {
      yield put(setError(error));
      return;
    }

    yield put(stopLoading());

    if (equals(labels, data)) {
      return;
    }

    yield put(setlabels(data));
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchAllLabelsProductSaga({productId}) {
  try {
    yield put(startLoading());
    const {data, error} = yield call(get, `products/${productId}`);

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(stopLoading());

    if (data.category) {
      yield put(fetchAllLabels(data.category.id));
    }
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchLabelsaga({id}) {
  try {
    const categoryId = yield select(getCategoryId);
    yield put(startLoading());
    const {data, error} = yield call(get, `categories/${categoryId}/labels/${id}`);

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createLabel(data));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

function* postLabelsSaga({formData}) {
  try {
    yield put(startLoading());
    const categoryId = yield select(getCategoryId);

    const {data, error} = yield call(post, `categories/${categoryId}/labels`, JSON.stringify(formData));
    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createLabel(data));
    yield put(stopLoading());
    yield put(push(`/categories/${categoryId}/labels/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* patchLabelsSaga({payload}) {
  const {values, currentId} = payload;
  try {
    yield put(startLoading());
    const categoryId = yield select(getCategoryId);

    const {data, error} = yield call(
      update,
      `categories/${categoryId}/labels/${currentId}`,
      JSON.stringify(values),
    );

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createLabel(data));
    yield put(stopLoading());
    yield put(push(`/categories/${categoryId}/labels/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* deleteLabelsSaga({id}) {
  yield put(startLoading());
  const categoryId = yield select(getCategoryId);
  try {
    const {error} = yield call(del, `categories/${categoryId}/labels/${id}`);
    if (error) {
      yield put(setError(error));
      return;
    }
    yield put(fetchLabels(categoryId));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

export function* saga() {
  yield takeLatest([LABELS_PAGE_SET, LABELS_FETCH], fetchLabelsSaga);
  yield takeLatest(LABEL_FETCH, fetchLabelsaga);
  yield takeLatest(LABELS_POST, postLabelsSaga);
  yield takeLatest(LABELS_PATCH, patchLabelsSaga);
  yield takeLatest(LABELS_DELETE, deleteLabelsSaga);
  yield takeLatest(LABELS_FETCH_ALL, fetchAllLabelsSaga);
  yield takeLatest(LABELS_FETCH_ALL_OF_PRODUCT, fetchAllLabelsProductSaga);
}
