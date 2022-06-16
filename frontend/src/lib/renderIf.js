import React from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getIsLoading} from 'ui/LoadingOverlay';

export const renderIf = conditionFn => ComponentToRender => props =>
  conditionFn(props) ? <ComponentToRender {...props} /> : null;

export const renderIfLoaded = Component =>
  Component
  |> renderIf(({isLoading}) => !isLoading)
  |> connect(
    createStructuredSelector({
      isLoading: getIsLoading,
    }),
  );
