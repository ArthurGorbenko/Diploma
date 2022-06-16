import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {loadingIf} from 'ui/Loading';
import {
  fetchAllCategories,
  getCategories,
  getPage,
  setPage,
  getTotalCategories,
} from 'modules/categories/ducks';
import {createStructuredSelector} from 'reselect';
import withUserRole from 'modules/user/withUserRole';

export default Component =>
  Component
  |> loadingIf(({categories}) => !categories)
  |> lifecycle({
    componentDidMount() {
      const {categories, fetchAllCategories, isAdmin} = this.props;
      if (!categories && isAdmin) {
        fetchAllCategories();
      }
    },
  })
  |> connect(
    createStructuredSelector({
      categories: getCategories,
      pageCategories: getPage,
      totalCategories: getTotalCategories,
    }),
    {fetchAllCategories, setPage},
  )
  |> withUserRole;
