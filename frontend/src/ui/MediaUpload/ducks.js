import {prop} from 'ramda';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';
import {takeLatest, put, call} from 'redux-saga/effects';
import {postFile} from 'lib/fetch';
import {setError} from 'modules/network';

export const [MEDIA_SET, setMedia] = createAction('MEDIA_SET', 'fileId', 'data');
export const [MEDIA_CLEAR, clearMedia] = createAction('MEDIA_CLEAR');
export const [MEDIA_UPLOAD, uploadMedia] = createAction(
  'MEDIA_SET',
  'formData',
  'fileId',
  'onFileUpload',
);
export const [MEDIA_TOGGLE_LOADING_START, startLoading] = createAction('MEDIA_TOGGLE_LOADING_START');
export const [MEDIA_TOGGLE_LOADING_STOP, stopLoading] = createAction('MEDIA_TOGGLE_LOADING_STOP');

export const reducer = createReducer(
  {
    files: {},
    loading: 0,
  },
  {
    [MEDIA_SET]: ({files, ...s}, {fileId, data}) => ({...s, files: {...files, [fileId]: data}}),
    [MEDIA_CLEAR]: () => ({files: {}, loading: {}}),
    [MEDIA_TOGGLE_LOADING_START]: ({loading, ...s}) => ({
      ...s,
      loading: ++loading,
    }),
    [MEDIA_TOGGLE_LOADING_STOP]: ({loading, ...s}) => ({
      ...s,
      loading: --loading,
    }),
  },
);

function* uploadMediaSaga({formData, fileId, onFileUpload = null}) {
  if (!formData || !formData.type || !fileId) {
    return;
  }
  try {
    yield put(startLoading());
    const type = formData.type.split('/')[0];
    const file = new FormData();
    file.append('file', formData);
    //TODO : get file hash
    const {filename, error} = yield call(postFile, 'upload', file);
    if (!filename && error) {
      yield put(setError(error));
      return;
    }
    yield put(stopLoading());
    const data = {filename, type};
    if (onFileUpload) yield call(onFileUpload, data, fileId);
    yield put(setMedia(fileId, data));
  } catch (e) {
    yield put(setError(e));
  }
}

const media = prop('media');
export const getLoading = createSelector(media, prop('loading'));
export const getFiles = createSelector(media, prop('files'));

export function* saga() {
  yield takeLatest(MEDIA_UPLOAD, uploadMediaSaga);
}
