import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {
  getSlideOptions,
  getTotalPages,
  fetchOptions,
  setDesignDefault,
  fetchSlideOptions,
} from 'modules/options/ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';

export default Component =>
  Component
  |> loadingIf(({slideOptions}) => !slideOptions)
  |> lifecycle({
    componentDidMount() {
      const {slideshow, slide, setDesignDefault, fetchSlideOptions} = this.props;
      setDesignDefault([slideshow.design.id]);
      if (slide) {
        fetchSlideOptions(`slide_${slide.type}`);
      } else {
        fetchSlideOptions('slide_product');
      }
    },
  })
  |> connect(
    createStructuredSelector({
      slideOptions: getSlideOptions,
      total: getTotalPages,
    }),
    {fetchOptions, setDesignDefault, fetchSlideOptions},
  );
