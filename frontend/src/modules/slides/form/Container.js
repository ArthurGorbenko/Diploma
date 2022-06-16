import {prop, isEmpty, includes} from 'ramda';
import {withFormik} from 'formik';
import {withHandlers, withState, withProps, branch, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {createSlide, postSlide, patchSlide} from '../ducks';
import {withRouter} from 'react-router';
import withUserRole from 'modules/user/withUserRole';
import {createStructuredSelector} from 'reselect';
import withProduct from 'modules/products/withProduct';
import withProducts from 'modules/products/withProducts';
import {getItems, setFilter, fetchProductsByShop} from 'modules/products/ducks';
import withSlideshow from 'modules/slideshow/withSlideshow';
import {getFiles, getLoading} from 'ui/MediaUpload/ducks';
import {toggleAlert} from 'ui/Alert/ducks';
import {validate} from 'lib/validation-helper';
import {injectIntl} from 'react-intl';
import withLabels from 'modules/labels/withLabels';
// import {getLabels} from 'modules/user/ducks';
import Component from './Component';
import {fetchOptions, setDesignDefault, fetchSlideOptions} from 'modules/options/ducks';
import withModal from 'ui/Modal/withModal';
import withSlideOptions from 'modules/options/withSlideOptions';
import withOptions from 'modules/options/withOptions';
import withOptionsState from 'modules/options/withOptionsState';
import {setOptionValues} from 'modules/options/helpers';

export default Component
  |> lifecycle({
    componentDidMount() {
      const {slideOptions, addOptionSlide} = this.props;
      if (slideOptions.length === 1) {
        addOptionSlide(this.props.slideOptions[0]);
      }
    },
    componentDidUpdate(prev) {
      const {slideOptions, addOptionSlide} = this.props;
      if (prev.slideOptions.length !== slideOptions.length && slideOptions.length === 1) {
        addOptionSlide(this.props.slideOptions[0]);
      }
    },
  })
  |> withHandlers({
    handleType: ({setFieldValue, fetchSlideOptions}) => (e, {id}) => {
      setFieldValue('type', id);
      fetchSlideOptions(`slide_${id}`);
    },
    handleCancel: ({history, slideshowIdParam}) => () => {
      history.push(`/slideshow/${slideshowIdParam}/slides`);
    },
    handleProduct: ({setFieldValue, setCurrentProduct}) => (e, {id}) => {
      setFieldValue('slide_data.product_id', id);
      setCurrentProduct(id);
    },
    handleCategory: ({
      setFilter,
      setCurrentCategory,
      setFieldValue,
      isAdmin,
      fetchProductsByShop,
      slideshow,
    }) => (e, category) => {
      if (category) {
        if (isAdmin) {
          fetchProductsByShop(slideshow.shop.id, category && category.id);
        } else {
          setFilter(category && category.id);
        }
      }
      setCurrentCategory(category);
      setFieldValue('slide_data.product_id', '');
      setFieldValue('slide_data.label_ids', []);
    },
    handleCountry: ({setFieldValue}) => (e, country) => {
      setFieldValue('slide_data.country', country);
    },
    handleEvent: ({setFieldValue}) => (e, event) => {
      setFieldValue('slide_data.event', event);
    },
    handlePrice: ({setFieldValue}) => ({target: {id, value}}) => {
      setFieldValue(`slide_data.${id}`, value);
    },
    handleAddLabel: ({setFieldValue, values}) => (e, id) => {
      const {label_ids} = values.slide_data;
      if (!label_ids) {
        values.slide_data.label_ids = [];
        setFieldValue('slide_data.label_ids', [id]);
      } else if (label_ids.includes(id)) {
        setFieldValue('slide_data.label_ids', [...label_ids.filter(el => el !== id)]);
      } else {
        setFieldValue('slide_data.label_ids', [...label_ids, id]);
      }
    },
    handleMedia: ({setFieldValue, values}) => ({filename}) => {
      setFieldValue(`slide_data.${values.type}_link`, filename);
    },
    handleModalConfirm: ({setModalOpen, idRemoved: {id: optId, target_entity}, ...props}) => () => {
      let {removeOption} = props;
      if (target_entity !== 'slide') {
        removeOption = props.removeOptionSlide;
      }
      removeOption(optId);
      setModalOpen(false);
    },
  })
  |> withProps(
    ({labels, currentCategory, slideshow: {design, categories}, products, intl: {formatMessage}}) => ({
      types: [
        {id: 'product', label: formatMessage({id: 'slides.slideType.product'})},
        {id: 'image', label: formatMessage({id: 'slides.slideType.image'})},
        {id: 'video', label: formatMessage({id: 'slides.slideType.video'})},
        // {id: 'event',label: formatMessage({id: 'slides.slideType.event'})},
      ],
      events: [
        formatMessage({id: 'slides.events.today'}),
        formatMessage({id: 'slides.events.limit'}),
        formatMessage({id: 'slides.events.promotion'}),
      ],
      origins: [
        formatMessage({id: 'slides.origin.france'}),
        formatMessage({id: 'slides.origin.spain'}),
        formatMessage({id: 'slides.origin.uk'}),
        formatMessage({id: 'slides.origin.netherlands'}),
        formatMessage({id: 'slides.origin.belgium'}),
      ],
      labels:
        categories.length === 0
          ? labels
          : currentCategory
          ? labels.filter(({category_id}) => category_id === currentCategory.id)
          : [],
      products: products
        ? products.filter(({designs}) => includes(design, designs) || designs.length === 0)
        : [],
    }),
  )
  |> withLabels({all: true})
  |> withState('currentCategory', 'setCurrentCategory', prop('currentCategory'))
  |> withState('currentProduct', 'setCurrentProduct', ({slide}) =>
    slide ? slide.slide_data.product_id : null,
  )
  |> withFormik({
    mapPropsToValues: ({valuesForChange = {type: 'product', disabled: false, slide_data: {}}}) => {
      const {type, slide_data, disabled} = valuesForChange;
      const values = {type, slide_data, disabled};
      if (type !== 'product') return values;

      if (Object.prototype.hasOwnProperty.call(slide_data, 'product')) {
        values.slide_data.product_id = slide_data.product.id;
      }
      if (Object.prototype.hasOwnProperty.call(slide_data, 'labels')) {
        values.slide_data.label_ids = [...slide_data.labels.map(({id}) => id)];
      }

      return values;
    },
    validate: (values, {toggleAlert}) => {
      let errors = {};
      if (values.type === 'product') {
        const {slide_data} = values;
        errors = validate(slide_data, [
          {
            product_id: {
              required: true,
            },
          },
        ]);
        if (!isEmpty(errors)) toggleAlert(true);
      }
      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    handleSubmit: (
      values,
      {props: {slideId, postSlide, patchSlide, currentTypeOptions, currentOptions}},
    ) => {
      //set slide options
      values.option_values = [];
      setOptionValues(currentOptions, values);

      //set slide specific options
      values.slide_data.option_values = [];
      setOptionValues(currentTypeOptions, values.slide_data);

      if (
        values.type === 'product' &&
        Object.prototype.hasOwnProperty.call(values.slide_data, 'product')
      ) {
        delete values.slide_data.product;
      }

      slideId ? patchSlide({values, slideId}) : postSlide(values);
    },
  })
  |> withOptionsState({
    state: 'currentTypeOptions',
    actionPrefix: 'Slide',
  })
  |> withOptionsState()
  |> withRouter
  |> withOptions({entity: 'slide', all: true, disabled: true})
  |> withSlideOptions
  |> connect(
    createStructuredSelector({
      products: getItems,
      files: getFiles,
      loading: getLoading,
    }),
    {
      createSlide,
      postSlide,
      patchSlide,
      toggleAlert,
      setFilter,
      fetchOptions,
      setDesignDefault,
      fetchSlideOptions,
      fetchProductsByShop,
    },
  )
  |> withProducts()
  |> withProps({fileId: 'slideMedia'})
  |> withProps(({product, slideshow: {categories}}) => ({
    currentCategory: product ? product.category : categories[0] ? categories[0] : null,
  }))
  |> branch(prop('productId'), withProduct)
  |> withProps(({slideshow, valuesForChange}) => ({
    productId:
      valuesForChange && valuesForChange.type === 'product' && valuesForChange.slide_data
        ? valuesForChange.slide_data.product.id
        : null,
    productsFilter: slideshow.categories.length === 1 ? slideshow.categories[0].id : 'all',
  }))
  |> withModal
  |> withSlideshow
  |> withUserRole
  |> injectIntl;
