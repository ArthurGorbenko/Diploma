import {branch, renderComponent} from 'recompose';
import Empty from 'ui/Empty';
import Component from './Component';

export default Component |> branch(({totalPages}) => !totalPages, renderComponent(Empty));
