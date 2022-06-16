import {prop, isEmpty} from 'ramda';
import {takeLatest, put, call, select} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {setError} from 'modules/network';
import {startLoading, stopLoading} from 'ui/LoadingOverlay';
import {get, update} from 'lib/fetch';

export const [DESIGNS_FETCH, fetchDesigns] = createAction('DESIGNS_FETCH', 'all');
export const [DESIGNS_FETCH_ALL, fetchAllDesigns] = createAction('DESIGNS_FETCH_ALL');
export const [DESIGNS_SET, setDesigns] = createAction('DESIGNS_SET', 'items', 'total', 'totalPages');
export const [DESIGNS_SET_ITEMS, addAlldesigns] = createAction('DESIGNS_SET_ITEMS', 'items');
export const [DESIGNS_PATCH, patchDesign] = createAction('DESIGNS_PATCH', 'payload');
export const [DESIGNS_PAGE_SET, setPage] = createAction('DESIGNS_PAGE_SET', 'page');

const initialState = {
  items: null,
  page: 1,
  totalPages: null,
  total: null,
};

export const reducer = createReducer(initialState, {
  [DESIGNS_SET]: (s, {items, total, totalPages}) => ({...s, items, total, totalPages}),
  [DESIGNS_SET_ITEMS]: (s, {items}) => ({...s, items}),
  [DESIGNS_PAGE_SET]: (s, {page}) => ({...s, page}),
});

const designs = prop('designs');
export const getDesigns = createSelector(designs, prop('items'));
export const getPage = createSelector(designs, prop('page'));
export const getTotalPages = createSelector(designs, prop('totalPages'));
export const getTotalDesigns = createSelector(designs, prop('total'));

function* fetchDesignsSaga({all}) {
  try {
    yield put(startLoading());
    let page = yield select(getPage);
    if (all) page = 0;
    const {data, total_items, items_per_page, error} = yield call(get, `designs?page=${page}`);

    if (error) {
      yield put(setError(error));
      return;
    }
    yield put(stopLoading());

    if (all) {
      yield put(addAlldesigns(data));
      return;
    }

    const totalPages = Math.ceil(total_items / items_per_page);
    yield put(setDesigns(data, total_items, totalPages));
  } catch (e) {
    yield put(setError(e));
  }
}

function* patchDesingSaga({payload}) {
  const {values, id} = payload;
  try {
    yield put(startLoading());

    const {data, error} = yield call(update, `designs/${id}`, JSON.stringify(values));

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }

    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

export function* saga() {
  yield takeLatest([DESIGNS_FETCH, DESIGNS_PAGE_SET], fetchDesignsSaga);
  yield takeLatest(DESIGNS_PATCH, patchDesingSaga);
}
