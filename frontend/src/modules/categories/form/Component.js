import React from 'react';
import PropTypes from 'prop-types';
import {Container, Grid} from '@material-ui/core';
import {FormActions, Submit, Cancel, Input} from 'theme';
import {Alert} from 'ui/Alert';

const Form = ({values, handleChange, handleBlur, handleSubmit, handleCancel, errors}) => {
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Input
            id="categoryNameField"
            labelId="category.name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            name="name"
            error={errors.name}
          />

          <FormActions>
            <Submit />
            <Cancel onClick={handleCancel} />
          </FormActions>
        </Grid>
      </form>
      <Alert messageId="required" />
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
};

export default Form;
