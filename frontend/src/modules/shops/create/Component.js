import React from 'react';
import {Container} from '@material-ui/core';
import {Form} from 'modules/shops/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Create = () => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('shop.create')}</FormTitle>
      <Form />
    </Container>
  );
};

export default Create;
