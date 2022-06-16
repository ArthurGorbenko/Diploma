import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {fetchProducts, getItems, fetchProductsByShop} from 'modules/products/ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';

export default ({all = false} = {}) => Component =>
  Component
  |> loadingIf(({products}) => !products)
  |> lifecycle({
    componentDidMount() {
      const {
        fetchProducts,
        productsFilter,
        slideshow,
        isAdmin,
        fetchProductsByShop,
        currentCategory,
      } = this.props;

      if (isAdmin && slideshow) {
        fetchProductsByShop(slideshow.shop.id, currentCategory && currentCategory.id);
        return;
      }

      if (productsFilter) {
        fetchProducts(productsFilter);
        return;
      }

      if (all) {
        fetchProducts('all');
        return;
      }

      fetchProducts();
    },
  })
  |> connect(
    createStructuredSelector({
      products: getItems,
    }),
    {fetchProducts, fetchProductsByShop},
  );
