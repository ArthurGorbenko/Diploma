import React from 'react';
import PropTypes from 'prop-types';
import {styled, Typography} from '@material-ui/core';
import {useMessage} from 'lib/intl/hooks';

const Error = styled(p => <Typography color="secondary" variant="body2" {...p} />)({
  marginTop: 10,
});

const ErrorMessage = ({error}) => {
  const t = useMessage();
  return error ? <Error>{t(error)}</Error> : null;
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
};

export default ErrorMessage;
