import React from 'react';
import PropTypes from 'prop-types';
import {Container, Grid} from '@material-ui/core';
import {Back, Edit, Labels, Delete, Actions, PaperStyled, List, ListText} from 'theme';
import {ModalWindow} from 'ui/Modal';
import {isEmpty} from 'ramda';
import {useMessage} from 'lib/intl/hooks';
import Gallery from 'ui/Gallery';

const View = ({category: {name}, handleModalOpen, handleModalConfirm, categoryId, labels}) => {
  const t = useMessage();
  return (
    <Container>
      <Back to="/categories" />
      <PaperStyled>
        <List>
          <ListText variant="h4">{name}</ListText>
          {!isEmpty(labels) ? <Gallery tiles={labels} /> : <ListText>{t('labels.none')}</ListText>}
        </List>
        <Grid container>
          <Grid item xs={12}>
            <Actions>
              <Edit className="edit-category" to={`/categories/edit/${categoryId}`} />
              <Labels className="edit-labels" to={`/categories/${categoryId}/labels`} />
              <Delete className="delete-category" onClick={e => handleModalOpen(e, categoryId)} />
            </Actions>
          </Grid>
        </Grid>
        <ModalWindow handleModalConfirm={handleModalConfirm} />
      </PaperStyled>
    </Container>
  );
};

View.propTypes = {
  category: PropTypes.object.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  labels: PropTypes.array.isRequired,
  categoryId: PropTypes.number.isRequired,
};

export default View;
