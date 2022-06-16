import Component from './Component';
import {connect} from 'react-redux';
import {withProps, lifecycle, withHandlers} from 'recompose';
import withUserRole from 'modules/user/withUserRole';
import {withRouter} from 'react-router';
import {createStructuredSelector} from 'reselect';
import {getTabs, fetchAllSlideshows} from 'modules/slideshow/ducks';
import {loadingIf} from 'ui/Loading';
import {setLocale, getLocale} from 'modules/user/ducks';

export default Component
  |> withHandlers({
    handleLocale: ({setLocale}) => e => {
      setLocale(e.target.value);
    },
  })
  |> withProps(({isAdmin}) => ({
    tabs: ['products', 'slideshow', ].filter(
      el => isAdmin || (el !== 'categories' && el !== 'shops' && el !== 'designs' && el !== 'options'),
    ),
    locales: ['uk', 'en'],
  }))
  |> loadingIf(({slideshowTabs, isClient}) => !slideshowTabs && isClient)
  |> lifecycle({
    componentDidMount() {
      const {fetchAllSlideshows, slideshowTabs, isClient} = this.props;
      if (!slideshowTabs && isClient) {
        fetchAllSlideshows();
      }
    },
  })
  |> connect(
    createStructuredSelector({
      slideshowTabs: getTabs,
      locale: getLocale,
    }),
    {fetchAllSlideshows, setLocale},
  )
  |> withUserRole
  |> withRouter;
