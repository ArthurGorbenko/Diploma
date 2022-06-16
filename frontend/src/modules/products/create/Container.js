import {prop} from 'ramda';
import Component from './Component';
import withCategories from 'modules/categories/withCategories';
import {branch} from 'recompose';
import withUserRole from 'modules/user/withUserRole';

export default Component |> branch(prop('isAdmin'), withCategories) |> withUserRole;
