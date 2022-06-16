import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {getIsLoading} from 'ui/LoadingOverlay';
import Component from './Component';

export default Component
  |> connect(
    createStructuredSelector({
      isloadingOverlay: getIsLoading,
    }),
  );
