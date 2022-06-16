import Component from './Component';
import {withFormik} from 'formik';
import {withHandlers, withProps} from 'recompose';
import {connect} from 'react-redux';
import {createLabel, postLabel, patchLabel, getCategoryId} from '../ducks';
import {withRouter} from 'react-router';
import withUserRole from 'modules/user/withUserRole';
import {getFiles, getLoading} from 'ui/MediaUpload/ducks';
import {isEmpty} from 'ramda';
import {createStructuredSelector} from 'reselect';
import {toggleAlert} from 'ui/Alert/ducks';
import {validate} from 'lib/validation-helper';
import withCategoryId from '../withCategoryId';

export default Component
  |> withHandlers({
    handleCancel: ({history, categoryId}) => () => {
      history.push(`/categories/${categoryId}/labels`);
    },
    handleMedia: ({setFieldValue}) => ({filename}) => {
      setFieldValue('image_link', filename);
    },
  })
  |> withFormik({
    mapPropsToValues: ({valuesForChange = {name: '', image_link: ''}}) => ({
      name: valuesForChange.name,
      image_link: valuesForChange.image_link,
    }),
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
      const {currentId, postLabel, patchLabel, files, fileId} = props;
      values.image_link = files[fileId].filename;
      currentId ? patchLabel({values, currentId}) : postLabel(values);
    },
  })
  |> withRouter
  |> connect(
    createStructuredSelector({
      files: getFiles,
      loading: getLoading,
      categoryId: getCategoryId,
    }),
    {createLabel, postLabel, patchLabel, toggleAlert},
  )
  |> withProps({fileId: 'labelImage'})
  |> withCategoryId
  |> withUserRole;
