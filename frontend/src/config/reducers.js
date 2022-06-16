import {combineReducers} from 'redux';
import {reducer as network} from 'modules/network';
import {reducer as loading} from 'ui/LoadingOverlay';
import {reducer as user} from 'modules/user';
import {reducer as products} from 'modules/products';
import {reducer as categories} from 'modules/categories';
import {reducer as shops} from 'modules/shops';
import {reducer as modal} from 'ui/Modal';
import {reducer as media} from 'ui/MediaUpload';
import {reducer as slideshow} from 'modules/slideshow';
import {reducer as slides} from 'modules/slides';
import {reducer as alert} from 'ui/Alert';
import {reducer as labels} from 'modules/labels';
import {reducer as designs} from 'modules/designs';
import {reducer as options} from 'modules/options';
import {connectRouter} from 'connected-react-router';

export default history =>
  combineReducers({
    router: connectRouter(history),
    network,
    loading,
    user,
    products,
    categories,
    shops,
    modal,
    media,
    slideshow,
    slides,
    alert,
    labels,
    designs,
    options,
  });
