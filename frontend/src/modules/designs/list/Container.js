import Component from './Component';
import {connect} from 'react-redux';
import {withHandlers, withState, withProps} from 'recompose';
import {injectIntl} from 'react-intl';
import {createStructuredSelector} from 'reselect';
import withModal from 'ui/Modal/withModal';
import {setModalOpen} from 'ui/Modal';
import {setPage, getTotalPages, getPage, getTotalDesigns, patchDesign} from '../ducks';
import withPagination from 'ui/Pagination/withPagination';
import withDesigns from '../withDesigns';
import {restrictToAdmin} from 'modules/user';

export default Component
  |> withHandlers({
    handleFadeChange: ({fade, setFade}) => (event, id) => {
      setFade({...fade, [id]: !fade[id]});
    },
    handleDisabled: ({setDisabled, disabled, patchDesign}) => (event, id) => {
      const value = event.target.checked;
      setDisabled({...disabled, [id]: value});
      patchDesign({id, values: {disabled: value}});
    },
  })
  |> withState('disabled', 'setDisabled', ({designs}) =>
    Object.fromEntries(designs.map(({id, disabled}) => [id, disabled])),
  )
  |> withState('fade', 'setFade', {})
  |> withProps(({designs, intl: {formatMessage}}) => ({
    data: designs.map(el => ({
      ...el,
      name: formatMessage({id: `designs.labels.${el.machine_name}`}),
      subRows: [{...el}],
    })),
    columns: [
      {
        Header: 'Machine Name',
        accessor: 'machine_name',
      },
      {
        Header: formatMessage({id: 'name'}),
        accessor: 'name',
      },
    ],
  }))
  |> withPagination
  |> connect(
    createStructuredSelector({
      totalPages: getTotalPages,
      page: getPage,
      totalDesigns: getTotalDesigns,
    }),
    {setPage, setModalOpen, patchDesign},
  )
  |> withDesigns()
  |> withModal
  |> injectIntl
  |> restrictToAdmin;
