import React from 'react';
import PropTypes from 'prop-types';
import {Container} from '@material-ui/core';
import {Form} from 'modules/categories/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Edit = ({categoryId, category}) => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('category.edit')}</FormTitle>
      <Form categoryId={categoryId} valueForChange={category.name} />
    </Container>
  );
};

Edit.propTypes = {
  categoryId: PropTypes.string.isRequired,
  category: PropTypes.object.isRequired,
};

export default Edit;
