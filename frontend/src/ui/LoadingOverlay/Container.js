import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import Component from './Component';
import {getIsLoading} from '.';

export default Component
  |> connect(
    createStructuredSelector({
      active: getIsLoading,
    }),
  );
