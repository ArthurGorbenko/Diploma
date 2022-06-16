import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import Component from './Component';
import {withHandlers} from 'recompose';
import {toggleAlert, getIsVisible} from './ducks';

export default Component
  |> withHandlers({
    handleCloseAlert: ({toggleAlert}) => () => {
      toggleAlert(false);
    },
  })
  |> connect(
    createStructuredSelector({
      isVisible: getIsVisible,
    }),
    {toggleAlert},
  );
