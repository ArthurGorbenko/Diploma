import Component from './Component';
import {connect} from 'react-redux';
import {withHandlers, withState, withProps} from 'recompose';
import {injectIntl} from 'react-intl';
import {
  deleteSlideshow,
  getTotalPages,
  getPage,
  getFilter,
  setPage,
  setFilter,
} from 'modules/slideshow/ducks';
import {createStructuredSelector} from 'reselect';
import withModal from 'ui/Modal/withModal';
import {setModalOpen} from 'ui/Modal';
import withPagination from 'ui/Pagination/withPagination';
import {renderIfLoaded} from 'lib/renderIf';
import withSlideshows from '../withSlideshows';
import withShops from 'modules/shops/withShops';

export default Component
  |> withHandlers({
    handleFadeChange: ({fade, setFade}) => (e, id) => {
      setFade({...fade, [id]: !fade[id]});
    },
    handleModalConfirm: ({idRemoved, deleteSlideshow, setModalOpen, history}) => () => {
      deleteSlideshow(idRemoved);
      setModalOpen(false);
      history.push('/slideshow');
    },
    handleFilter: ({setFilter}) => e => {
      setFilter({shopId: e.target.value});
    },
  })
  |> withState('fade', 'setFade', {})
  |> withProps(({slideshows, shops, filter, isAdmin, intl: {formatMessage}}) => ({
    data: slideshows
      .filter(el => isAdmin || !el.disabled)
      .map(el => ({
        ...el,
        design: formatMessage({id: `designs.labels.${el.design.machine_name}`}),
        shop: isAdmin && el.shop ? el.shop.name : '',
        disabled: formatMessage({id: el.disabled ? 'yes' : 'not'}),
        subRows: [{...el}],
      })),
    filter: filter || 'all',
    shops: isAdmin && [{name: 'shop.all', id: 'all'}, ...shops],
    columns: [
      {
        Header: formatMessage({id: 'name'}),
        accessor: 'name',
      },
      // {
      //   Header: formatMessage({id: 'shop.labelSingular'}),
      //   accessor: 'shop',
      // },
      {
        Header: formatMessage({id: 'slideshow.speed'}),
        accessor: 'speed',
      },
      // {
      //   Header: formatMessage({id: 'designs.singleLabel'}),
      //   accessor: 'design',
      // },
      {
        Header: formatMessage({id: 'disabled'}),
        accessor: 'disabled',
      },
    ].filter(column => isAdmin || (column.accessor !== 'shop' && column.accessor !== 'disabled')),
  }))
  |> withPagination
  |> renderIfLoaded
  |> connect(
    createStructuredSelector({
      totalPages: getTotalPages,
      page: getPage,
      filter: getFilter,
    }),
    {deleteSlideshow, setPage, setModalOpen, setFilter},
  )
  |> withShops
  |> withSlideshows
  |> withProps(({location: {search}}) => {
    const url = new URLSearchParams(search);
    const shopId = +url.get('shop');
    return {
      slideshowsFilters: {shopId},
    };
  })
  |> withModal
  |> injectIntl;
