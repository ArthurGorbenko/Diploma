import {isNil, isEmpty} from 'ramda';

export const getOptionValues = options => {
  const values = {};
  if (isNil(options) || isEmpty(options)) return values;
  options.forEach(({id: option_id, value}) => {
    values[option_id] = value;
  });
  return values;
};

export const setOptionValues = (options, values) =>
  options
    ? options.forEach(
        ({id, value}) => !isNil(value) && values.option_values.push({option_id: id, value}),
      )
    : null;
