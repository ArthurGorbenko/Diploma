import Component from './Component';
import {withProps} from 'recompose';
import withLabel from '../withLabel';

export default Component |> withLabel |> withProps(({match}) => ({currentId: match.params.labelId}));
