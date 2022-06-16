import React from 'react';
import PropTypes from 'prop-types';
import {Tiles, Wrapper, Tile, Image} from 'theme';
import {GridListTileBar} from '@material-ui/core';
import {asset} from 'config/api';

export const Gallery = ({tiles}) => {
  return (
    <Tiles cellheight={400}>
      <Wrapper style={{width: '100%'}} cols={2}>
        {tiles.map(({name, image_link}) => (
          <Tile key={name} style={{background: 'none', width: 'auto'}}>
            <Image src={asset(image_link)} alt={name} style={{maxHeight: 180, width: 'auto'}} />
            <GridListTileBar title={name} />
          </Tile>
        ))}
      </Wrapper>
    </Tiles>
  );
};

Gallery.propTypes = {
  tiles: PropTypes.array.isRequired,
};

export default Gallery;
