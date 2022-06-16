import Component from './Component';
import withProduct from 'modules/products/withProduct';
import {withProps, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import withModal from 'ui/Modal/withModal';
import {deleteProduct} from 'modules/products/ducks';
import withUserRole from 'modules/user/withUserRole';
import withOptions from 'modules/options/withOptions';
import {isEmpty} from 'ramda';

export default Component
  |> withHandlers({
    handleModalConfirm: ({idRemoved, deleteProduct, setModalOpen, history}) => () => {
      deleteProduct(idRemoved);
      setModalOpen(false);
      history.push('/products');
    },
  })
  |> withProps(({product}) => {
    if (isEmpty(product.option_values)) return null;
    const optionValues = {};
    product.option_values.forEach(function ({option_id, value}) {
      optionValues[option_id] = value;
    });
    return {optionValues};
  })
  |> withOptions({entity: 'product', all: true, disabled: true})
  |> withModal
  |> withProduct
  |> withProps(({match}) => ({productId: match.params.id}))
  |> connect(null, {deleteProduct})
  |> withUserRole;
