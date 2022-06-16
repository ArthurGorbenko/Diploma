import React from 'react';
import PropTypes from 'prop-types';
import {useMessage} from 'lib/intl/hooks';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Paper,
  Select,
  Grid,
  MenuItem,
  TextField,
  Checkbox,
  Typography,
  FormControlLabel,
  styled,
} from '@material-ui/core';
import {MediaUpload} from 'ui/MediaUpload';
import {IMaskMixin} from 'react-imask';
import {PickerImage} from '../pickerImage';
import {Delete, Title} from 'theme';

const MaskedStyledInput = IMaskMixin(({ref, id, ...p}) => (
  <TextField {...p} id={id} fullWidth innerRef={ref} />
));

const FullWidth = styled('div')({
  width: '100%',
  flex: 1,
  marginTop: 15,
});

const OptionsPicker = ({currentOptions, handleOptionToValue, handleModalOpen}) => {
  const t = useMessage();
  return (
    <>
      <Grid container style={{margin: '20px 0'}}>
        {currentOptions.map(opt => (
          <Grid id={opt.id} key={opt.id} item xs={12}>
            <Paper style={{padding: 20, marginTop: 20}}>
              <Title style={{marginBottom: 6}}>{t(`options.labels.${opt.translation_key}`)}</Title>
              {
                {
                  string: (
                    <TextField
                      id={`input${opt.id}`}
                      onChange={e => handleOptionToValue(e.target.value, opt.id)}
                      label="any string"
                      fullWidth
                      defaultValue={opt.value || ''}
                      autoFocus
                    />
                  ),
                  integer: (
                    <MaskedStyledInput
                      mask={Number}
                      unmask="typed"
                      id={`input${opt.id}`}
                      onAccept={value => handleOptionToValue(value, opt.id)}
                      label="any number"
                      scale={0}
                      value={opt.value || ''}
                      inputProps={{
                        inputMode: 'numeric',
                      }}
                      autoFocus
                    />
                  ),
                  double: (
                    <MaskedStyledInput
                      mask={Number}
                      id={`input${opt.id}`}
                      unmask="typed"
                      onAccept={value => handleOptionToValue(value, opt.id)}
                      label="any float"
                      scale={1}
                      radix="."
                      value={opt.value || ''}
                      inputProps={{
                        inputMode: 'decimal',
                      }}
                      autoFocus
                    />
                  ),
                  boolean: (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={opt.value || false}
                          onChange={({target: {checked}}) => handleOptionToValue(checked, opt.id)}
                        />
                      }
                      label={t('disabled')}
                    />
                  ),
                  multi_select: (
                    <Autocomplete
                      multiple
                      value={opt.value || []}
                      onChange={(_, newValue) => handleOptionToValue(newValue, opt.id)}
                      id={opt && opt.translation_key}
                      options={opt ? opt.supported_values : []}
                      style={{width: '100%'}}
                      renderInput={params => (
                        <TextField {...params} label="multiselect" variant="outlined" />
                      )}
                    />
                  ),
                  image_link: (
                    <MediaUpload
                      onFileUpload={({filename}) => handleOptionToValue(filename, opt.id)}
                      accept="image"
                      defaultValue={{filename: opt.value, type: 'image'}}
                      fileId={`option${opt.id}`}
                    />
                  ),
                  video_link: (
                    <MediaUpload
                      onFileUpload={({filename}) => handleOptionToValue(filename, opt.id)}
                      accept="video"
                      defaultValue={{filename: opt.value, type: 'video'}}
                      fileId={`option${opt.id}`}
                    />
                  ),
                  select:
                    opt.renderId === 'image' ? (
                      <PickerImage value={opt.value || ''} option={opt} onPick={handleOptionToValue} />
                    ) : (
                      <Select
                        fullWidth
                        id="optionSelect"
                        value={opt.value || ''}
                        onChange={({target: {value}}) => handleOptionToValue(value, opt.id)}>
                        {opt &&
                          opt.supported_values &&
                          opt.supported_values.map(el => (
                            <MenuItem key={el} value={el}>
                              {el}
                            </MenuItem>
                          ))}
                      </Select>
                    ),
                }[opt.type]
              }
              {opt && opt.default_value && opt.renderId !== 'image' && (
                <Typography style={{opacity: 0.8, marginTop: 9}} variant="caption">
                  {t('options.default')} : {opt.default_value}
                </Typography>
              )}
              <FullWidth>
                <Delete onClick={e => handleModalOpen(e, opt)} variant="outlined" size="small">
                  {t('options.delete')}
                </Delete>
              </FullWidth>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

OptionsPicker.propTypes = {
  currentOptions: PropTypes.array,
  handleOptionToValue: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
};

export default OptionsPicker;
