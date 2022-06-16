import React from 'react';
import {Box, styled} from '@material-ui/core';
import {Title} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Container = styled(Box)({
  padding: 30,
  textAlign: 'center',
});
const Text = styled(Title)({
  color: '#999',
  letterSpacing: 0.6,
});

export const Empty = () => {
  const t = useMessage();
  return (
    <Container>
      <Text>{t('emptyList')}</Text>
    </Container>
  );
};

export default Empty;
