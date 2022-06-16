import {prop} from 'ramda';
import Component from './Component';
import {withProps, branch} from 'recompose';
import withProduct from '../withProduct';
import withCategories from 'modules/categories/withCategories';
import withUserRole from 'modules/user/withUserRole';
import withOptions from 'modules/options/withOptions';

export default Component
  |> withOptions({entity: 'product', all: true, disabled: true})
  |> branch(prop('isAdmin'), withCategories)
  |> withProduct
  |> withProps(({match}) => ({productId: match.params.id}))
  |> withUserRole;
