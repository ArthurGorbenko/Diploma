/* eslint-disable react/prop-types,react/jsx-no-duplicate-props */ // todo
import React from 'react';
import {withProps} from 'recompose';
import {TextField, Grid, InputLabel, styled, InputAdornment} from '@material-ui/core';
import {useMessage} from 'lib/intl/hooks';
import {ErrorMessage} from 'ui/ErrorMessage';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {IMaskMixin} from 'react-imask';

export const Label = styled(InputLabel)({
  marginBottom: 9,
});

// Ref : https://material-ui.com/api/text-field/
export const Input = ({id, fullWidth = true, labelId, error, xs = 12, ...props}) => {
  const t = useMessage();

  return (
    <Grid item xs={xs}>
      <TextField
        id={id}
        label={t(labelId)}
        variant="outlined"
        type="text"
        fullWidth={fullWidth}
        helperText={error ? t(error) : undefined}
        error={!!error}
        {...props}
      />
    </Grid>
  );
};

export const MaskedInput = IMaskMixin(({ref, ...props}) => <Input {...props} innerRef={ref} />);

export const Price =
  IMaskMixin(({ref, currency = '€', ...props}) => (
    <Input
      InputProps={{
        endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
      }}
      inputProps={{
        inputMode: 'decimal',
      }}
      innerRef={ref}
      {...props}
    />
  ))
  |> withProps({
    mask: Number,
    scale: 2,
    normalizeZeros: false,
    // padFractionalZeros: true,
  });

export const Select = ({fullWidth = true, labelId, error, xs = 12, ...props}) => {
  const t = useMessage();

  return (
    <Grid item xs={xs}>
      <Autocomplete
        openOnFocus
        fullWidth={fullWidth}
        renderInput={params => <TextField {...params} label={t(labelId)} variant="outlined" />}
        {...props}
      />
      {error && <ErrorMessage error={error} />}
    </Grid>
  );
};
