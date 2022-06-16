import Component from './Component';
import {connect} from 'react-redux';
import {withHandlers, withState, withProps, lifecycle} from 'recompose';
import {injectIntl} from 'react-intl';
import {createStructuredSelector} from 'reselect';
import withModal from 'ui/Modal/withModal';
import {setModalOpen} from 'ui/Modal';
import {
  setPage,
  getTotalPages,
  getShops,
  fetchShops,
  getTotalShops,
  deleteShop,
  getPage,
} from '../ducks';
import {loadingIf} from 'ui/Loading';
import withPagination from 'ui/Pagination/withPagination';
import {restrictToAdmin} from 'modules/user';

export default Component
  |> withHandlers({
    handleFadeChange: ({fade, setFade}) => (event, id) => {
      setFade({...fade, [id]: !fade[id]});
    },
    handleModalConfirm: ({idRemoved, deleteShop, setModalOpen, history}) => () => {
      deleteShop(idRemoved);
      setModalOpen(false);
      history.push('/shops');
    },
  })
  |> withState('fade', 'setFade', {})
  |> withProps(({items, intl: {formatMessage}}) => ({
    data: items.map(el => ({
      ...el,
      disabled: el.disabled ? 'yes' : 'not',
      expiration_date: el.root ? '' : el.expiration_date,
      categories: el.root ? '' : el.categories.length && el.categories.map(({name}) => name).toString(),
      subRows: [{...el}],
    })),
    columns: [
      {
        Header: formatMessage({id: 'name'}),
        accessor: 'name',
      },
      {
        Header: formatMessage({id: 'disabled'}),
        accessor: 'disabled',
      },
      {
        Header: formatMessage({id: 'shop.column.expiration_date'}),
        accessor: 'expiration_date',
      },
      {
        Header: formatMessage({id: 'category.label'}),
        accessor: 'categories',
      },
    ],
  }))
  |> withPagination
  |> loadingIf(({items}) => !items)
  |> lifecycle({
    componentDidMount() {
      const {fetchShops, page} = this.props;
      fetchShops(page);
    },
  })
  |> connect(
    createStructuredSelector({
      totalPages: getTotalPages,
      page: getPage,
      items: getShops,
      totalShops: getTotalShops,
    }),
    {setPage, setModalOpen, fetchShops, deleteShop},
  )
  |> withModal
  |> injectIntl
  |> restrictToAdmin;
