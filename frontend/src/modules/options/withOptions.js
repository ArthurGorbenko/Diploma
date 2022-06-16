import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {getOptions, getTotalPages, fetchOptions} from 'modules/options/ducks';
import {createStructuredSelector} from 'reselect';
import {loadingIf} from 'ui/Loading';
import {isNil} from 'ramda';

export default ({entity = null, all = false, disabled = false} = {}) => Component =>
  Component
  |> loadingIf(({options}) => isNil(options))
  |> lifecycle({
    componentDidMount() {
      const {fetchOptions} = this.props;
      fetchOptions(entity, all, disabled);
    },
  })
  |> connect(
    createStructuredSelector({
      options: getOptions,
      total: getTotalPages,
    }),
    {fetchOptions},
  );
