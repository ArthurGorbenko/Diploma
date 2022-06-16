import {withState} from 'recompose';
import withSlideshow from '../withSlideshow';
import withSlideshows from '../withSlideshows';
import {restrictToAdmin} from 'modules/user';
import Component from './Component';

export default Component
  |> withState('slideshow2', 'setSlideshow2')
  |> withState('ip', 'setIp', '192.168.0.')
  |> withState('resolutionWidth', 'setResolutionWidth', '1920')
  |> withSlideshows
  |> withSlideshow
  |> restrictToAdmin;
