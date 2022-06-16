import {withProps} from 'recompose';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {getExpirationDate} from 'modules/user/ducks';
import {loadingIf} from 'ui/Loading';
import dayjs from 'dayjs';

export default Component =>
  Component
  |> withProps(({expiration_date}) => ({
    isExpiringSoon: dayjs(expiration_date).diff(dayjs(), 'day') < 10,
  }))
  |> loadingIf(({expiration_date}) => !expiration_date)
  |> connect(
    createStructuredSelector({
      expiration_date: getExpirationDate,
    }),
  );
