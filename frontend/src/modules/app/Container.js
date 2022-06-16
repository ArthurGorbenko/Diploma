import {lifecycle} from 'recompose';
import Component from './Component';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {getId, getUUID, getLicense, setUser, getUserRole, fetchUser} from 'modules/user/ducks';
import {credentials, DEFAULT_PAGE} from 'config/api';

export default Component
  |> lifecycle({
    componentDidMount() {
      const {
        id,
        setUser,
        fetchUser,
        history: {location, push},
      } = this.props;

      if (id) return;

      let uuid;
      let license;
      let role;

      // reload credentials from LS directly here to avoid url redirection
      if (!this.props.uuid || !this.props.license) {
        const C = credentials.get();

        uuid = C.uuid;
        license = C.license;
        role = C.role;
      }

      if (!id) {
        fetchUser(uuid, license);
      }

      if (uuid && license) {
        setUser({uuid, license, role});
      } else {
        push('/auth/none/none');
        return;
      }
      if (!location.pathname || location.pathname === '/') {
        push(DEFAULT_PAGE);
      }
    },
  })
  |> connect(
    createStructuredSelector({
      id: getId,
      uuid: getUUID,
      license: getLicense,
      userRole: getUserRole,
    }),
    {
      setUser,
      fetchUser,
    },
  );
