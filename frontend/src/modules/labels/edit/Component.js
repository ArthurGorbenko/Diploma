import React from 'react';
import PropTypes from 'prop-types';
import {Container} from '@material-ui/core';
import {Form} from 'modules/labels/form';
import {FormTitle} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Edit = ({currentId, label}) => {
  const t = useMessage();
  return (
    <Container>
      <FormTitle>{t('labels.edit')}</FormTitle>
      <Form currentId={currentId} valuesForChange={label} />
    </Container>
  );
};

Edit.propTypes = {
  currentId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
};

export default Edit;
