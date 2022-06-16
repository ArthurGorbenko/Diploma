import React from 'react';
import {styled, Button as Btn, CardActions, Grid} from '@material-ui/core';
import BackIcon from '@material-ui/icons/KeyboardBackspace';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import ViewIcon from '@material-ui/icons/Visibility';
import LabelIcon from '@material-ui/icons/Label';
import CopyIcon from '@material-ui/icons/FileCopy';
import DoneIcon from '@material-ui/icons/Done';
import {blue} from '@material-ui/core/colors';
import {Link} from 'react-router-dom';
import {useMessage} from 'lib/intl/hooks';
import {colors} from 'theme/colors';

export const Badge = styled('span')({
  display: 'inline-block',
  marginLeft: 7,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  width: 19,
  height: 19,
  lineHeight: '21px',
  borderRadius: '50%',
  textAlign: 'center',
  color: colors.blueDarken,
  fontWeight: 'bold',
  fontSize: 13,
  marginTop: -1,
});

export const Button = styled(
  ({showif = true, children, badge = null, ...p}) =>
    showif && (
      <Btn
        component={p.to ? Link : undefined}
        color="primary"
        variant="contained"
        disableElevation
        {...p}>
        {children || ''}
        {badge !== null && <Badge>{badge}</Badge>}
      </Btn>
    ),
)(({color = 'primary', variant = 'contained'}) => {
  let styles = {};
  if (color === 'primary' && variant === 'outlined') {
    styles = {
      ...styles,
      borderColor: colors.blueDarken,
      color: colors.blueDarken,
      '&:hover': {
        borderColor: colors.blueDarken,
      },
    };
  }
  if (color === 'primary' && variant === 'contained') {
    styles = {
      ...styles,
      backgroundColor: colors.blueDarken,
      '&:hover': {
        backgroundColor: colors.blueDarken,
      },
    };
  }
  if (color === 'secondary' && variant === 'outlined') {
    styles = {
      ...styles,
      borderColor: colors.orange,
      color: colors.orange,
      '&:hover': {
        borderColor: colors.orange,
      },
    };
  }
  if (color === 'secondary' && variant === 'contained') {
    styles = {
      ...styles,
      backgroundColor: colors.orange,
      '&:hover': {
        backgroundColor: colors.orange,
      },
    };
  }

  return styles;
});
export const ButtonLarge = styled(p => <Button size="large" {...p} />)({});
export const ButtonSmall = styled(p => <Button size="small" {...p} />)({});

export const View = styled(({children, ...p}) => {
  const t = useMessage();
  return (
    <Button startIcon={<ViewIcon />} {...p}>
      {children || t('view')}
    </Button>
  );
})(({variant}) => ({
  backgroundColor: variant === 'contained' ? blue[500] : null,
  '&:hover': {
    backgroundColor: variant === 'contained' ? blue[700] : null,
  },
}));

export const Edit = styled(({children, ...p}) => {
  const t = useMessage();
  return (
    <Button startIcon={<EditIcon />} {...p}>
      {children || t('edit')}
    </Button>
  );
})({});

export const Labels = styled(p => {
  const t = useMessage();
  return (
    <Button startIcon={<LabelIcon />} {...p}>
      {t('labels.list')}
    </Button>
  );
})({});

export const Submit = styled(({children, isDisabled = false, ...p}) => {
  const t = useMessage();
  return (
    <ButtonLarge
      type="submit"
      disabled={isDisabled}
      variant={isDisabled ? 'text' : 'contained'}
      startIcon={<DoneIcon />}
      {...p}>
      {children || t(isDisabled ? 'media.required' : 'submit')}
    </ButtonLarge>
  );
})({});

export const Cancel = styled(({children, ...p}) => {
  const t = useMessage();
  return (
    <ButtonLarge startIcon={<ClearIcon />} color="secondary" {...p}>
      {children || t('cancel')}
    </ButtonLarge>
  );
})({});

export const Back = styled(({children, ...p}) => {
  const t = useMessage();
  return (
    <ButtonSmall variant="outlined" color="default" startIcon={<BackIcon />} {...p}>
      {children || t('back')}
    </ButtonSmall>
  );
})({
  marginTop: 15,
  marginBottom: 25,
});

export const Delete = styled(({children, ...p}) => {
  const t = useMessage();
  return (
    <Button startIcon={<ClearIcon />} color="secondary" {...p}>
      {children || t('delete')}
    </Button>
  );
})({});

export const Create = styled(p => (
  <Button variant="outlined" color="secondary" startIcon={<AddIcon />} {...p} />
))({});

export const Actions = styled(CardActions)({
  padding: 15,
  '& a:not(:last-child)': {
    marginRight: 17,
  },
});

export const FormActions = styled(p => <Grid container item xs={12} justify="space-between" {...p} />)({
  marginTop: 12,
});

export const Copy = styled(({children, ...p}) => {
  const t = useMessage();
  return (
    <ButtonSmall variant="outlined" startIcon={<CopyIcon />} {...p}>
      {children || t('copy')}
    </ButtonSmall>
  );
})({
  marginTop: 7,
});
