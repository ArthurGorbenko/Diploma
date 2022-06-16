import {prop, isEmpty} from 'ramda';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {takeLatest, put, call, select} from 'redux-saga/effects';
import {get, post, update, del} from 'lib/fetch';
import {setError} from 'modules/network';
import {startLoading, stopLoading} from 'ui/LoadingOverlay';
import {push} from 'connected-react-router';

export const [SLIDESHOWS_FETCH, fetchSlideshows] = createAction('SLIDESHOWS_FETCH', 'filter');
export const [SLIDESHOWS_FETCH_ALL, fetchAllSlideshows] = createAction('SLIDESHOWS_FETCH_ALL');
export const [SLIDESHOW_FETCH, fetchSlideshow] = createAction('SLIDESHOW_FETCH', 'id');
export const [SLIDESHOWS_SET, setSlideshows] = createAction(
  'SLIDESHOWS_SET',
  'items',
  'total',
  'totalPages',
);
export const [SLIDESHOWS_SET_TABS, setTabs] = createAction('SLIDESHOWS_SET_TABS', 'tabs');
export const [SLIDESHOWS_CREATE, createSlideshow] = createAction('SLIDESHOWS_CREATE', 'item');
export const [SLIDESHOWS_DELETE, deleteSlideshow] = createAction('SLIDESHOWS_DELETE', 'id');
export const [SLIDESHOWS_POST, postSlideshow] = createAction('SLIDESHOWS_POST', 'formData');
export const [SLIDESHOWS_PATCH, patchSlideshow] = createAction('SLIDESHOWS_PATCH', 'payload');
export const [SLIDESHOWS_PAGE_SET, setPage] = createAction('SLIDESHOWS_PAGE_SET', 'page');
export const [SLIDESHOWS_FILTER_SET, setFilter] = createAction('SLIDESHOWS_FILTER_SET', 'filter');

const initialState = {
  items: null,
  total: null,
  totalPages: null,
  page: 1,
  tabs: null,
  filter: {},
};

export const reducer = createReducer(initialState, {
  [SLIDESHOWS_SET]: (s, {items, total, totalPages}) => ({...s, items, total, totalPages}),
  [SLIDESHOWS_SET_TABS]: (s, {tabs}) => ({...s, tabs}),
  [SLIDESHOWS_CREATE]: (s, {item}) => ({...s, items: [item]}),
  [SLIDESHOWS_PAGE_SET]: (s, {page}) => ({...s, page}),
  [SLIDESHOWS_FILTER_SET]: (s, {filter}) => ({...s, filter: {...s.filter, ...filter}}),
  [SLIDESHOWS_FETCH]: (s, {filter}) => (!isEmpty(filter) ? {...s, filter: {...s.filter, ...filter}} : s),
});

const slideshows = prop('slideshow');
export const getSlideshows = createSelector(slideshows, prop('items'));
export const getTabs = createSelector(slideshows, prop('tabs'));
export const getFilter = createSelector(slideshows, prop('filter'));
export const getTotal = createSelector(slideshows, prop('total'));
export const getTotalPages = createSelector(slideshows, prop('totalPages'));
export const getPage = createSelector(slideshows, prop('page'));
export const getItemById = createSelector(
  getSlideshows,
  (_, {slideshowId}) => slideshowId,
  (items, id) => (items ? items.find(el => el.id === +id) : {}),
);

function* fetchSlideshowsSaga({filter = {}}) {
  try {
    yield put(startLoading());

    const page = yield select(getPage);

    if (isEmpty(filter)) {
      filter = yield select(getFilter);
    }
    let url = `slideshows?page=${page}`;

    if (filter.shopId) {
      url += `&shop=${filter.shopId}`;
    }
    const {data, total_items, items_per_page, error} = yield call(get, url);
    if (error) {
      yield put(setError(error));
      return;
    }

    const totalPages = Math.ceil(total_items / items_per_page);
    yield put(stopLoading());
    yield put(setSlideshows(data, total_items, totalPages));
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchAllSlideshowsSaga() {
  yield put(startLoading());

  try {
    const {data, error} = yield call(get, 'slideshows?page=0');
    if (error) {
      yield put(setError(error));
      return;
    }
    const tabs = data.map(el => ({name: el.name, id: el.id}));
    yield put(stopLoading());
    yield put(setTabs(tabs));
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchSlideshowSaga({id}) {
  try {
    yield put(startLoading());
    const {data, error} = yield call(get, `slideshows/${id}`);

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createSlideshow(data));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

function* postSlideshowsSaga({formData}) {
  try {
    yield put(startLoading());

    const {data, error} = yield call(post, 'slideshows', JSON.stringify(formData));
    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createSlideshow(data));
    yield put(stopLoading());
    yield put(push(`/slideshow/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* patchSlideshowsSaga({payload}) {
  const {values, slideshowId} = payload;
  try {
    yield put(startLoading());

    const {data, error} = yield call(update, `slideshows/${slideshowId}`, JSON.stringify(values));

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createSlideshow(data));
    yield put(stopLoading());
    yield put(push(`/slideshow/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* deleteSlideshowsSaga({id}) {
  try {
    yield put(startLoading());

    const {error} = yield call(del, `slideshows/${id}`);
    if (error) {
      yield put(setError(error));
      return;
    }
    yield put(fetchSlideshows());
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

export function* saga() {
  yield takeLatest([SLIDESHOWS_PAGE_SET, SLIDESHOWS_FETCH, SLIDESHOWS_FILTER_SET], fetchSlideshowsSaga);
  yield takeLatest(SLIDESHOWS_FETCH_ALL, fetchAllSlideshowsSaga);
  yield takeLatest(SLIDESHOW_FETCH, fetchSlideshowSaga);
  yield takeLatest(SLIDESHOWS_POST, postSlideshowsSaga);
  yield takeLatest(SLIDESHOWS_PATCH, patchSlideshowsSaga);
  yield takeLatest(SLIDESHOWS_DELETE, deleteSlideshowsSaga);
}
