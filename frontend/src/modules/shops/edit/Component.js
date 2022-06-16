import React from 'react';
import PropTypes from 'prop-types';
import {Container} from '@material-ui/core';
import {Form} from 'modules/shops/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Edit = ({shopId, shop}) => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('shop.edit')}</FormTitle>
      <Form shopId={shopId} valuesForChange={shop} />
    </Container>
  );
};

Edit.propTypes = {
  shopId: PropTypes.string.isRequired,
  shop: PropTypes.object.isRequired,
};

export default Edit;
