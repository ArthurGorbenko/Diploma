import {isEmpty} from 'ramda';
import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {fetchProduct, getItemById} from 'modules/products/ducks';
import {loadingIf} from 'ui/Loading';

export default Component =>
  Component
  |> loadingIf(({product}) => isEmpty(product))
  |> lifecycle({
    componentDidMount() {
      const {product, fetchProduct, productId} = this.props;

      if (isEmpty(product) && productId) {
        fetchProduct(productId);
      }
    },
  })
  |> connect(
    (state, {productId}) => ({
      product: getItemById(state, productId),
    }),
    {fetchProduct},
  );
