import React from 'react';
import Loading from 'ui/Loading';

export default condition => C => props => (condition(props) ? <Loading {...props} /> : <C {...props} />);
