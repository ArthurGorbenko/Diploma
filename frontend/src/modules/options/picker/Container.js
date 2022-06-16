import Component from './Component';
import {withHandlers, withProps, lifecycle} from 'recompose';
import {getRenderId} from '../config';
import {last} from 'ramda';

export default Component
  |> lifecycle({
    componentDidUpdate(prevProps) {
      if (
        prevProps.currentOptions.length < this.props.currentOptions.length &&
        this.props.currentOptions.length > 1
      ) {
        document
          .getElementById(last(this.props.currentOptions).id)
          .scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    },
  })
  |> withProps(({currentOptions}) => ({
    currentOptions: currentOptions.map(opt => ({...opt, renderId: getRenderId(opt)})),
  }))
  |> withHandlers({
    handleOptionToValue: ({setOptionValue}) => (value, id) => {
      setOptionValue(value, id);
    },
  });
