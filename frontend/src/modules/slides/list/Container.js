import Component from './Component';
import {connect} from 'react-redux';
import {withHandlers, withState, withProps, lifecycle} from 'recompose';
import {injectIntl} from 'react-intl';
import {deleteSlide, getTotalPages, setPage, getPage, setSlideshowId} from 'modules/slides/ducks';
import {createStructuredSelector} from 'reselect';
import withModal from 'ui/Modal/withModal';
import withSlideshow from 'modules/slideshow/withSlideshow';
import {setModalOpen} from 'ui/Modal';
import withPagination from 'ui/Pagination/withPagination';
import withSlides from '../withSlides';
import {renderIfLoaded} from 'lib/renderIf';
import withUserRole from 'modules/user/withUserRole';
import {fetchSlides} from '../ducks';

export default Component
  |> withHandlers({
    handleFadeChange: ({fade, setFade}) => (event, id) => {
      setFade({...fade, [id]: !fade[id]});
    },
    handleModalConfirm: ({idRemoved, deleteSlide, setModalOpen, fetchSlides}) => () => {
      deleteSlide(idRemoved);
      setModalOpen(false);
      fetchSlides();
    },
  })
  |> withState('fade', 'setFade', {})
  |> withProps(({slides, intl: {formatMessage}}) => ({
    data: slides.map(el => ({
      ...el,
      slide_data:
        el.type === 'product'
          ? el.slide_data.title || el.slide_data.product.title
          : el.slide_data.image_link,
      subRows: [{...el}],
    })),
    columns: [
      {
        Header: formatMessage({id: 'slides.column.order'}),
        accessor: 'number',
      },
      {
        Header: formatMessage({id: 'slides.column.type'}),
        accessor: 'type',
      },
      {
        Header: formatMessage({id: 'slides.column.data'}),
        accessor: 'slide_data',
      },
    ],
  }))
  |> withPagination
  |> lifecycle({
    componentDidUpdate(prevProps) {
      const {location, match, slideshowId, fetchSlides, setSlideshowId} = this.props;
      if (prevProps.location !== location && slideshowId !== +match.params.slideshowId) {
        setSlideshowId(match.params.slideshowId);
        fetchSlides();
      }
    },
  })
  |> renderIfLoaded
  |> connect(
    createStructuredSelector({
      totalPages: getTotalPages,
      page: getPage,
    }),
    {deleteSlide, setPage, setModalOpen, fetchSlides, setSlideshowId},
  )
  |> withSlideshow
  |> withSlides()
  |> withModal
  |> injectIntl
  |> withUserRole;
