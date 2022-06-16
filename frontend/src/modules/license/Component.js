import React from 'react';
import {FormattedDate} from 'react-intl';
import {useMessage} from 'lib/intl/hooks';
import {Typography, styled, Box} from '@material-ui/core';
import PropTypes from 'prop-types';

export const Container = styled(Box)({
  padding: 20,
});

const License = ({expiration_date, isExpiringSoon}) => {
  const t = useMessage();

  return (
    <Container>
      <Typography variant="body1">
        {t('shop.expiration_date_label')} :{' '}
        <b>
          <FormattedDate value={expiration_date} />
        </b>
      </Typography>
      {isExpiringSoon && (
        <Typography color="secondary">
          <i>{t('shop.expiration_date_warning')}</i>
        </Typography>
      )}
    </Container>
  );
};

License.propTypes = {
  expiration_date: PropTypes.string.isRequired,
  isExpiringSoon: PropTypes.any,
};

export default License;
