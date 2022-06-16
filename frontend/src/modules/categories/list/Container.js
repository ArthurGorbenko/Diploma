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
  getPage,
  getCategories,
  fetchCategories,
  getTotalCategories,
  deleteCategory,
  getAlertStatus,
} from '../ducks';
import {loadingIf} from 'ui/Loading';
import withPagination from 'ui/Pagination/withPagination';
import {restrictToAdmin} from 'modules/user';

export default Component
  |> withHandlers({
    handleFadeChange: ({fade, setFade}) => (event, id) => {
      setFade({...fade, [id]: !fade[id]});
    },
    handleModalConfirm: ({
      idRemoved,
      deleteCategory,
      setModalOpen,
      history,
      setFade,
      fade,
      alert,
    }) => () => {
      deleteCategory(idRemoved);
      setModalOpen(false);
      if (alert) {
        setFade({...fade, [idRemoved]: !fade[idRemoved]});
      }
      history.push('/categories');
    },
  })
  |> withState('fade', 'setFade', {})
  |> withProps(({items, intl: {formatMessage}}) => ({
    data: items.map(el => ({...el, category: el.name, subRows: [{...el}]})),
    columns: [
      {
        Header: formatMessage({id: 'name'}),
        accessor: 'category',
      },
    ],
  }))
  |> withPagination
  |> loadingIf(({items}) => !items)
  |> lifecycle({
    componentDidMount() {
      const {fetchCategories, page, items, totalCategories, getTotalPages} = this.props;
      if (!items || (!totalCategories && !getTotalPages) || !items.length < 2) {
        fetchCategories(page);
      }
    },
  })
  |> connect(
    createStructuredSelector({
      totalPages: getTotalPages,
      page: getPage,
      items: getCategories,
      totalCategories: getTotalCategories,
      alert: getAlertStatus,
    }),
    {setPage, setModalOpen, fetchCategories, deleteCategory},
  )
  |> withModal
  |> injectIntl
  |> restrictToAdmin;
