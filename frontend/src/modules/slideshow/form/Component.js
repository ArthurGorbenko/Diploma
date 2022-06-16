import React from 'react';
import PropTypes from 'prop-types';
import {isEmpty, isNil} from 'ramda';
import {
  Container,
  TextField,
  Grid,
  InputLabel,
  Slider,
  FormControlLabel,
  Checkbox,
  Collapse,
  Box,
} from '@material-ui/core';
import {FormActions, Submit, Cancel, Input, Help} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Alert} from 'ui/Alert';
import {ErrorMessage} from 'ui/ErrorMessage';
import {DesignPicker} from 'modules/designs';
import {OptionsPicker, OptionsViewer} from 'modules/options';
import {ModalWindow} from 'ui/Modal';
import {getOptionValues} from 'modules/options/helpers';

const Form = ({
  values,
  valuesForChange,
  handleChange,
  handleBlur,
  handleSubmit,
  handleCancel,
  handleShops,
  handleCategory,
  handleSpeed,
  isAdmin,
  errors,
  shops,
  categories,
  speed,
  designs,
  designsForChange,
  handleDesign,
  currentShop,
  options,
  handleModalConfirm,
  currentOptions = [],
  ...props
}) => {
  const t = useMessage();
  const isCollapsed = !isEmpty(values.design_id) && !isNil(options) && !isEmpty(options);
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Input
            id="slideshowNameField"
            labelId="slideshow.label"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            name="name"
            error={errors.name}
          />
{/*
          {isAdmin && !valuesForChange && (
            <Grid item xs={12}>
              <Autocomplete
                value={'root'}
                onChange={handleShops}
                options={shops}
                getOptionLabel={option => option.name}
                style={{width: '100%'}}
                id="shopSelect"
                renderInput={params => (
                  <TextField {...params} label={t('shop.labelSingular')} variant="outlined" />
                )}
              />
              <ErrorMessage error={errors.shop_id} />
            </Grid>
          )} */}
          <Collapse style={{width: '100%'}} in={currentShop && categories.length > 1}>
            <Grid style={{padding: 20}} item xs={12}>
              <Autocomplete
                multiple
                defaultValue={valuesForChange ? valuesForChange.categories : []}
                getOptionSelected={(opt, value) => opt.id === value.id}
                onChange={handleCategory}
                options={categories}
                getOptionLabel={option => option.name}
                style={{width: '100%'}}
                id="categorySelect"
                renderInput={params => (
                  <TextField {...params} label={t('category.label')} variant="outlined" />
                )}
              />
            </Grid>
          </Collapse>
          {/* {!(valuesForChange && !valuesForChange.empty) ? (
            <Grid item xs={12}>
              <DesignPicker
                designs={designs}
                designsForChange={designsForChange}
                handleDesign={handleDesign}
              />
              <ErrorMessage error={errors.design_id} />
            </Grid>
          ) : (
            <Help>{t('slideshow.help.changeDesign')}</Help>
          )} */}
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
          </Collapse>
          <Grid item xs={12}>
            <InputLabel id="slideshowSpeedLabel">
              {`${t('slideshow.speed')} : ${speed} ${t('seconds')}`}
            </InputLabel>
            <Slider
              aria-labelledby="slideshowSpeedLabel"
              name="slideshowSpeed"
              value={speed}
              onChange={handleSpeed}
              step={1}
              min={2}
              max={90}
              valueLabelDisplay="auto"
            />
          </Grid>
          {isAdmin && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.disabled}
                    onChange={handleChange}
                    name="disabled"
                    color="primary"
                    id="disablingCheckbox"
                  />
                }
                label={t('disable')}
              />
            </Grid>
          )}
          <FormActions>
            <Submit />
            <Cancel onClick={handleCancel} />
          </FormActions>
        </Grid>
      </form>
      <Alert messageId="required" />
      <ModalWindow handleModalConfirm={handleModalConfirm} />
    </Container>
  );
};

Form.propTypes = {
  values: PropTypes.object.isRequired,
  options: PropTypes.any,
  currentOptions: PropTypes.array.isRequired,
  valuesForChange: PropTypes.any,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleShops: PropTypes.func.isRequired,
  handleSpeed: PropTypes.func.isRequired,
  handleCategory: PropTypes.func.isRequired,
  handleDesign: PropTypes.func.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  shops: PropTypes.array,
  currentShop: PropTypes.any,
  designs: PropTypes.array.isRequired,
  designsForChange: PropTypes.any,
  categories: PropTypes.array.isRequired,
  speed: PropTypes.number.isRequired,
  currentId: PropTypes.string,
  errors: PropTypes.object.isRequired,
};

export default Form;
