import Component from './Component';
import {withProps, withHandlers} from 'recompose';
import {isEmpty, filter, propEq} from 'ramda';
import {getRenderId} from '../config';

export default Component
  |> withHandlers({
    handleAddOption: ({addOption, options, currentOptions}) => optId => {
      const option = options.find(({id}) => optId === id);
      if (isEmpty(filter(propEq('id', optId), currentOptions))) {
        addOption(option);
      } else {
        document.getElementById(optId).scrollIntoView({behavior: 'smooth', block: 'center'});
        if (option.type === 'string' || option.type === 'number' || option.type === 'double')
          document.getElementById(`input${optId}`).focus();
      }
    },
  })
  |> withProps(({optionValues, options, showDefault = true}) => ({
    optionsToRender:
      !isEmpty(options) && optionValues
        ? options
            .filter(({id}) => showDefault || optionValues[id])
            .map(opt => {
              opt = {
                ...opt,
                isDefault: true,
                value: opt.default_value || 'ø',
                renderId: getRenderId(opt),
              };

              if (Object.keys(optionValues).some(el => opt.id === +el) && optionValues[opt.id]) {
                opt.value = optionValues[opt.id];
                opt.isDefault = false;
              }

              return opt;
            })
        : [],
  }));
