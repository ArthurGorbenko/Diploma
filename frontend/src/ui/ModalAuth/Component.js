import React from 'react';
import PropTypes from 'prop-types';
import {Modal as ModalTheme, Fade, Backdrop, styled, Box, TextField} from '@material-ui/core';
import {useMessage} from 'lib/intl/hooks';
import {ErrorMessage} from 'ui/ErrorMessage';
import {Title} from 'theme';

const Modal = styled(p => <ModalTheme {...p} />)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Paper = styled(Box)({
  borderRadius: 4,
  backgroundColor: '#fff',
  padding: '16px 32px 24px',
});

const Shadow = styled(Backdrop)({
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
});

const ModalAuth = ({pin, setPin, isAuth}) => {
  const t = useMessage('auth');

  return (
    <Modal
      open={!isAuth && !!pin}
      closeAfterTransition
      BackdropComponent={Shadow}
      BackdropProps={{
        timeout: 400,
      }}>
      <Fade in={!isAuth && !!pin}>
        <Paper>
          <Title id="transition-modal-title" style={{marginBottom: 20}}>
            {t('enterCode')}
          </Title>
          <TextField
            variant="outlined"
            fullWidth
            autoFocus
            onChange={e => setPin(e.target.value)}
            inputProps={{
              inputMode: 'numeric',
            }}
          />
          <ErrorMessage error="auth.invalid" />
        </Paper>
      </Fade>
    </Modal>
  );
};

ModalAuth.propTypes = {
  pin: PropTypes.number.isRequired,
  setPin: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired,
};

export default ModalAuth;
