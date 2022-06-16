import {lifecycle, withState} from 'recompose';
import {connect} from 'react-redux';
import {
  fetchLabels,
  fetchAllLabels,
  getLabels,
  setCategoryId,
  fetchAllLabelsProduct,
} from 'modules/labels/ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';

export default ({all = false} = {}) => Component =>
  Component
  |> loadingIf(({labels}) => !labels)
  |> lifecycle({
    componentDidMount() {
      const {fetchAllLabels, fetchLabels, currentCategory} = this.props;
      if (all) {
        fetchAllLabels(currentCategory ? currentCategory.id : null);
      } else {
        fetchLabels();
      }
    },
    componentDidUpdate() {
      const {
        fetchAllLabels,
        currentCategory,
        prevCategory,
        setPrevCategory,
        currentProduct,
        fetchAllLabelsProduct,
        setPrevProduct,
        prevProduct,
      } = this.props;
      const categoryId = currentCategory ? currentCategory.id : null;

      if (currentProduct && currentProduct !== prevProduct) {
        fetchAllLabelsProduct(currentProduct);
        setPrevProduct(currentProduct);
        return;
      }

      if (all && categoryId !== prevCategory) {
        fetchAllLabels(categoryId);
        setPrevCategory(categoryId);
      }
    },
  })
  |> connect(
    createStructuredSelector({
      labels: getLabels,
    }),
    {fetchLabels, fetchAllLabels, fetchAllLabelsProduct, setCategoryId},
  )
  |> withState('prevCategory', 'setPrevCategory', ({currentCategory}) =>
    currentCategory ? currentCategory.id : null,
  )
  |> withState('prevProduct', 'setPrevProduct', null);
