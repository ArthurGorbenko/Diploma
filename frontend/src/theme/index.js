import React, {Fragment} from 'react';
import {
  styled,
  Typography,
  Paper,
  Grid,
  TableCell,
  Card,
  ListItem,
  Divider,
  List as ListTheme,
  Avatar,
  Chip,
} from '@material-ui/core';
import {colors} from './colors';

export * from './button';
export * from './gallery';
export * from './colors';
export * from './form';

export const Video = styled('video')({
  width: '100%',
  maxHeight: 650,
  display: 'block',
});

export const Image = styled('img')(({mode = false}) => ({
  maxWidth: '100%',
  maxHeight: mode === 'preview' ? 125 : 750,
  width: mode === 'preview' ? 'auto' : null,
  borderRadius: mode === 'preview' ? 5 : null,
  objectFit: 'contain',
  display: 'block',
}));

export const Thumbnail = styled('img')({
  height: 100,
});

export const Title = styled(p => <Typography variant="h5" {...p} />)({
  '& span': {
    fontSize: '0.8em',
    color: '#666',
  },
});

export const FormTitle = styled(Title)({
  padding: 24,
  marginBottom: 12,
});

export const List = styled(ListTheme)(({shrink = false}) => ({
  padding: 20,
  paddingTop: 0,
  paddingLeft: shrink ? 0 : 20,
}));

export const ListText = styled(({children, ...p}) => (
  <Fragment>
    <ListItem disableGutters>
      <Typography component="div" variant="body1" {...p}>
        {children}
      </Typography>
    </ListItem>
    <Divider />
  </Fragment>
))(({shrink = false}) => ({
  paddingTop: shrink ? 5 : 15,
  paddingBottom: shrink ? 5 : 15,
  fontWeight: 'bold',
  fontSize: shrink ? 14 : 16,
  '& i': {
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
}));

export const PaperStyled = styled(p => <Paper elevation={2} {...p} />)({
  position: 'relative',
  padding: 10,
  paddingBottom: 12,
});

export const ListHeader = styled(p => (
  <Grid container justify="space-between" alignItems="center" {...p} />
))({
  marginTop: 15,
  marginBottom: 25,
});

export const ListPanel = styled(({children, ...p}) => (
  <TableCell colSpan="12" {...p}>
    <Card variant="outlined">{children}</Card>
  </TableCell>
))({
  padding: 0,
  paddingBottom: 25,
  '& .MuiCard-root': {
    borderTop: 0,
    borderRadius: '0 0 3px 3px',
  },
});

export const Link = styled('a')({
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
  hyphens: 'auto',
  display: 'inline-block',
  fontWeight: 'normal',
});

export const TableCellHeader = styled(TableCell)({
  textTransform: 'uppercase',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  opacity: 0.5,
});

export const Code = styled(({children, ...p}) => <code {...p}>{children}</code>)({
  display: 'inline-block',
  padding: 7,
  border: '1px dashed #bbb',
  borderRadius: 4,
  color: '#333',
  background: '#f4f4f4',
  letterSpacing: -0.4,
  wordBreak: 'break-all',
  fontSize: 13,
  fontWeight: 'normal',
});

export const Help = styled(({children, ...p}) => (
  <Chip label={children} variant="outlined" avatar={<Avatar>?</Avatar>} {...p} />
))({
  backgroundColor: 'white',
  borderColor: colors.blue,
  color: colors.blueDarken,
  marginLeft: 18,
  marginTop: 16,
  marginBottom: 18,
  '& .MuiAvatar-circle': {
    backgroundColor: colors.blue,
    color: 'white',
    fontWeight: 'bold',
  },
});
