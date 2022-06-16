import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import {Container} from '@material-ui/core';
import {
  Image,
  Code,
  Back,
  Edit,
  Delete,
  Actions,
  Link,
  List,
  ListText,
  PaperStyled,
  Button,
} from 'theme';
import {asset, credentials, URL_ADMIN} from 'config/api';
import {useMessage} from 'lib/intl/hooks';
import {ModalWindow} from 'ui/Modal';
import {Airplay} from '@material-ui/icons';

const View = ({
  shop: {
    name,
    categories,
    expiration_date,
    disabled,
    uuid,
    license,
    logo,
    id,
    root,
    designs,
    payment_frequency,
    pin,
    ...optionalTextFields
  },
  handleModalOpen,
  handleModalConfirm,
}) => {
  const t = useMessage();
  const c = credentials.get();
  const locked = c.uuid === uuid && c.role === 'admin';
  const shopAdmin = `${URL_ADMIN}auth/${uuid}/${license}`;

  return (
    <Container>
      <Back to="/shops" />
      <PaperStyled>
        <List>
          <ListText variant="h4">{name}</ListText>
          {!root && (
            <ListText>
              {t('category.label')} : <i>{categories.map(({name}) => name).toString()}</i>
            </ListText>
          )}
          {designs.length ? (
            <ListText>
              {t('designs.list')} :{' '}
              <i>{designs.map(({machine_name}) => t(`designs.labels.${machine_name}`)).toString()}</i>
            </ListText>
          ) : null}
          <ListText>
            {t('shop.expiration_date_label')} : <i>{expiration_date}</i>
          </ListText>
          <ListText>{disabled ? t('disable') : t('active')}</ListText>
          <ListText>
            #id : <Code>{uuid}</Code>
          </ListText>
          <ListText>
            {t('license.label')} :<Code>{license}</Code>
          </ListText>
          {payment_frequency && (
            <ListText>
              {t('shop.payment_frequency')} :
              <i>{t(`shop.payment_frequency_types.${payment_frequency}`)}</i>
            </ListText>
          )}
          {pin && (
            <ListText>
              {t('shop.pin')} : <Code>{pin}</Code>
            </ListText>
          )}
          {Object.keys(optionalTextFields).map(
            el =>
              optionalTextFields[el] && (
                <ListText key={el}>
                  {t(`shop.${el}`)} : <i>{optionalTextFields[el]}</i>
                </ListText>
              ),
          )}
          <ListText>
            {t('shop.adminAccess')} :<Link href={shopAdmin}>{shopAdmin}</Link>
            <QRCode value={shopAdmin} size={210} fgColor="#00a99c" style={{margin: 6}} />
          </ListText>
          {logo && (
            <ListText>
              <Image src={asset(logo)} />
            </ListText>
          )}
        </List>
        <Actions>
          <Edit className="edit-shop" showif={!locked} to={`/shops/edit/${id}`} />
          <Delete className="delete-shop" showif={!locked} onClick={e => handleModalOpen(e, id)} />
          <Button
            startIcon={<Airplay />}
            variant="outlined"
            to={`/slideshow?shop=${id}`}
            style={{marginLeft: 20}}>
            {t('slideshow.list')}
          </Button>
        </Actions>
      </PaperStyled>

      <ModalWindow handleModalConfirm={handleModalConfirm} />
    </Container>
  );
};

View.propTypes = {
  shop: PropTypes.shape({
    name: PropTypes.string.isRequired,
    categories: PropTypes.array,
    designs: PropTypes.array.isRequired,
    expiration_date: PropTypes.string.isRequired,
    payment_frequency: PropTypes.string,
    pin: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    uuid: PropTypes.string.isRequired,
    license: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    root: PropTypes.bool,
  }),
  handleModalConfirm: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
};

export default View;
