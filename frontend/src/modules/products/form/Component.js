import React from 'react';
import PropTypes from 'prop-types';
import {isEmpty, isNil} from 'ramda';
import {Container, TextField, Grid, Collapse, Box} from '@material-ui/core';
import {FormActions, Submit, Cancel, Input} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {MediaUpload} from 'ui/MediaUpload';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Alert} from 'ui/Alert';
import {ErrorMessage} from 'ui/ErrorMessage';
import {DesignPicker} from 'modules/designs';
import {OptionsPicker, OptionsViewer} from 'modules/options';
import {ModalWindow} from 'ui/Modal';
import {getOptionValues} from 'modules/options/helpers';

const Form = ({
  values,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  handleCancel,
  handleCategory,
  handleDesign,
  handleMedia,
  categories,
  files,
  designs,
  designsForChange,
  fileId,
  isMediaLoading,
  options,
  handleModalConfirm,
  currentOptions = [],
  ...props
}) => {
  const t = useMessage();
  const isDisabled = Boolean(!files[fileId] || isMediaLoading);
  const isCollapsed = !isEmpty(values.design_ids) && !isNil(options) && !isEmpty(options);
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Input
            id="productNameField"
            labelId="product.label"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.title}
            name="title"
            error={errors.title}
          />

          {/* <Grid item xs={12}>
            <Autocomplete
              value={categories.filter(el => el.id === values.category_id)[0] || null}
              onChange={handleCategory}
              options={categories}
              getOptionLabel={option => option.name}
              fullWidth
              id="categorySelect"
              renderInput={params => (
                <TextField {...params} label={t('category.name')} variant="outlined" />
              )}
            />
            <ErrorMessage error={errors.category_id} />
          </Grid>
          <Collapse style={{width: '100%'}} in={isCollapsed}>
            <Box style={{padding: 20}}>
              <OptionsViewer
                isPaper
                options={options || []}
                optionValues={getOptionValues(currentOptions)}
                currentOptions={currentOptions}
                {...props}
              />
              <OptionsPicker
                options={options || []}
                values={values}
                currentOptions={currentOptions}
                {...props}
              />
            </Box>
          </Collapse> */}
          <Grid item xs={12}>
            <MediaUpload
              onFileUpload={handleMedia}
              accept="both"
              fileId={fileId}
              defaultValue={{filename: values.media_link, type: values.media_type}}
            />
          </Grid>
          <FormActions>
            <Submit isDisabled={isDisabled} />
            <Cancel onClick={handleCancel} />
          </FormActions>
        </Grid>
        <Alert messageId="required" />
      </form>
      <ModalWindow handleModalConfirm={handleModalConfirm} />
    </Container>
  );
};

Form.propTypes = {
  values: PropTypes.object.isRequired,
  options: PropTypes.any,
  currentOptions: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleCategory: PropTypes.func.isRequired,
  handleDesign: PropTypes.func.isRequired,
  handleMedia: PropTypes.func.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  designs: PropTypes.array.isRequired,
  designsForChange: PropTypes.any,
  categories: PropTypes.array,
  currentId: PropTypes.string,
  files: PropTypes.object,
  fileId: PropTypes.string.isRequired,
  isMediaLoading: PropTypes.number.isRequired,
};

export default Form;
