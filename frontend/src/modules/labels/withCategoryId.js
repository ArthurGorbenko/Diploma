import {lifecycle, withProps} from 'recompose';
import {connect} from 'react-redux';
import {loadingIf} from 'ui/Loading';
import {createStructuredSelector} from 'reselect';
import {getCategoryId, setCategoryId, fetchLabels} from './ducks';
import {withRouter} from 'react-router';

export default Component =>
  Component
  |> loadingIf(({categoryId}) => !categoryId)
  |> lifecycle({
    componentDidMount() {
      const {categoryIdParam, setCategoryId} = this.props;

      setCategoryId(categoryIdParam);
    },
  })
  |> withProps(({match}) => ({categoryIdParam: +match.params.categoryId}))
  |> connect(
    createStructuredSelector({
      categoryId: getCategoryId,
    }),
    {setCategoryId, fetchLabels},
  )
  |> withRouter;
