import Component from './Component';
import withShop from 'modules/shops/withShop';
import {withProps, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import withModal from 'ui/Modal/withModal';
import {deleteShop} from 'modules/shops/ducks';

export default Component
  |> withHandlers({
    handleModalConfirm: ({idRemoved, deleteShop, setModalOpen, history}) => () => {
      deleteShop(idRemoved);
      setModalOpen(false);
      history.push('/shops');
    },
  })
  |> withModal
  |> withShop
  |> withProps(({match}) => ({shopId: match.params.id}))
  |> connect(null, {deleteShop});
