import Component from './Component';
import {withProps} from 'recompose';
import {setMedia} from 'ui/MediaUpload';
import {connect} from 'react-redux';
import withShop from '../withShop';

export default Component
  |> withShop
  |> withProps(({match}) => ({shopId: match.params.id}))
  |> connect(null, {setMedia});
