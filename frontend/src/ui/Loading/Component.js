import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import {styled} from '@material-ui/core';
import {colors} from 'theme';

const Container = styled('div')(({hide}) => ({
  opacity: hide ? 0.4 : 1,
  padding: 30,
  '& .MuiCircularProgress-colorPrimary': {
    color: colors.blue,
  },
}));

export const Loading = ({isloadingOverlay, size = 50}) => (
  <Container hide={isloadingOverlay}>
    <CircularProgress size={size} />
  </Container>
);

Loading.propTypes = {
  size: PropTypes.number,
  isloadingOverlay: PropTypes.number.isRequired,
};

export default Loading;
