import Component from './Component';
import {withProps, withHandlers, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import withModal from 'ui/Modal/withModal';
import {deleteSlideshow} from 'modules/slideshow/ducks';
import withSlideshow from '../withSlideshow';
import withUserRole from 'modules/user/withUserRole';
import withOptions from 'modules/options/withOptions';
import withSlides from 'modules/slides/withSlides';
import {setDesignDefault} from 'modules/options/ducks';
import {isEmpty} from 'ramda';

export default Component
  |> withOptions({entity: 'slideshow', all: true, disabled: true})
  |> lifecycle({
    componentDidMount() {
      const {setDesignDefault, slideshow} = this.props;
      setDesignDefault([slideshow.design.id]);
    },
  })
  |> withHandlers({
    handleModalConfirm: ({idRemoved, deleteSlideshow, setModalOpen, history}) => () => {
      deleteSlideshow(idRemoved);
      setModalOpen(false);
      history.push('/slideshow');
    },
  })
  |> withProps(({slideshow}) => {
    if (isEmpty(slideshow.option_values)) return null;
    const optionValues = {};
    slideshow.option_values.forEach(({option_id, value}) => {
      optionValues[option_id] = value;
    });
    return {optionValues};
  })
  |> withModal
  |> withSlideshow
  |> withSlides({all: true})
  |> connect(null, {deleteSlideshow, setDesignDefault})
  |> withUserRole;
