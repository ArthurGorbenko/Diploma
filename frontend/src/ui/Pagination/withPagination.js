import {isNil} from 'ramda';
import {withHandlers, withState, lifecycle} from 'recompose';
import {loadingIf} from 'ui/Loading';

export default Component =>
  Component
  |> withHandlers({
    handleClickPrev: ({page, setPage, setDisabled}) => () => {
      if (page > 1) {
        setPage(--page);
        setDisabled({next: false, prev: page === 1});
      }
    },
    handleClickNext: ({page, setPage, totalPages, setDisabled}) => () => {
      if (page < totalPages) {
        setPage(++page);
        setDisabled({prev: false, next: page === totalPages});
      }
    },
  })
  |> lifecycle({
    componentDidUpdate(prevProps) {
      const {page, totalPages, isDisabled, setDisabled} = this.props;
      if (totalPages !== prevProps.totalPages) {
        setDisabled({...isDisabled, next: page === totalPages});
      }
    },
  })
  |> withState('isDisabled', 'setDisabled', ({page, totalPages}) => ({
    prev: !page || page === 1,
    next: !page || page === totalPages,
  }))
  |> loadingIf(({totalPages}) => isNil(totalPages));
