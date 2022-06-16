import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {fetchSlideshows, getSlideshows, getTotal} from 'modules/slideshow/ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';

export default Component =>
  Component
  |> loadingIf(({slideshows}) => !slideshows)
  |> lifecycle({
    componentDidMount() {
      const {fetchSlideshows, slideshowsFilters} = this.props;

      fetchSlideshows(slideshowsFilters);
    },
  })
  |> connect(
    createStructuredSelector({
      slideshows: getSlideshows,
      total: getTotal,
    }),
    {fetchSlideshows},
  );
