import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import {useMessage} from 'lib/intl/hooks';
import {Snackbar, styled} from '@material-ui/core';
import PropTypes from 'prop-types';

const ToastMessage = styled(p => <Snackbar {...p} />)({
  bottom: '15%',
  left: '60%',
});

const Alert = ({isVisible, handleCloseAlert, messageId}) => {
  const t = useMessage();
  return (
    <ToastMessage open={isVisible} autoHideDuration={4000} onClose={handleCloseAlert}>
      <MuiAlert onClose={handleCloseAlert} severity="error" elevation={1} variant="filled">
        {t(messageId || 'default')}
      </MuiAlert>
    </ToastMessage>
  );
};

Alert.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleCloseAlert: PropTypes.func.isRequired,
  messageId: PropTypes.string.isRequired,
};

export default Alert;
