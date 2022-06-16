import React from 'react';
import {Modal as ModalTheme, Fade, Backdrop, styled, Box, Typography} from '@material-ui/core';
import {useMessage} from 'lib/intl/hooks';
import {Offline} from 'react-detect-offline';
import {API_HEALTH_URL} from 'config/api';

const Modal = styled(p => <ModalTheme {...p} />)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Paper = styled(Box)({
  borderRadius: 4,
  backgroundColor: 'white',
  padding: '16px 32px 24px',
});

export const OfflineModal = () => {
  const t = useMessage();
  return (
    <Offline
      polling={{enabled: true, url: API_HEALTH_URL, interval: 4500, timeout: 4500}}
      onChange={status => {
        if (status) {
          // reload page when connection is back
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        }
      }}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{timeout: 500}}>
        <Fade in>
          <Paper>
            <Typography variant="h2" id="transition-modal-title">
              {t('offline.title')}
            </Typography>
            <Typography variant="h6" id="transition-modal-description">
              {t('offline.description')}
            </Typography>
          </Paper>
        </Fade>
      </Modal>
    </Offline>
  );
};

export default OfflineModal;
