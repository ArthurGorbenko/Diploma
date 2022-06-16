import Component from './Component';
import {withProps, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import withModal from 'ui/Modal/withModal';
import {deleteSlide} from 'modules/slides/ducks';
import withSlide from '../withSlide';
import withOptions from 'modules/options/withOptions';
import withSlideOptions from 'modules/options/withSlideOptions';
import withSlideshow from 'modules/slideshow/withSlideshow';
import {isEmpty} from 'ramda';

export default Component
  |> withHandlers({
    handleModalConfirm: ({idRemoved, deleteSlide, setModalOpen, history, slideshowId}) => () => {
      deleteSlide(idRemoved);
      setModalOpen(false);
      history.push(`/slideshow/${slideshowId}/slides`);
    },
  })
  |> withProps(({slide}) => {
    const slideOptionValues = {};
    if (!isEmpty(slide.option_values)) {
      slide.option_values.forEach(({option_id, value}) => {
        slideOptionValues[option_id] = value;
      });
    }
    const slideTypeOptionValues = {};
    if (!isEmpty(slide.slide_data.option_values)) {
      slide.slide_data.option_values.forEach(({option_id, value}) => {
        slideTypeOptionValues[option_id] = value;
      });
    }
    return {slideOptionValues, slideTypeOptionValues};
  })
  |> withOptions({entity: 'slide', all: true, disabled: true})
  |> withSlideOptions
  |> withModal
  |> withSlideshow
  |> withSlide
  |> connect(null, {deleteSlide});
