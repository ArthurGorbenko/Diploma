import {prop} from 'ramda';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';

export const [TOGGLE_ALERT, toggleAlert] = createAction('TOGGLE_ALERT', 'isVisible');

export const reducer = createReducer(
  {
    isVisible: false,
  },
  {
    [TOGGLE_ALERT]: (s, {isVisible}) => ({...s, isVisible}),
  },
);

const alert = prop('alert');
export const getIsVisible = createSelector(alert, prop('isVisible'));
