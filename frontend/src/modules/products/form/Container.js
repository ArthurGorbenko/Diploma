import {isEmpty, isNil, prop} from 'ramda';
import {withFormik} from 'formik';
import {withHandlers, branch, withProps, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {postProduct, patchProduct} from '../ducks';
import {withRouter} from 'react-router';
import withUserRole from 'modules/user/withUserRole';
import {getCategories as getAllCategories} from 'modules/categories/ducks';
import {getCategories as getShopCategories, getDesigns} from 'modules/user/ducks';
import {getFiles, getLoading} from 'ui/MediaUpload/ducks';
import {createStructuredSelector} from 'reselect';
import {toggleAlert} from 'ui/Alert/ducks';
import {validate} from 'lib/validation-helper';
import {loadingIf} from 'ui/Loading';
import withDesigns from 'modules/designs/withDesigns';
import {withDesignPicker} from 'modules/designs';
import {setDesign, setDefaultEntity, getOptions, setAll, setDisabled} from 'modules/options/ducks';
import Component from './Component';
import withModal from 'ui/Modal/withModal';
import withOptionsState from 'modules/options/withOptionsState';
import {setOptionValues} from 'modules/options/helpers';

export default Component
  |> lifecycle({
    componentDidMount() {
      this.props.setDefaultEntity('product');
      this.props.setAll(true);
      this.props.setDisabled(true);
    },
    componentDidUpdate(prevProps) {
      const {values, filterByDesigns, clearState} = this.props;
      if (values.design_ids.length !== prevProps.values.design_ids.length) {
        filterByDesigns(values.design_ids);
        if (!values.design_ids.length) {
          clearState();
        }
      }
    },
  })
  |> withHandlers({
    handleCancel: ({history}) => () => {
      history.push('/products');
    },
    handleCategory: ({setFieldValue}) => (e, newValue) => {
      setFieldValue('category_id', newValue && newValue.id);
    },
    handleMedia: ({setFieldValue}) => ({filename, type}) => {
      setFieldValue('media_link', filename);
      setFieldValue('media_type', type);
    },
    handleModalConfirm: ({setModalOpen, idRemoved: {id}, removeOption}) => () => {
      removeOption(id);
      setModalOpen(false);
    },
  })
  |> withOptionsState()
  |> withDesignPicker
  |> withFormik({
    mapPropsToValues: ({
      valuesForChange = {title: '', media_link: '', media_type: '', option_values: []},
    }) => ({
      title: valuesForChange.title,
      category_id: 10,
      media_type: valuesForChange.media_type,
      media_link: valuesForChange.media_link,
      option_values: valuesForChange.option_values,
      design_ids:
        !isNil(valuesForChange) && valuesForChange.designs
          ? valuesForChange.designs.map(({id}) => id)
          : [],
    }),
    validate: (values, {toggleAlert}) => {
      const errors = validate(values, [
        {
          title: {
            required: true,
          },
        },
        {
          category_id: {
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
      const {productId, postProduct, patchProduct, currentOptions} = props;
      //set option values
      values.option_values = [];
      setOptionValues(currentOptions, values);
      productId ? patchProduct({values, productId}) : postProduct(values);
    },
  })
  |> branch(prop('isAdmin'), withDesigns({all: true}))
  |> withRouter
  |> loadingIf(({categories}) => !categories)
  |> connect(
    (s, {isAdmin}) =>
      createStructuredSelector({
        categories: isAdmin ? getAllCategories : getShopCategories,
        files: getFiles,
        isMediaLoading: getLoading,
        designs: getDesigns,
        options: getOptions,
      }),
    {postProduct, patchProduct, toggleAlert, setDesign, setDefaultEntity, setAll, setDisabled},
  )
  |> withModal
  |> withProps({fileId: 'productImage'})
  |> withUserRole;
