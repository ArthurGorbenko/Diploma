import {withHandlers, withProps} from 'recompose';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {setDesign} from 'modules/options/ducks';
import {isNil, isEmpty} from 'ramda';

export default Component =>
  Component
  |> withHandlers({
    handleDesign: ({setFieldValue, setDesign}) => (e, designs) => {
      if (Array.isArray(designs)) {
        const ids = designs.map(({id}) => id);
        setFieldValue('design_ids', ids);
        if (!isEmpty(designs)) setDesign(ids);
      } else if (!isNil(designs)) {
        setFieldValue('design_id', designs && designs.id);
        setDesign([designs.id]);
      } else {
        setFieldValue('design_id', '');
      }
    },
  })
  |> withProps(({designs, valuesForChange, intl: {formatMessage}}) => {
    const d = {};
    d.designs = designs
      .filter(({disabled}) => disabled === false)
      .map(({machine_name, id}) => ({
        id,
        label: formatMessage({id: `designs.labels.${machine_name}`}),
      }));
    if (!valuesForChange) return d;

    if (Object.prototype.hasOwnProperty.call(valuesForChange, 'designs')) {
      d.designsForChange = valuesForChange.designs.map(({machine_name, id}) => ({
        id,
        label: formatMessage({id: `designs.labels.${machine_name}`}),
      }));
    }
    if (Object.prototype.hasOwnProperty.call(valuesForChange, 'design')) {
      d.designsForChange = {
        id: valuesForChange.design.id,
        label: formatMessage({id: `designs.labels.${valuesForChange.design.machine_name}`}),
      };
    }
    return d;
  })
  |> connect(null, {setDesign})
  |> injectIntl;
