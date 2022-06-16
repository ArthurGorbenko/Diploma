import {withStateHandlers, withProps, lifecycle} from 'recompose';
import {isEmpty} from 'ramda';

export default ({state = 'currentOptions', actionPrefix = ''} = {}) => Component => {
  return (
    Component
    |> lifecycle({
      componentDidUpdate(prev) {
        if (
          prev.entityOptions !== this.props.entityOptions &&
          this.props.entityOptions.length === 1 &&
          actionPrefix !== 'Slide'
        ) {
          this.props[`clearState${actionPrefix}`]();
          this.props.addOption(this.props.entityOptions[0]);
        }
      },
    })
    |> withStateHandlers(
      ({defaultOptions, entityOptions}) => {
        let initialState = [];
        if (!defaultOptions) return {[state]: initialState};
        if (!isEmpty(defaultOptions)) {
          initialState = entityOptions
            .filter(({id}) => defaultOptions.some(({option_id}) => id === +option_id))
            .map(el => ({
              ...el,
              value: defaultOptions.filter(({option_id}) => option_id === el.id)[0].value,
            }));
        }
        return {[state]: initialState};
      },
      {
        [`addOption${actionPrefix}`]: s => option => ({
          [state]: [...s[state], option],
        }),
        [`setOptionValue${actionPrefix}`]: s => (value, id) => ({
          [state]: s[state].map(el => (el.id === id ? {...el, value} : el)),
        }),
        [`removeOption${actionPrefix}`]: s => id => ({
          [state]: s[state].map(el => (el.id === id ? null : el)).filter(el => el),
        }),
        [`filterByDesigns${actionPrefix}`]: s => designIds => ({
          [state]: s[state].filter(({design}) => designIds.some(el => el === design.id)),
        }),
        [`clearState${actionPrefix}`]: () => () => ({
          [state]: [],
        }),
      },
    )
    |> withProps(({options, slideOptions, valuesForChange}) => ({
      defaultOptions: valuesForChange
        ? actionPrefix === 'Slide'
          ? valuesForChange.slide_data.option_values
          : valuesForChange.option_values
        : [],
      entityOptions: actionPrefix === 'Slide' ? slideOptions : options,
    }))
  );
};
