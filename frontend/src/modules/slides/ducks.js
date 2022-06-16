import {prop, isEmpty} from 'ramda';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {takeLatest, put, call, select} from 'redux-saga/effects';
import {get, post, update, del} from 'lib/fetch';
import {setError} from 'modules/network';
import {startLoading, stopLoading} from 'ui/LoadingOverlay';
import {push} from 'connected-react-router';

export const [SLIDES_FETCH, fetchSlides] = createAction('SLIDES_FETCH', 'allSlides');
export const [SLIDESHOW_ID_SET, setSlideshowId] = createAction('SLIDESHOW_ID_SET', 'slideshowId');
export const [SLIDE_FETCH, fetchSlide] = createAction('SLIDE_FETCH', 'id');
export const [SLIDES_SET, setSlides] = createAction('SLIDES_SET', 'items', 'total', 'totalPages');
export const [SLIDES_SET_ITEMS, setAllSlides] = createAction('SLIDES_SET_ITEMS', 'items');
export const [SLIDES_CREATE, createSlide] = createAction('SLIDES_CREATE', 'item');
export const [SLIDES_DELETE, deleteSlide] = createAction('SLIDES_DELETE', 'id');
export const [SLIDES_POST, postSlide] = createAction('SLIDES_POST', 'formData');
export const [SLIDES_PATCH, patchSlide] = createAction('SLIDES_PATCH', 'payload');
export const [SLIDES_PAGE_SET, setPage] = createAction('SLIDES_PAGE_SET', 'page');
export const [SLIDES_ORDER_POST, postSlidesOrder] = createAction('SLIDES_ORDER_POST', 'order');

const initialState = {
  items: null,
  total: null,
  totalPages: null,
  page: 1,
  slideshowId: null,
};

export const reducer = createReducer(initialState, {
  [SLIDES_SET]: (s, {items, total, totalPages}) => ({...s, items, total, totalPages}),
  [SLIDES_SET_ITEMS]: (s, {items}) => ({...s, items}),
  [SLIDES_CREATE]: (s, {item}) => ({...s, items: [item]}),
  [SLIDES_PAGE_SET]: (s, {page}) => ({...s, page}),
  [SLIDESHOW_ID_SET]: (s, {slideshowId}) => ({...s, slideshowId}),
});

const slides = prop('slides');
export const getSlides = createSelector(slides, prop('items'));
export const getTotal = createSelector(slides, prop('total'));
export const getTotalPages = createSelector(slides, prop('totalPages'));
export const getPage = createSelector(slides, prop('page'));
export const getSlideshowId = createSelector(slides, prop('slideshowId'));
export const getItemById = createSelector(
  getSlides,
  (_, slideId) => slideId,
  (items, id) => (items ? items.find(el => el.id === +id) : {}),
);

function* fetchSlidesSaga({allSlides = false}) {
  const page = yield select(getPage);
  const slideshowId = yield select(getSlideshowId);

  try {
    yield put(startLoading());

    const {data, total_items, items_per_page, error} = yield call(
      get,
      `slideshows/${slideshowId}/slides?page=${page}`,
    );
    if (error) {
      yield put(setError(error));
      return;
    }

    yield put(stopLoading());
    if (allSlides) {
      yield put(setAllSlides(data));
      return;
    }
    const totalPages = Math.ceil(total_items / items_per_page);

    yield put(setSlides(data, total_items, totalPages));
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchSlidesaga({id}) {
  try {
    const slideshowId = yield select(getSlideshowId);
    yield put(startLoading());
    const {data, error} = yield call(get, `slideshows/${slideshowId}/slides/${id}`);

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createSlide(data));
    yield put(stopLoading());
  } catch (e) {
    yield put(setError(e));
  }
}

function* postSlidesSaga({formData}) {
  try {
    yield put(startLoading());
    const slideshowId = yield select(getSlideshowId);

    const {data, error} = yield call(post, `slideshows/${slideshowId}/slides`, JSON.stringify(formData));
    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createSlide(data));
    yield put(stopLoading());
    yield put(push(`/slideshow/${slideshowId}/slides/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* patchSlidesSaga({payload}) {
  const {values, slideId} = payload;
  try {
    yield put(startLoading());
    const slideshowId = yield select(getSlideshowId);

    const {data, error} = yield call(
      update,
      `slideshows/${slideshowId}/slides/${slideId}`,
      JSON.stringify(values),
    );

    if (error || isEmpty(data)) {
      yield put(setError(error));
      return;
    }
    yield put(createSlide(data));
    yield put(stopLoading());
    yield put(push(`/slideshow/${slideshowId}/slides/view/${data.id}`));
  } catch (e) {
    yield put(setError(e));
  }
}

function* deleteSlidesSaga({id}) {
  try {
    yield put(startLoading());
    const slideshowId = yield select(getSlideshowId);

    const {error} = yield call(del, `slideshows/${slideshowId}/slides/${id}`);

    if (error) {
      yield put(setError(error));
      return;
    }

    yield put(stopLoading());
    yield put(fetchSlides());
  } catch (e) {
    yield put(setError(e));
  }
}

function* postSlidesOrderSaga({order}) {
  try {
    // yield put(startLoading());
    const slideshowId = yield select(getSlideshowId);

    const {error} = yield call(post, `slideshows/${slideshowId}/slides/order`, JSON.stringify({order}));
    if (error) {
      yield put(setError(error));
      return;
    }
    // yield put(stopLoading());
    // yield put(fetchSlides(slideshowId));
  } catch (e) {
    yield put(setError(e));
  }
}

export function* saga() {
  yield takeLatest([SLIDES_PAGE_SET, SLIDES_FETCH], fetchSlidesSaga);
  yield takeLatest(SLIDE_FETCH, fetchSlidesaga);
  yield takeLatest(SLIDES_POST, postSlidesSaga);
  yield takeLatest(SLIDES_PATCH, patchSlidesSaga);
  yield takeLatest(SLIDES_DELETE, deleteSlidesSaga);
  yield takeLatest(SLIDES_ORDER_POST, postSlidesOrderSaga);
}
