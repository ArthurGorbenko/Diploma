import {withProps} from 'recompose';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';
import {getUserRole, getUUID} from 'modules/user/ducks';

export default Component =>
  Component
  |> withProps(({userRole}) => ({
    isAdmin: userRole === 'admin',
    isClient: userRole === 'client',
  }))
  |> loadingIf(({userRole}) => !userRole)
  |> connect(
    createStructuredSelector({
      userRole: getUserRole,
      uuid: getUUID,
    }),
  );
