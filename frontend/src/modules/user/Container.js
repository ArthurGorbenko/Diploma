import React from 'react';
import {lifecycle, branch, renderComponent} from 'recompose';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import Loading from 'ui/Loading';
import {credentials} from 'config/api';
import {fetchUser, getUUID, getLicense} from './ducks';

export default Loading
  |> branch(
    ({uuid, license}) => uuid && license,
    renderComponent(() => <Redirect to="/" />),
  )
  |> lifecycle({
    componentDidMount() {
      const {history, match, fetchUser} = this.props;
      let {license, uuid} = match.params;

      if (!license || !uuid || uuid === 'none') {
        const creds = credentials.get();
        license = creds.license;
        uuid = creds.uuid;

        if (!license || !uuid) {
          history.push('/support');
        }
      }

      fetchUser(uuid, license);
    },
  })
  |> connect(
    createStructuredSelector({
      uuid: getUUID,
      license: getLicense,
    }),
    {fetchUser},
  );
