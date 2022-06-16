import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {getDesigns, getTotalPages, fetchDesigns} from 'modules/designs/ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';

export default ({all = false} = {}) => Component =>
  Component
  |> loadingIf(({designs}) => !designs)
  |> lifecycle({
    componentDidMount() {
      const {fetchDesigns} = this.props;
      fetchDesigns(all);
    },
  })
  |> connect(
    createStructuredSelector({
      designs: getDesigns,
      total: getTotalPages,
    }),
    {fetchDesigns},
  );
