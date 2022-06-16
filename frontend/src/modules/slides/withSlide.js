import {isEmpty} from 'ramda';
import {lifecycle, withProps} from 'recompose';
import {connect} from 'react-redux';
import {fetchSlide, getItemById} from 'modules/slides/ducks';
import withSlideshowId from './withSlideshowId';
import {loadingIf} from 'ui/Loading';

export default Component =>
  Component
  |> loadingIf(({slide}) => isEmpty(slide))
  |> lifecycle({
    componentDidMount() {
      const {slide, fetchSlide, slideId} = this.props;

      if (isEmpty(slide) || slide.id != slideId) {
        fetchSlide(slideId);
      }
    },
  })
  |> connect(
    (state, {slideId}) => ({
      slide: getItemById(state, slideId),
    }),
    {fetchSlide},
  )
  |> withProps(({match}) => ({slideId: +match.params.slideId}))
  |> withSlideshowId;
