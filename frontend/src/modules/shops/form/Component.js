import React from 'react';
import {differenceWith} from 'ramda';
import PropTypes from 'prop-types';
import {
  Container,
  TextField,
  Grid,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from '@material-ui/core';
import {FormActions, Submit, Cancel, MaskedInput, Input} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {MediaUpload} from 'ui/MediaUpload';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import utils from '@date-io/dayjs';
import {Alert} from 'ui/Alert';
import {ErrorMessage} from 'ui/ErrorMessage';
import {DesignPicker} from 'modules/designs';

const Form = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  handleCancel,
  handleCategory,
  handleDesign,
  handleMedia,
  categories,
  handleDate,
  date,
  errors,
  loading,
  designs,
  designsForChange,
  valuesForChange,
  fileId,
  handleMaskedInput,
  paymentFrequencyTypes,
}) => {
  const t = useMessage();
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Input
            id="shopNameLabel"
            labelId="shop.name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            name="name"
            error={errors.name}
          />

          <Grid item xs={12}>
            <Autocomplete
              multiple
              value={categories.filter(el => el.id === values.category_id)[0]}
              onChange={handleCategory}
              id="categorySelect"
              options={
                valuesForChange
                  ? differenceWith((a, b) => a.id === b.id, categories, valuesForChange.categories)
                  : categories
              }
              getOptionLabel={({name}) => name}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  label={t(`category.${valuesForChange ? 'extra' : 'name'}`)}
                  variant="outlined"
                />
              )}
            />
            <ErrorMessage error={errors.category_ids} />
          </Grid>
          <Grid item xs={12}>
            <DesignPicker
              multiple
              handleDesign={handleDesign}
              designs={designs}
              designsForChange={designsForChange}
              label="pickForShop"
            />
          </Grid>
          <Grid item xs={12}>
            <MediaUpload
              onFileUpload={handleMedia}
              accept="image"
              fileId={fileId}
              defaultValue={{filename: values.logo, type: 'image'}}
            />
          </Grid>
          <Input
            labelId="shop.email"
            value={values.email || ''}
            id="shopEmail"
            autoComplete="true"
            type="email"
            name="email"
            onChange={handleChange}
          />
          <Input
            labelId="shop.address"
            value={values.address || ''}
            id="shopAddress"
            autoComplete="true"
            type="text"
            name="address"
            onChange={handleChange}
          />
          <Grid item xs={12}>
            <MaskedInput
              variant="outlined"
              mask="{0} 000 00 00 00"
              fullWidth
              label={t('shop.owner_phone')}
              value={values.phone}
              id="shopPhone"
              autoComplete="true"
              type="tel"
              name="phone"
              onAccept={handleMaskedInput}
            />
          </Grid>
          <Input
            labelId="shop.owner_first_name"
            value={values.owner_first_name || ''}
            id="shopOwnerFN"
            autoComplete="true"
            type="text"
            name="owner_first_name"
            onChange={handleChange}
          />
          <Input
            labelId="shop.owner_last_name"
            value={values.owner_last_name || ''}
            id="shopOwnerLN"
            autoComplete="true"
            type="text"
            name="owner_last_name"
            onChange={handleChange}
          />
          <Grid item xs={12}>
            <MaskedInput
              variant="outlined"
              label={t('shop.owner_phone')}
              mask="{0} 000 00 00 00"
              value={values.owner_phone || ''}
              id="shopOwnerPhone"
              name="owner_phone"
              onAccept={handleMaskedInput}
            />
          </Grid>
          <Grid item xs={12} container justify="space-between">
            <Grid item xs={6}>
              <MuiPickersUtilsProvider utils={utils}>
                <DatePicker
                  placeholder="01/01/2000"
                  id="subscriptionDateInput"
                  openTo="year"
                  format="DD/MMMM/YYYY"
                  label={t('shop.subscription_date')}
                  views={['year', 'month', 'date']}
                  value={date.subscription_date}
                  onChange={date => handleDate(date, 'subscription_date')}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={6}>
              <Input
                labelId="shop.pin"
                name="pin"
                value={values.pin || ''}
                id="shopPin"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="paymentFrequencySelect">{t('shop.payment_frequency')}</InputLabel>
            <Select
              fullWidth
              id="paymentFrequencySelect"
              value={values.payment_frequency || ''}
              name="payment_frequency"
              onChange={handleChange}>
              {paymentFrequencyTypes.map(el => (
                <MenuItem key={el} value={el}>
                  {t(`shop.payment_frequency_types.${el}`)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid container justify="space-between" item>
            <div>
              <MuiPickersUtilsProvider utils={utils}>
                <DatePicker
                  label={t('shop.expiration_date')}
                  placeholder="01/01/2000"
                  id="expirationDateInput"
                  openTo="year"
                  format="DD/MMMM/YYYY"
                  views={['year', 'month', 'date']}
                  value={date.expiration_date}
                  onChange={date => handleDate(date, 'expiration_date')}
                />
              </MuiPickersUtilsProvider>
              <ErrorMessage error={errors.expiration_date} />
            </div>
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

          <FormActions>
            <Submit isDisabled={loading[fileId]} />
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
  valuesForChange: PropTypes.object,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleCategory: PropTypes.func.isRequired,
  handleDesign: PropTypes.func.isRequired,
  handleDate: PropTypes.func.isRequired,
  handleMedia: PropTypes.func.isRequired,
  handleMaskedInput: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  date: PropTypes.object.isRequired,
  currentId: PropTypes.string,
  loading: PropTypes.number.isRequired,
  designs: PropTypes.array.isRequired,
  designsForChange: PropTypes.any,
  fileId: PropTypes.string.isRequired,
  paymentFrequencyTypes: PropTypes.array.isRequired,
};

export default Form;
