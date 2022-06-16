import React from 'react';
import PropTypes from 'prop-types';
import {Assignment, Airplay, Category, Store, PictureInPicture, AddToPhotos} from '@material-ui/icons';

export const Icon = ({name, ...p}) => {
  let Ico = null;
  if (name === 'categories') {
    Ico = Category;
  } else if (name === 'products') {
    Ico = Assignment;
  } else if (name === 'shops') {
    Ico = Store;
  } else if (name === 'slideshow') {
    Ico = Airplay;
  } else if (name === 'designs') {
    Ico = PictureInPicture;
  } else if (name === 'options') {
    Ico = AddToPhotos;
  }
  return <Ico {...p} />;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
