import {isEmpty} from 'ramda';
import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {fetchCategory, getItemById} from 'modules/categories/ducks';
import {loadingIf} from 'ui/Loading';

export default Component =>
  Component
  |> loadingIf(({category}) => isEmpty(category))
  |> lifecycle({
    componentDidMount() {
      const {category, fetchCategory, categoryId} = this.props;

      if (isEmpty(category)) {
        fetchCategory(categoryId);
      }
    },
  })
  |> connect(
    (state, {categoryId}) => ({
      category: getItemById(state, categoryId),
    }),
    {fetchCategory},
  );
