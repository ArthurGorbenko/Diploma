import Component from './Component';
import withExpirationStatus from 'modules/license/withExpirationStatus';
import {branch} from 'recompose';
import withUserRole from 'modules/user/withUserRole';
import {connect} from 'react-redux';
import {getUserName} from 'modules/user/ducks';
import {createStructuredSelector} from 'reselect';

export default Component
  |> branch(({isClient}) => isClient, withExpirationStatus)
  |> connect(
    createStructuredSelector({
      shopName: getUserName,
    }),
  )
  |> withUserRole;
