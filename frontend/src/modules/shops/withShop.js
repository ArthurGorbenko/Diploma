import {isEmpty} from 'ramda';
import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {fetchShop, getItemById} from 'modules/shops/ducks';
import {loadingIf} from 'ui/Loading';

export default Component =>
  Component
  |> loadingIf(({shop}) => isEmpty(shop))
  |> lifecycle({
    componentDidMount() {
      const {shop, fetchShop, shopId} = this.props;

      if (isEmpty(shop) && shopId) {
        fetchShop(shopId);
      }
    },
  })
  |> connect(
    (state, {shopId}) => ({
      shop: getItemById(state, shopId),
    }),
    {fetchShop},
  );
