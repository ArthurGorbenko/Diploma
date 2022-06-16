import React from 'react';
import {Container} from '@material-ui/core';
import {Form} from 'modules/slideshow/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Create = () => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('slideshow.create')}</FormTitle>
      <Form />
    </Container>
  );
};

export default Create;
