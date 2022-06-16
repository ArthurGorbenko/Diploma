import Component from './Component';
import {isEmpty, prop, isNil} from 'ramda';
import {withFormik} from 'formik';
import {withHandlers, withState, branch, lifecycle, compose} from 'recompose';
import {connect} from 'react-redux';
import {createSlideshow, postSlideshow, patchSlideshow} from '../ducks';
import {withRouter} from 'react-router';
import withUserRole from 'modules/user/withUserRole';
import withShops from 'modules/shops/withShops';
import {toggleAlert} from 'ui/Alert/ducks';
import {validate} from 'lib/validation-helper';
import {getShopCategories as getShopCategoriesById, fetchShop} from 'modules/shops/ducks';
import {
  getCategories as getCurrentShopCategories,
  getDesigns as getShopDesigns,
} from 'modules/user/ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';
import {withDesignPicker} from 'modules/designs';
import withDesigns from 'modules/designs/withDesigns';
import {getDesigns as getAllDesigns} from 'modules/designs/ducks';
import withModal from 'ui/Modal/withModal';
import {setDefaultEntity, setAll, getOptions, setDisabled} from 'modules/options/ducks';
import withOptionsState from 'modules/options/withOptionsState';
import {setOptionValues} from 'modules/options/helpers';

export default Component
  |> lifecycle({
    componentDidMount() {
      this.props.setDefaultEntity('slideshow');
      this.props.setAll(true);
      this.props.setDisabled(true);
    },
    componentDidUpdate(prevProps) {
      const {values, filterByDesigns, options, addOption} = this.props;
      if (!values.design_id || (!prevProps.values.design_id && isNil(options))) return;
      if (prevProps.options !== options && options.length === 1) {
        addOption(options[0]);
      }
      if (values.design_id !== prevProps.values.design_id) {
        filterByDesigns([values.design_id]);
      }
    },
  })
  |> withHandlers({
    handleCancel: ({history}) => () => {
      history.push('/slideshow');
    },
    handleShops: ({setFieldValue, setCurrentShop}) => (e, shop) => {
      setCurrentShop(shop && shop.id);
      setFieldValue('shop_id', shop && 'root');
    },
    handleCategory: ({setFieldValue}) => (e, categories) => {
      setFieldValue(
        'category_ids',
        categories.map(({id}) => id),
      );
    },
    handleSpeed: ({setFieldValue, setSpeed}) => (e, speed) => {
      setSpeed(speed);
      setFieldValue('speed', speed);
    },
    handleModalConfirm: ({setModalOpen, idRemoved: {id}, removeOption}) => () => {
      removeOption(id);
      setModalOpen(false);
    },
  })
  |> withState('speed', 'setSpeed', ({valuesForChange}) =>
    valuesForChange ? valuesForChange.speed : 5,
  )
  |> withDesignPicker
  |> withFormik({
    mapPropsToValues: ({
      valuesForChange = {
        name: '',
        shop_id: 14,
        category_ids: '',
        speed: 5,
        disabled: false,
      },
    }) => ({
      name: valuesForChange.name,
      shop_id: 14,
      speed: valuesForChange.speed,
      disabled: valuesForChange.disabled,
      category_ids: valuesForChange.categories,
      design_id: 13,
    }),
    validate: (values, {toggleAlert, isAdmin}) => {
      const errors = validate(values, [
        {
          name: {
            required: true,
          },
        },
        {
          shop_id: {
            required: isAdmin,
          },
        },
        {
          design_id: {
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
      const {slideshowId, postSlideshow, patchSlideshow, currentOptions} = props;
      //set option values
      values.option_values = [];
      setOptionValues(currentOptions, values);
      slideshowId ? patchSlideshow({values, slideshowId}) : postSlideshow(values);
    },
  })
  |> withOptionsState()
  |> loadingIf(({categories}) => !categories)
  |> withRouter
  |> connect(
    (_, props) =>
      createStructuredSelector({
        categories: props.isAdmin ? getShopCategoriesById : getCurrentShopCategories,
        designs: props.isAdmin ? getAllDesigns : getShopDesigns,
        options: getOptions,
      }),
    {
      createSlideshow,
      postSlideshow,
      patchSlideshow,
      toggleAlert,
      fetchShop,
      setDefaultEntity,
      setAll,
      setDisabled,
    },
  )
  |> withState('currentShop', 'setCurrentShop', ({valuesForChange}) =>
    valuesForChange ? valuesForChange.shop.id : null,
  )
  |> withModal
  |> branch(prop('isAdmin'), compose(withDesigns({all: true}), withShops))
  |> withUserRole;
