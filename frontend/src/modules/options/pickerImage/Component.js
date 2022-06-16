import React from 'react';
import PropTypes from 'prop-types';
// import {useMessage} from 'lib/intl/hooks';
import {styled} from '@material-ui/core';
import {Image, colors} from 'theme';
import {getImage} from '../config';

export const Flex = styled('div')({display: 'flex', flexWrap: 'wrap'});
export const Img = styled(Image)(({active}) => ({
  marginRight: 12,
  marginBottom: 12,
  borderRadius: 4,
  maxWidth: 200,
  cursor: 'pointer',
  border: active ? `5px solid ${colors.orange}` : '5px solid #eee',
  boxShadow: active ? '0 5px 4px -3px rgba(0, 0, 0, 0.3)' : null,
  transform: active ? 'scale(1.1)' : null,
  transition: 'all 0.25s',
}));

const PickerImage = ({option: {supported_values, machine_name, design}, onClick, active}) => (
  <Flex>
    {supported_values.map(v => (
      <Img
        key={v}
        src={getImage(design.machine_name, machine_name, v)}
        active={active === v ? 1 : 0}
        onClick={() => onClick(v)}
      />
    ))}
  </Flex>
);

PickerImage.propTypes = {
  option: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
};

export default PickerImage;
