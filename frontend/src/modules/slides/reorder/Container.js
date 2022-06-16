import Component from './Component';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import withSlideshow from 'modules/slideshow/withSlideshow';
import withSlides from '../withSlides';
import {withProps, withState} from 'recompose';
import {renderIfLoaded} from 'lib/renderIf';
import {postSlidesOrder} from '../ducks';

export default Component
  |> withProps(({slides, setSlides, postSlidesOrder}) => ({
    onDragEnd: ({destination, source, draggableId}) => {
      if (!destination || destination.index === source.index) {
        return;
      }
      const reordered = [...slides];
      reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, slides.filter(({id}) => id.toString() === draggableId)[0]);
      setSlides(reordered);
      postSlidesOrder(reordered.map(({id}) => id));
    },
  }))
  |> withState('slides', 'setSlides', ({slides}) => [...slides])
  |> renderIfLoaded
  |> connect(null, {postSlidesOrder})
  |> withSlideshow
  |> withSlides({all: true})
  |> injectIntl;
