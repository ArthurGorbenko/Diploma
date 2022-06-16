import React from 'react';
import PropTypes from 'prop-types';
import {Container} from '@material-ui/core';
import {Form} from 'modules/products/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Edit = ({productId, product}) => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('product.edit')}</FormTitle>
      <Form productId={productId} valuesForChange={product} />
    </Container>
  );
};

Edit.propTypes = {
  productId: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
};

export default Edit;
