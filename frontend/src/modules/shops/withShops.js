import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {loadingIf} from 'ui/Loading';
import {fetchAllShops, getShops} from 'modules/shops/ducks';
import {createStructuredSelector} from 'reselect';
import withUserRole from 'modules/user/withUserRole';

export default Component =>
  Component
  |> loadingIf(({shops, isAdmin}) => isAdmin && !shops)
  |> lifecycle({
    componentDidMount() {
      const {fetchAllShops, isAdmin} = this.props;

      if (isAdmin) {
        fetchAllShops();
      }
    },
  })
  |> connect(
    createStructuredSelector({
      shops: getShops,
    }),
    {fetchAllShops},
  )
  |> withUserRole;
