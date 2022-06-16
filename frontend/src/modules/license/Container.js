import {prop} from 'ramda';
import Component from './Component';
import withExpirationStatus from './withExpirationStatus';
import {branch} from 'recompose';
import withUserRole from 'modules/user/withUserRole';

export default Component |> branch(prop('isClient'), withExpirationStatus) |> withUserRole;
