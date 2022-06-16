import React from 'react';
import PropTypes from 'prop-types';
import {Container, Grid} from '@material-ui/core';
import {
  Image,
  Video,
  Back,
  Edit,
  Delete,
  Actions,
  PaperStyled,
  List,
  ListText,
  Create,
  ListHeader,
} from 'theme';
import {asset} from 'config/api';
import {useMessage} from 'lib/intl/hooks';
import {ModalWindow} from 'ui/Modal';
import {OptionsViewer} from 'modules/options';

const View = ({
  product: {id, title, media_link, media_type, category, shop, designs},
  handleModalOpen,
  handleModalConfirm,
  isClient,
  options,
  optionValues,
}) => {
  const t = useMessage();
  return (
    <Container>
      <ListHeader>
        <Back to="/products" />
        <Create className="create-product" to="/products/create">
          {t('product.create')}
        </Create>
      </ListHeader>
      <PaperStyled>
        <List>
          <ListText variant="h4">{title}</ListText>
          {/* <ListText>
            {category ? t('category.name') : t('shop.labelSingular')} :{' '}
            <i>{category ? category.name : shop.name}</i>
          </ListText>
          {designs.length ? (
            <ListText>
              {t('designs.list')} :{' '}
              <i>{designs.map(({machine_name}) => t(`designs.labels.${machine_name}`)).toString()}</i>
            </ListText>
          ) : null} */}
          <ListText>
            {media_type === 'image' ? (
              <Image src={asset(media_link)} />
            ) : (
              <Video src={asset(media_link)} controls />
            )}
          </ListText>
        </List>
        <OptionsViewer
          showEdit={false}
          showDefault={false}
          optionValues={optionValues}
          options={options}
        />
        <Grid container>
          <Grid item xs={12}>
            <Actions>
              <Edit
                className="editProductsBtn"
                showif={!(isClient && !shop)}
                to={`/products/edit/${id}`}
              />
              <Delete
                className="delete-product"
                showif={!(isClient && !shop)}
                onClick={e => handleModalOpen(e, id)}
              />
            </Actions>
          </Grid>
        </Grid>
        <ModalWindow handleModalConfirm={handleModalConfirm} />
      </PaperStyled>
    </Container>
  );
};

View.propTypes = {
  product: PropTypes.object.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  isClient: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  optionValues: PropTypes.object,
};

export default View;
