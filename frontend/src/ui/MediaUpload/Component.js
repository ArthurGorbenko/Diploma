import React from 'react';
import PropTypes from 'prop-types';
import {Button, Box, styled} from '@material-ui/core';
import {useMessage} from 'lib/intl/hooks';
import {Image, Video} from 'theme';
import {Alert} from 'ui/Alert';
import Loading from 'ui/Loading';
import PublishIcon from '@material-ui/icons/Publish';

const Label = styled('label')({
  marginBottom: 20,
  display: 'inline-block',
});

const MediaUpload = ({
  handleFileUpload,
  fileError,
  isLoading,
  allowedTypes,
  accept = 'both',
  fileId,
  src,
  type,
}) => {
  const t = useMessage();

  return (
    <Box>
      <input
        accept={allowedTypes.map(el => (el.match('svg') ? '.svg' : `.${el.split('/')[1]}`))}
        id={fileId}
        type="file"
        onChange={handleFileUpload}
        hidden
        className="fileUploadInput"
      />
      <Label htmlFor={fileId}>
        <Button
          startIcon={<PublishIcon />}
          variant="outlined"
          color="primary"
          component="span"
          margin="normal"
          className="uploadBtn">
          {t(`media.upload.${accept}`)}
        </Button>
      </Label>
      {isLoading ? <Loading size={35} /> : null}
      {src ? type === 'image' ? <Image src={src} /> : <Video src={src} controls /> : null}
      <Alert messageId={fileError} />
    </Box>
  );
};

MediaUpload.propTypes = {
  handleFileUpload: PropTypes.func.isRequired,
  allowedTypes: PropTypes.array.isRequired,
  isLoading: PropTypes.number.isRequired,
  fileId: PropTypes.string.isRequired,
  fileError: PropTypes.string,
  accept: PropTypes.string.isRequired,
  src: PropTypes.any.isRequired,
  type: PropTypes.any.isRequired,
};

export default MediaUpload;
