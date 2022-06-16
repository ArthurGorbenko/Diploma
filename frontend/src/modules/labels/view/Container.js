import Component from './Component';
import withLabel from 'modules/labels/withLabel';
import {withProps, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import withModal from 'ui/Modal/withModal';
import {deleteLabel} from 'modules/labels/ducks';
import withCategoryId from '../withCategoryId';

export default Component
  |> withHandlers({
    handleModalConfirm: ({idRemoved, deleteLabel, setModalOpen, history, categoryId}) => () => {
      deleteLabel(idRemoved);
      setModalOpen(false);
      history.push(`/categories/${categoryId}/labels`);
    },
  })
  |> withModal
  |> withLabel
  |> withProps(({match}) => ({currentId: match.params.labelId}))
  |> withCategoryId
  |> connect(null, {deleteLabel});
