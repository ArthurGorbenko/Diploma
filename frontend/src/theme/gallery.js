import React from 'react';
import {styled, GridList, GridListTile} from '@material-ui/core';

export const Tiles = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
});

export const Wrapper = styled(p => <GridList {...p} />)({
  transform: 'translateZ(0)',
});

export const Tile = styled(p => <GridListTile {...p} />)({
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
});
