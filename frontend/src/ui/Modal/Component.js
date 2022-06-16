import React from 'react';
import PropTypes from 'prop-types';
import {Modal as ModalTheme, Fade, Backdrop, styled, Box} from '@material-ui/core';
import {useMessage} from 'lib/intl/hooks';
import {Title, Submit, Cancel, FormActions} from 'theme';

const ModalConfirm = styled(p => <ModalTheme {...p} />)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Paper = styled(Box)({
  borderRadius: 4,
  backgroundColor: 'white',
  padding: '16px 32px 24px',
});

const Modal = ({handleClose, handleModalConfirm, modalOpen}) => {
  const t = useMessage();
  return (
    <ModalConfirm
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={modalOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 320,
      }}>
      <Fade in={modalOpen}>
        <Paper>
          <Title id="transition-modal-title" style={{marginBottom: 20}}>
            {t('modal.confirmTitle')}
          </Title>
          <FormActions>
            <Cancel onClick={handleClose} color="default" size="medium" />
            <Submit className="delete-confirm" onClick={handleModalConfirm} style={{marginLeft: 25}}>
              {t('delete')}
            </Submit>
          </FormActions>
        </Paper>
      </Fade>
    </ModalConfirm>
  );
};

Modal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
};

export default Modal;
