import Component from './Component';
import {connect} from 'react-redux';
import {withHandlers, withState, withProps} from 'recompose';
import {injectIntl} from 'react-intl';
import {deleteLabel, getTotalPages, setPage, getPage} from 'modules/labels/ducks';
import withLabels from 'modules/labels/withLabels';
import {createStructuredSelector} from 'reselect';
import withModal from 'ui/Modal/withModal';
import {setModalOpen} from 'ui/Modal';
import withPagination from 'ui/Pagination/withPagination';
import withCategoryId from '../withCategoryId';
import {getCategoryId} from '../ducks';

export default Component
  |> withHandlers({
    handleFadeChange: ({fade, setFade}) => (e, id) => {
      setFade({...fade, [id]: !fade[id]});
    },
    handleModalConfirm: ({idRemoved, deleteLabel, setModalOpen, history, categoryId}) => () => {
      deleteLabel(idRemoved);
      setModalOpen(false);
      history.push(`/categories/${categoryId}/labels`);
    },
  })
  |> withState('fade', 'setFade', {})
  |> withProps(({labels, intl: {formatMessage}}) => ({
    data: labels.map(el => ({
      ...el,
      subRows: [{...el}],
    })),
    columns: [
      {
        Header: formatMessage({id: 'labels.name'}),
        accessor: 'name',
      },
    ],
  }))
  |> withPagination
  |> connect(
    createStructuredSelector({
      totalPages: getTotalPages,
      page: getPage,
      categoryId: getCategoryId,
    }),
    {deleteLabel, setPage, setModalOpen},
  )
  |> withModal
  |> injectIntl
  |> withLabels()
  |> withCategoryId;
