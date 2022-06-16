import {prop} from 'ramda';
import {createSelector} from 'reselect';
import {createReducer, createAction} from 'lib/redux-helper';

export const [MODAL_OPEN, setModalOpen] = createAction('MODAL_OPEN', 'open');

export const reducer = createReducer(
  {
    open: false,
  },
  {
    [MODAL_OPEN]: (s, {open}) => ({...s, open}),
  },
);

const modal = prop('modal');
export const getModalOpen = createSelector(modal, prop('open'));
