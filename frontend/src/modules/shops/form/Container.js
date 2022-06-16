import Component from './Component';
import {isEmpty, isNil} from 'ramda';
import {withFormik} from 'formik';
import {withHandlers, withState, withProps} from 'recompose';
import {connect} from 'react-redux';
import {createShop, postShop, patchShop} from '../ducks';
import {withRouter} from 'react-router';
import {getUserRole} from 'modules/user/ducks';
import withCategories from 'modules/categories/withCategories';
import {getFiles, getLoading} from 'ui/MediaUpload/ducks';
import {createStructuredSelector} from 'reselect';
import dayjs from 'dayjs';
import generatePassword from 'password-generator';
import {toggleAlert} from 'ui/Alert/ducks';
import {validate} from 'lib/validation-helper';
import withDesigns from 'modules/designs/withDesigns';
import {withDesignPicker} from 'modules/designs';

export default Component
  |> withHandlers({
    handleCancel: ({history}) => () => {
      history.push('/shops');
    },
    handleCategory: ({setFieldValue}) => (e, categories) => {
      setFieldValue(
        'category_ids',
        categories.map(({id}) => id),
      );
    },
    handleDate: ({setDate, setFieldValue, date}) => (datePicked, type) => {
      setDate({...date, [type]: datePicked});
      setFieldValue(type, datePicked.format('YYYY-MM-DD'));
    },
    handleMedia: ({setFieldValue}) => ({filename}) => {
      setFieldValue('logo', filename);
    },
    handleMaskedInput: ({setFieldValue}) => (value, _, input) => {
      setFieldValue(input.target.name, value);
    },
  })
  |> withState('date', 'setDate', ({valuesForChange}) => {
    const intialState = {expiration_date: null, subscription_date: '2022-06-12'};
    if (isNil(valuesForChange)) return intialState;
    if (valuesForChange.expiration_date)
      intialState.expiration_date = dayjs(valuesForChange.expiration_date);
    if (valuesForChange.subscription_date)
      intialState.subscription_date = dayjs(valuesForChange.subscription_date);
    return intialState;
  })
  |> withDesignPicker
  |> withFormik({
    mapPropsToValues: ({
      valuesForChange = {
        name: '',
        logo: '',
        disabled: false,
        expiration_date: '01/01/2052',
        payment_frequency: 'year',
        email: '',
        address: '',
        phone: '',
        owner_first_name: '',
        owner_last_name: '',
        owner_phone: '',
        pin: '',
      },
    }) => ({
      name: valuesForChange.name,
      category_ids: [],
      design_ids: valuesForChange.designs ? valuesForChange.designs.map(({id}) => id) : [],
      logo: valuesForChange.logo,
      disabled: valuesForChange.disabled,
      expiration_date: '01/01/2052',
      payment_frequency: valuesForChange.payment_frequency,
      email: valuesForChange.email,
      address: valuesForChange.address,
      phone: valuesForChange.phone ? valuesForChange.phone.toString() : '',
      owner_first_name: valuesForChange.owner_first_name,
      owner_last_name: valuesForChange.owner_last_name,
      owner_phone: valuesForChange.owner_phone ? valuesForChange.owner_phone.toString() : '',
      pin: valuesForChange.pin,
    }),
    validate: (values, {toggleAlert, valuesForChange}) => {
      const errors = validate(values, [
        {
          name: {
            required: true,
          },
        },
        {
          category_ids: {
            required: isNil(valuesForChange),
          },
        },
      ]);
      if (!isEmpty(errors)) toggleAlert(true);
      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    handleSubmit: (values, {props}) => {
      const {shopId, postShop, patchShop, files, fileId} = props;
      values.logo = files[fileId].filename;
      if (shopId) {
        patchShop({values, shopId});
      } else {
        values.license = generatePassword(175);
        postShop(values);
      }
    },
  })
  |> withProps({
    fileId: 'shopLogo',
    paymentFrequencyTypes: ['month', 'year'],
  })
  |> withDesigns({all: true})
  |> withRouter
  |> connect(
    createStructuredSelector({
      userRole: getUserRole,
      files: getFiles,
      loading: getLoading,
    }),
    {createShop, postShop, patchShop, toggleAlert},
  )
  |> withCategories;
