import {prop} from 'ramda';
import {withHandlers} from 'recompose';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getIsAuth, getPin, setAuth} from 'modules/user/ducks';
import {renderIf} from 'lib/renderIf';
import Component from './Component';

export default Component
  |> withHandlers({
    setPin: ({pin, setAuth}) => v => {
      if (pin == v) {
        setAuth();
      }
    },
  })
  |> renderIf(prop('pin'))
  |> connect(createStructuredSelector({isAuth: getIsAuth, pin: getPin}), {setAuth});
