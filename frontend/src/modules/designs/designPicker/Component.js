import React from 'react';
import PropTypes from 'prop-types';
import {useMessage} from 'lib/intl/hooks';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField} from '@material-ui/core';

const DesignPicker = ({designsForChange, handleDesign, designs, multiple = false, label = 'pick'}) => {
  const t = useMessage('designs');
  return (
    <Autocomplete
      multiple={multiple}
      defaultValue={designsForChange}
      onChange={handleDesign}
      getOptionSelected={(opt, value) => opt.id === value.id}
      id="designSelect"
      options={designs}
      getOptionLabel={({label}) => label}
      style={{width: '100%'}}
      renderInput={params => <TextField {...params} label={t(label)} variant="outlined" />}
    />
  );
};

DesignPicker.propTypes = {
  designsForChange: PropTypes.any,
  handleDesign: PropTypes.func.isRequired,
  designs: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
  label: PropTypes.string,
};

export default DesignPicker;
