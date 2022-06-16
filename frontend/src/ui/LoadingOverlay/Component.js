import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'ui/Loading';
import {Box, styled} from '@material-ui/core';

const Overlay = styled(Box)(({active}) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  width: '100vw',
  height: '100vh',
  transition: 'all .3s',
  opacity: active ? 1 : 0,
  pointerEvents: active ? 'all' : 'none',
  zIndex: 999,
}));

export const LoadingOverlay = ({active}) => (
  <Overlay active={active}>
    <Loading size={90} />
  </Overlay>
);

LoadingOverlay.propTypes = {
  active: PropTypes.number.isRequired,
};

export default LoadingOverlay;
