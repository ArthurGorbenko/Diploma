import Component from './Component';
import {lifecycle} from 'recompose';
import {connect} from 'react-redux';
import withSlideshow from '../withSlideshow';
import {setDesignDefault} from 'modules/options/ducks';
import withOptions from 'modules/options/withOptions';

export default Component
  |> withOptions({entity: 'slideshow', all: true, disabled: true})
  |> lifecycle({
    componentDidMount() {
      const {setDesignDefault, slideshow} = this.props;
      setDesignDefault([slideshow.design.id]);
    },
  })
  |> withSlideshow
  |> connect(null, {setDesignDefault});
