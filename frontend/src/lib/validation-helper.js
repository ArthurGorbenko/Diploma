import {isEmpty} from 'ramda';

export const validate = (values, fieldsToValidate) => {
  const errors = {};
  //test required fields
  Object.keys(values).forEach(key => {
    if (
      !isEmpty(
        fieldsToValidate.filter(
          el => Object.prototype.hasOwnProperty.call(el, key) && el[key].required === true,
        ),
      ) &&
      (!values[key] || (typeof values[key] === 'object' && !values[key].length))
    )
      errors[key] = 'error.requiredField';
  });
  return errors;
};
