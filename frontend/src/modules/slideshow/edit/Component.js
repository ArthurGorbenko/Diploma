import React from 'react';
import PropTypes from 'prop-types';
import {Container} from '@material-ui/core';
import {Form} from 'modules/slideshow/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Edit = ({slideshowId, slideshow}) => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('slideshow.edit')}</FormTitle>
      <Form slideshowId={slideshowId} valuesForChange={slideshow} />
    </Container>
  );
};

Edit.propTypes = {
  slideshowId: PropTypes.number.isRequired,
  slideshow: PropTypes.object.isRequired,
};

export default Edit;
