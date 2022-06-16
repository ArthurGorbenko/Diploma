import {isEmpty} from 'ramda';
import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {fetchLabel, getItemById} from 'modules/labels/ducks';
import {loadingIf} from 'ui/Loading';

export default Component =>
  Component
  |> loadingIf(({label}) => isEmpty(label))
  |> lifecycle({
    componentDidMount() {
      const {label, fetchLabel, currentId} = this.props;

      if (isEmpty(label)) {
        fetchLabel(currentId);
      }
    },
  })
  |> connect(
    (state, props) => ({
      label: getItemById(state, props),
    }),
    {fetchLabel},
  );
