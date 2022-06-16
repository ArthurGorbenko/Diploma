import {lifecycle, withProps} from 'recompose';
import {connect} from 'react-redux';
import {loadingIf} from 'ui/Loading';
import {createStructuredSelector} from 'reselect';
import {getSlideshowId, setSlideshowId} from './ducks';
import {withRouter} from 'react-router';

export default Component =>
  Component
  |> loadingIf(({slideshowId, slideshowIdParam}) => !slideshowId || slideshowId !== slideshowIdParam)
  |> lifecycle({
    componentDidMount() {
      const {slideshowIdParam, setSlideshowId} = this.props;
      setSlideshowId(slideshowIdParam);
    },
    componentDidUpdate() {
      const {slideshowIdParam, setSlideshowId} = this.props;
      setSlideshowId(slideshowIdParam);
    },
  })
  |> withProps(({match}) => ({slideshowIdParam: +match.params.slideshowId}))
  |> connect(
    createStructuredSelector({
      slideshowId: getSlideshowId,
    }),
    {setSlideshowId},
  )
  |> withRouter;
