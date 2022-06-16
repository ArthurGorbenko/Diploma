import React from 'react';
import PropTypes from 'prop-types';
import {Container, Grid} from '@material-ui/core';
import {Image, Back, Edit, Delete, Actions, PaperStyled, List, ListText} from 'theme';
import {asset} from 'config/api';
import {ModalWindow} from 'ui/Modal';

const View = ({label: {id, name, image_link}, handleModalOpen, handleModalConfirm, categoryId}) => {
  return (
    <Container>
      <Back to={`/categories/${categoryId}/labels`} />
      <PaperStyled>
        <List>
          <ListText variant="h4">{name}</ListText>
          <ListText>
            <Image src={asset(image_link)} />
          </ListText>
        </List>
        <Grid container>
          <Grid item xs={12}>
            <Actions>
              <Edit className="edit-label" to={`/categories/${categoryId}/labels/edit/${id}`} />
              <Delete className="delete-label" onClick={e => handleModalOpen(e, id)} />
            </Actions>
          </Grid>
        </Grid>
        <ModalWindow handleModalConfirm={handleModalConfirm} />
      </PaperStyled>
    </Container>
  );
};

View.propTypes = {
  label: PropTypes.object.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  categoryId: PropTypes.number.isRequired,
};

export default View;
