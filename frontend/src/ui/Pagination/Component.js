import React from 'react';
import PropTypes from 'prop-types';
import {Box, Typography, IconButton, styled} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Container = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 16,
});

export const Page = styled(p => <Typography variant="body1" {...p} />)({
  paddingLeft: 9,
  paddingRight: 9,
});

export const Prev = styled(p => (
  <IconButton {...p}>
    <ArrowBackIosIcon />
  </IconButton>
))(({disabled}) => ({
  opacity: disabled ? 0 : null,
}));
export const Next = styled(p => (
  <IconButton {...p}>
    <ArrowForwardIosIcon />
  </IconButton>
))(({disabled}) => ({
  opacity: disabled ? 0 : null,
}));

export const Pagination = ({handleClickPrev, handleClickNext, page, totalPages, isDisabled}) =>
  totalPages ? (
    <Container>
      <Prev onClick={handleClickPrev} disabled={isDisabled.prev} />
      <Page>
        {page}
        {' / '}
        {totalPages}
      </Page>
      <Next onClick={handleClickNext} disabled={isDisabled.next} />
    </Container>
  ) : null;

Pagination.propTypes = {
  handleClickPrev: PropTypes.func.isRequired,
  handleClickNext: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number,
  isDisabled: PropTypes.object.isRequired,
};

export default Pagination;
