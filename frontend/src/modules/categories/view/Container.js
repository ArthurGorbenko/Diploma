import Component from './Component';
import {withProps, withHandlers, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import withModal from 'ui/Modal/withModal';
import withCategory from '../withCategory';
import {fetchAllLabels, setCategoryId, getLabels} from 'modules/labels/ducks';
import {deleteCategory} from '../ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';

export default Component
  |> withHandlers({
    handleModalConfirm: ({idRemoved, deleteCategory, setModalOpen, history}) => () => {
      deleteCategory(idRemoved);
      setModalOpen(false);
      history.push('/categories');
    },
  })
  |> loadingIf(({labels}) => !labels)
  |> lifecycle({
    componentDidMount() {
      const {fetchAllLabels, categoryId, setCategoryId} = this.props;
      setCategoryId(categoryId);
      fetchAllLabels();
    },
  })
  |> withModal
  |> withCategory
  |> withProps(({match}) => ({categoryId: +match.params.id}))
  |> connect(
    createStructuredSelector({
      labels: getLabels,
    }),
    {deleteCategory, fetchAllLabels, setCategoryId},
  );
