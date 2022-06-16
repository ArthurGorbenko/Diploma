import {withHandlers, withState} from 'recompose';
import Component from './Component';

export default Component
  |> withHandlers({
    onClick: ({onPick, setActive, option: {id}}) => value => {
      setActive(value);
      onPick(value, id);
    },
  })
  |> withState('active', 'setActive', ({value, option: {default_value}}) => value || default_value);
