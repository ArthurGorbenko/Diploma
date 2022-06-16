import {fork} from 'redux-saga/effects';
import {saga as networkSaga} from 'modules/network';
import {saga as userSaga} from 'modules/user';
import {saga as productsSaga} from 'modules/products';
import {saga as categoriesSaga} from 'modules/categories';
import {saga as shopsSaga} from 'modules/shops';
import {saga as slideshowSaga} from 'modules/slideshow';
import {saga as slidesSaga} from 'modules/slides';
import {saga as labelsSaga} from 'modules/labels';
import {saga as designsSaga} from 'modules/designs';
import {saga as optionsSaga} from 'modules/options';
import {saga as mediaSaga} from 'ui/MediaUpload';

export default function* sagas() {
  yield fork(networkSaga);
  yield fork(userSaga);
  yield fork(categoriesSaga);
  yield fork(shopsSaga);
  yield fork(productsSaga);
  yield fork(mediaSaga);
  yield fork(slideshowSaga);
  yield fork(slidesSaga);
  yield fork(labelsSaga);
  yield fork(designsSaga);
  yield fork(optionsSaga);
}
