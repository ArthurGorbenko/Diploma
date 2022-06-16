import React from 'react';
import PropTypes from 'prop-types';
import {Container, Grid} from '@material-ui/core';
import {FormActions, Submit, Cancel, Input} from 'theme';
import {MediaUpload} from 'ui/MediaUpload';
import {Alert} from 'ui/Alert';

const Form = ({
  values,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  handleCancel,
  files,
  fileId,
  handleMedia,
  loading,
}) => {
  const isDisabled = Boolean(!files[fileId] || loading);
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Input
            id="labelNameField"
            labelId="labels.name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            name="name"
            error={errors.title}
          />

          <Grid item xs={12}>
            <MediaUpload
              onFileUpload={handleMedia}
              accept="image"
              fileId={fileId}
              defaultValue={{filename: values.image_link, type: 'image'}}
            />
          </Grid>
          <FormActions>
            <Submit isDisabled={isDisabled} />
            <Cancel onClick={handleCancel} />
          </FormActions>
        </Grid>
        <Alert messageId="required" />
      </form>
    </Container>
  );
};

Form.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleMedia: PropTypes.func.isRequired,
  files: PropTypes.object,
  fileId: PropTypes.string.isRequired,
  loading: PropTypes.number.isRequired,
};

export default Form;
