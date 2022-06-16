import React from 'react';
import {Container} from '@material-ui/core';
import {Form} from 'modules/categories/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Create = () => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('category.create')}</FormTitle>
      <Form />
    </Container>
  );
};

export default Create;
