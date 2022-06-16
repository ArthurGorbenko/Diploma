import {prop} from 'ramda';
import Component from './Component';
import {connect} from 'react-redux';
import {withHandlers, withState, withProps, branch, compose, lifecycle} from 'recompose';
import {injectIntl} from 'react-intl';
import {
  deleteProduct,
  getTotalPages,
  setPage,
  getPage,
  setFilter,
  getFilter,
} from 'modules/products/ducks';
import withProducts from 'modules/products/withProducts';
import {createStructuredSelector} from 'reselect';
import withModal from 'ui/Modal/withModal';
import {setModalOpen} from 'ui/Modal';
import withShops from 'modules/shops/withShops';
import withCategories from 'modules/categories/withCategories';
import withPagination from 'ui/Pagination/withPagination';
import withUserRole from 'modules/user/withUserRole';

export default Component
  |> withHandlers({
    handleFilter: ({setFilter}) => e => {
      setFilter(e.target.value);
    },
    handleFadeChange: ({fade, setFade}) => (e, id) => {
      setFade({...fade, [id]: !fade[id]});
    },
    handleModalConfirm: ({idRemoved, deleteProduct, setModalOpen, history}) => () => {
      deleteProduct(idRemoved);
      setModalOpen(false);
      history.push('/products');
    },
  })
  |> withState('fade', 'setFade', {})
  |> withProps(({products, isAdmin, filter, categories, intl: {formatMessage}}) => ({
    filters: ['all', 'default', 'mine'],
    filter: filter || 'all',
    categories: isAdmin && [{name: 'category.all', id: 'all'}, ...categories],
    data: products.map(el => ({
      ...el,
      category: isAdmin && el.category ? el.category.name : '',
      shop: isAdmin && el.shop ? el.shop.name : '',
      subRows: [{...el}],
    })),
    columns: [
      {
        Header: formatMessage({id: 'name'}),
        accessor: 'title',
      },
      // {
      //   Header: formatMessage({id: 'category.name'}),
      //   accessor: 'category',
      // },
      // {
      //   Header: formatMessage({id: 'shop.labelSingular'}),
      //   accessor: 'shop',
      // },
      {
        Header: formatMessage({id: 'product.column.mediaType'}),
        accessor: 'media_type',
      },
    ].filter(column => isAdmin || (column.accessor !== 'shop' && column.accessor !== 'category')),
  }))
  |> lifecycle({
    componentDidMount() {
      const {filter, setFilter, isClient} = this.props;

      //if user goes to products list after slides creation : clear filter
      if (typeof filter === 'number' && isClient) setFilter('all');
    },
  })
  |> withPagination
  |> connect(
    createStructuredSelector({
      totalPages: getTotalPages,
      page: getPage,
      filter: getFilter,
    }),
    {deleteProduct, setPage, setModalOpen, setFilter},
  )
  |> withModal
  |> injectIntl
  |> branch(prop('isAdmin'), compose(withCategories, withShops))
  |> withProducts()
  |> withUserRole;
