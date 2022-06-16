import {withProps} from 'recompose';
import withCategory from '../withCategory';
import Component from './Component';

export default Component |> withCategory |> withProps(({match}) => ({categoryId: match.params.id}));
