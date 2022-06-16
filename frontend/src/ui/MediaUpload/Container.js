import {withHandlers, lifecycle, withState, withProps} from 'recompose';
import Component from './Component';
import {connect} from 'react-redux';
import {uploadMedia, clearMedia, setMedia, getFiles, getLoading} from './ducks';
import {createStructuredSelector} from 'reselect';
import {injectIntl} from 'react-intl';
import {toggleAlert} from 'ui/Alert/ducks';
import {isEmpty} from 'ramda';
import {asset} from 'config/api';

export default Component
  |> lifecycle({
    componentDidMount() {
      const {setMedia, fileId, defaultValue} = this.props;
      setMedia(fileId, '');
      if (defaultValue.filename) {
        setMedia(fileId, defaultValue);
      }
    },
  })
  |> withHandlers({
    handleFileUpload: ({uploadMedia, setFileError, allowedTypes, toggleAlert, onFileUpload}) => e => {
      const file = e.target.files[0];
      const fileId = e.target.id;
      const {type} = file;
      const sizeGB = file.size / Math.pow(1024, 3);
      if (!allowedTypes.includes(type)) {
        setFileError('media.error.extension');
        toggleAlert(true);
        e.target.value = null;
      } else if (sizeGB >= 1.5) {
        setFileError('media.error.size');
        toggleAlert(true);
        e.target.value = null;
      } else {
        uploadMedia(file, fileId, onFileUpload);
        setFileError('');
      }
    },
  })
  |> withProps(({accept, files, fileId}) => {
    const p = {};
    p.src = '';
    p.type = '';
    if (!isEmpty(files) && fileId && files[fileId]) {
      p.src = asset(files[fileId].filename);
      p.type = files[fileId].type;
    }

    const videoFormats = ['video/webm', 'video/mp4'];
    const imageFormats = [
      'image/svg+xml',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/png',
    ];
    if (accept === 'image') {
      p.allowedTypes = imageFormats;
    }
    if (accept === 'video') {
      p.allowedTypes = videoFormats;
    }
    if (accept === 'both') {
      p.allowedTypes = [...imageFormats, ...videoFormats];
    }

    return p;
  })
  |> injectIntl
  |> withState('fileError', 'setFileError', '')
  |> connect(createStructuredSelector({files: getFiles, isLoading: getLoading}), {
    uploadMedia,
    clearMedia,
    toggleAlert,
    setMedia,
  });
