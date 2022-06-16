import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {fetchSlides, getSlides} from 'modules/slides/ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';
import withSlideshowId from './withSlideshowId';

export default ({all = false} = {}) => Component =>
  Component
  |> loadingIf(({slides}) => !slides)
  |> lifecycle({
    componentDidMount() {
      this.props.fetchSlides(all);
    },
  })
  |> connect(
    createStructuredSelector({
      slides: getSlides,
    }),
    {fetchSlides},
  )
  |> withSlideshowId;
