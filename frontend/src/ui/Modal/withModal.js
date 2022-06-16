import {withHandlers, withState} from 'recompose';
import {connect} from 'react-redux';
import {setModalOpen} from './ducks';

export default Component =>
  Component
  |> withHandlers({
    handleModalOpen: ({setModalOpen, setIdRemoved}) => (event, id) => {
      setModalOpen(true);
      setIdRemoved(id);
    },
  })
  |> withState('idRemoved', 'setIdRemoved', null)
  |> connect(null, {setModalOpen});
