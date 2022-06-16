import React from 'react';
import {useMessage} from 'lib/intl/hooks';
import {Typography, styled, Box} from '@material-ui/core';

export const Container = styled(Box)({
  padding: 20,
});
export const Title = styled(p => <Typography variant="h4" {...p} />)({
  marginBottom: 20,
});

const NotFound = () => {
  const t = useMessage('notFound');

  return (
    <Container>
      <Title>{t('title')}</Title>
      <Typography variant="body1">{t('description')}</Typography>
    </Container>
  );
};

export default NotFound;
