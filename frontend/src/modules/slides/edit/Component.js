import React from 'react';
import PropTypes from 'prop-types';
import {Container} from '@material-ui/core';
import {Form} from 'modules/slides/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Edit = ({slideId, slide}) => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('slides.edit')}</FormTitle>
      <Form slideId={slideId} valuesForChange={slide} />
    </Container>
  );
};

Edit.propTypes = {
  slideId: PropTypes.number.isRequired,
  slide: PropTypes.object.isRequired,
};

export default Edit;
