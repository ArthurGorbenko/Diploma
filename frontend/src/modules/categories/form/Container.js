import Component from './Component';
import {isEmpty} from 'ramda';
import {withFormik} from 'formik';
import {withHandlers} from 'recompose';
import {connect} from 'react-redux';
import {postCategory, patchCategory} from '../ducks';
import {withRouter} from 'react-router';
import {toggleAlert} from 'ui/Alert/ducks';
import {validate} from 'lib/validation-helper';

export default Component
  |> withHandlers({
    handleCancel: ({history}) => () => {
      history.push('/categories');
    },
  })
  |> withFormik({
    mapPropsToValues: ({valueForChange = ''}) => ({name: valueForChange}),
    validate: (values, {toggleAlert}) => {
      const errors = validate(values, [
        {
          name: {
            required: true,
          },
        },
      ]);
      if (!isEmpty(errors)) toggleAlert(true);
      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    handleSubmit: (values, {props}) => {
      const {postCategory, patchCategory, categoryId} = props;
      categoryId ? patchCategory({values, categoryId}) : postCategory(values);
    },
  })
  |> withRouter
  |> connect(null, {postCategory, patchCategory, toggleAlert});
