import {prop} from 'ramda';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';

export const [LOADING_START, startLoading] = createAction('LOADING_START');
export const [LOADING_STOP, stopLoading] = createAction('LOADING_STOP');
export const [LOADING_CLEAR, clearLoading] = createAction('LOADING_CLEAR');

export const reducer = createReducer(
  {
    isLoading: 0,
  },
  {
    [LOADING_START]: ({isLoading}) => ({isLoading: ++isLoading}),
    [LOADING_STOP]: ({isLoading}) => ({isLoading: --isLoading}),
    [LOADING_CLEAR]: () => ({isLoading: 0}),
  },
);

const loading = prop('loading');
export const getIsLoading = createSelector(loading, prop('isLoading'));
