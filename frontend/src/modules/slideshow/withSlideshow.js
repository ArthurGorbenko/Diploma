import {isEmpty, isNil} from 'ramda';
import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {fetchSlideshow, getItemById} from 'modules/slideshow/ducks';
import {loadingIf} from 'ui/Loading';
import {createStructuredSelector} from 'reselect';
import withSlideshowId from 'modules/slides/withSlideshowId';

export default Component =>
  Component
  |> loadingIf(({slideshow}) => isNil(slideshow) || isEmpty(slideshow))
  |> lifecycle({
    componentDidMount() {
      const {slideshow, fetchSlideshow, slideshowId} = this.props;

      if (isNil(slideshow) || (isEmpty(slideshow) && slideshowId)) {
        fetchSlideshow(slideshowId);
      }
    },
  })
  |> connect(createStructuredSelector({slideshow: getItemById}), {fetchSlideshow})
  |> withSlideshowId;
