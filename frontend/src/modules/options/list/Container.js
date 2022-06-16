import Component from './Component';
import {connect} from 'react-redux';
import {withHandlers, withState, withProps} from 'recompose';
import {injectIntl} from 'react-intl';
import {createStructuredSelector} from 'reselect';
import withModal from 'ui/Modal/withModal';
import {
  getTotalPages,
  setPage,
  getPage,
  getTotalOptions,
  patchOption,
  getEntity,
  setDesign,
  setEntity,
  getDesignIds,
} from '../ducks';
import withPagination from 'ui/Pagination/withPagination';
import withOptions from '../withOptions';
import withDesigns from 'modules/designs/withDesigns';
import {restrictToAdmin} from 'modules/user';

export default Component
  |> withHandlers({
    handleFadeChange: ({fade, setFade}) => (event, id) => {
      setFade({...fade, [id]: !fade[id]});
    },
    handleDisabled: ({setDisabled, disabled, patchOption}) => (event, id) => {
      const value = event.target.checked;
      setDisabled({...disabled, [id]: value});
      patchOption({id, values: {disabled: value}});
    },
    handleDesignFilter: ({setDesign}) => e => {
      if (e.target.value === 'all') {
        setDesign([]);
        return;
      }
      setDesign([e.target.value]);
    },
    handleEntityFilter: ({setEntity}) => e => {
      if (e.target.value === 'all') {
        setEntity('');
        return;
      }
      setEntity(e.target.value);
    },
  })
  |> withState('disabled', 'setDisabled', ({options}) =>
    Object.fromEntries(options.map(({id, disabled}) => [id, disabled])),
  )
  |> withState('fade', 'setFade', {})
  |> withProps(({options, designs, intl: {formatMessage}}) => ({
    data: options.map(el => ({
      ...el,
      name: formatMessage({id: `options.labels.${el.translation_key}`}),
      subRows: [{...el}],
    })),
    columns: [
      {
        Header: 'Machine name',
        accessor: 'machine_name',
      },
      {
        Header: formatMessage({id: 'name'}),
        accessor: 'name',
      },
    ],
    entities: ['all', 'product', 'slideshow', 'slide_image', 'slide_product', 'slide'],
    designs: [{machine_name: 'all', id: 'all'}, ...designs],
  }))
  |> withPagination
  |> connect(
    createStructuredSelector({
      totalPages: getTotalPages,
      page: getPage,
      totalOptions: getTotalOptions,
      entity: getEntity,
      designIds: getDesignIds,
    }),
    {setPage, patchOption, setEntity, setDesign},
  )
  |> withOptions()
  |> withDesigns({all: true})
  |> withModal
  |> injectIntl
  |> restrictToAdmin;
