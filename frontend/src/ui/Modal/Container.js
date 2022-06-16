import {withHandlers} from 'recompose';
import Component from './Component';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getModalOpen, setModalOpen} from './ducks';
import {withRouter} from 'react-router';

export default Component
  |> withHandlers({
    handleClose: ({setModalOpen}) => () => {
      setModalOpen(false);
    },
  })
  |> connect(createStructuredSelector({modalOpen: getModalOpen}), {
    setModalOpen,
  })
  |> withRouter;
