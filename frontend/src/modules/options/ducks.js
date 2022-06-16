import {prop, isEmpty, isNil} from 'ramda';
import {takeLatest, put, call, select, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {setError} from 'modules/network';
import {startLoading, stopLoading} from 'ui/LoadingOverlay';
import {update, get} from 'lib/fetch';
import {getSlideshowId} from 'modules/slides/ducks';

export const [OPTIONS_FETCH, fetchOptions] = createAction('OPTIONS_FETCH', 'entity', 'all', 'disabled');
export const [OPTIONS_SLIDE_FETCH, fetchSlideOptions] = createAction('OPTIONS_SLIDE_FETCH', 'entity');
export const [OPTIONS_FETCH_ALL, fetchAllOptions] = createAction('OPTIONS_FETCH_ALL');
export const [OPTIONS_SET, setOptions] = createAction('OPTIONS_SET', 'items', 'total', 'totalPages');
export const [OPTIONS_SET_ITEMS, addAllOptions] = createAction('OPTIONS_SET_ITEMS', 'items');
export const [OPTIONS_SLIDE_SET, setSlideOptions] = createAction('OPTIONS_SLIDE_SET', 'data');
export const [OPTIONS_PATCH, patchOption] = createAction('OPTIONS_PATCH', 'payload');
export const [OPTIONS_PAGE_SET, setPage] = createAction('OPTIONS_PAGE_SET', 'page');
export const [OPTION_ENTITY_SET, setEntity] = createAction('OPTION_ENTITY_SET', 'entity');
export const [OPTION_ENTITY_DEFAULT, setDefaultEntity] = createAction('OPTION_ENTITY_DEFAULT', 'entity');
export const [OPTION_DESIGN_SET, setDesign] = createAction('OPTION_DESIGN_SET', 'designIds');
export const [OPTION_DESIGN_SET_DEFAULT, setDesignDefault] = createAction(
  'OPTION_DESIGN_SET_DEFAULT',
  'designIds',
);
export const [OPTION_ALL, setAll] = createAction('OPTION_ALL', 'all');
export const [OPTION_DISABLED, setDisabled] = createAction('OPTION_DISABLED', 'disabled');

const initialState = {
  items: null,
  page: 1,
  totalPages: null,
  total: null,
  entity: null,
  designIds: [],
  all: null,
  disabled: null,
};

export const reducer = createReducer(initialState, {
  [OPTIONS_SET]: (s, {items, total, totalPages}) => ({...s, items, total, totalPages}),
  [OPTIONS_SET_ITEMS]: (s, {items}) => ({...s, items}),
  [OPTIONS_PAGE_SET]: (s, {page}) => ({...s, page}),
  [OPTION_ENTITY_SET]: (s, {entity}) => ({...s, entity}),
  [OPTION_ENTITY_DEFAULT]: (s, {entity}) => ({...s, entity}),
  [OPTION_DESIGN_SET]: (s, {designIds}) => ({...s, designIds}),
  [OPTION_DESIGN_SET_DEFAULT]: (s, {designIds}) => ({...s, designIds}),
  [OPTION_ALL]: (s, {all}) => ({...s, all}),
  [OPTION_DISABLED]: (s, {disabled}) => ({...s, disabled}),
  [OPTIONS_SLIDE_SET]: (s, {data}) => ({...s, slideOptions: data}),
});

const options = prop('options');
export const getOptions = createSelector(options, prop('items'));
export const getPage = createSelector(options, prop('page'));
export const getTotalPages = createSelector(options, prop('totalPages'));
export const getTotalOptions = createSelector(options, prop('total'));
export const getEntity = createSelector(options, prop('entity'));
export const getDesignIds = createSelector(options, prop('designIds'));
export const getAll = createSelector(options, prop('all'));
export const getDisabled = createSelector(options, prop('disabled'));
export const getSlideOptions = createSelector(options, prop('slideOptions'));

function* fetchOptionsSaga({entity, all, disabled}) {
  try {
    yield put(startLoading());
    let page = yield select(getPage);
    const designs = yield select(getDesignIds);
    const slideshowId = yield select(getSlideshowId);

    if (entity) {
      yield put(setDefaultEntity(entity));
    } else {
      entity = yield select(getEntity);
    }

    if (!isNil(disabled)) {
      yield put(setDisabled(disabled));
    } else {
      disabled = yield select(getDisabled);
    }

    if (!isNil(all)) {
      yield put(setAll(all));
    } else {
      all = yield select(getAll);
    }

    if (all) page = 0;

    let url = `options?page=${page}`;

    if (slideshowId) url += `&slideshow=${slideshowId}`;

    if (disabled) url += '&disabled=0';

    if (entity) url += `&target_entity=${entity}`;

    if (designs.length) url += `&${designs.map(el => `design[]=${el}`).join('&')}`;

    const {data, total_items, items_per_page, error} = yield call(get, url);

    if (error) {
      yield put(setError(error));
      return;
    }

    yield put(stopLoading());

    if (all) {
      yield put(addAllOptions(data));
      return;
    }

    const totalPages = Math.ceil(total_items / items_per_page);
    yield put(setOptions(data, total_items, totalPages));
  } catch (e) {
    yield put(setError(e));
  }
}

function* fetchSlideOptionsSaga({entity}) {
  try {
    yield put(startLoading());
    const designs = yield select(getDesignIds);
    const slideshowId = yield select(getSlideshowId);

    let url = `options?page=0&disabled=0&slideshow=${slideshowId}`;

    if (entity) url += `&target_entity=${entity}`;

    if (designs.length) url += `&${designs.map(el => `design[]=${el}`).join('&')}`;

    const {data, error} = yield call(get, url);

    if (error) {
      yield put(setError(error));
      return;
    }

    yield put(stopLoading());

    yield put(setSlideOptions(data));
  } catch (e) {
    yield put(setError(e));
  }
}

function* patchOptionSaga({payload}) {
  const {values, id} = payload;
  try {
    yield put(startLoading());

    const {data, error} = yield call(update, `options/${id}`, JSON.stringify(values));

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
  yield takeEvery(
    [OPTIONS_FETCH, OPTION_DESIGN_SET, OPTION_ENTITY_SET, OPTIONS_PAGE_SET],
    fetchOptionsSaga,
  );
  yield takeLatest(OPTIONS_SLIDE_FETCH, fetchSlideOptionsSaga);
  yield takeLatest(OPTIONS_PATCH, patchOptionSaga);
}
