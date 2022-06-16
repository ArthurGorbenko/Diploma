import React from 'react';
import {isEmpty} from 'ramda';
import {Container} from '@material-ui/core';
import {
  Image,
  Back,
  Edit,
  Delete,
  Actions,
  PaperStyled,
  List,
  ListText,
  Create,
  ListHeader,
  Video,
} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {ModalWindow} from 'ui/Modal';
import PropTypes from 'prop-types';
import {asset} from 'config/api';
import Gallery from 'ui/Gallery';
import {OptionsViewer} from 'modules/options';

const View = ({
  slide: {id, number, type, disabled, slide_data},
  handleModalOpen,
  handleModalConfirm,
  slideshowId,
  options,
  slideOptions,
  slideOptionValues,
  slideTypeOptionValues,
  slideshow,
}) => {
  const t = useMessage();
  return (
    <Container>
      <ListHeader>
        <Back to={`/slideshow/${slideshowId}/slides`} />
        <Create to={`/slideshow/${slideshowId}/slides/create`}>{t('slides.create')}</Create>
      </ListHeader>
      <PaperStyled>
        <List>
          <ListText variant="h5">
            {t('slides.slideOfScreen')} : {slideshow.name}
          </ListText>
          <ListText>
            {t('slides.column.type')} : <i>{type}</i>
          </ListText>
          <ListText>
            {t('slides.number')} : <i>{number}</i>
          </ListText>
          {type === 'product' && (
            <>
              <ListText>
                {t('product.label')} : <i>{slide_data.product.title}</i>
              </ListText>
              {(slide_data.price1 || slide_data.price1_detail) && (
                <ListText>
                  {t('slides.price')} :{' '}
                  <i>{`${slide_data.price1}€ ${slide_data.price1_detail || ''}`}</i>
                </ListText>
              )}
              {(slide_data.price2 || slide_data.price2_detail) && (
                <ListText>
                  {t('slides.priceSecondary')} :{' '}
                  <i>{`${slide_data.price2}€ ${slide_data.price2_detail || ''}`}</i>
                </ListText>
              )}
              {slide_data.title && (
                <ListText>
                  {t('slides.title')} : <i>{slide_data.title}</i>
                </ListText>
              )}
              {slide_data.country && (
                <ListText>
                  {t('slides.country')} : <i>{slide_data.country}</i>
                </ListText>
              )}
              {slide_data.event && (
                <ListText>
                  {t('slides.event')} : <i>{slide_data.event}</i>
                </ListText>
              )}
              {slide_data.labels && <Gallery tiles={slide_data.labels} />}
            </>
          )}
          <ListText>
            {t('disabled')} : <i>{t(disabled ? 'yes' : 'not')}</i>
          </ListText>
          {type === 'image' && <Image src={asset(slide_data.image_link)} />}
          {type === 'video' && <Video controls src={asset(slide_data.video_link)} />}
        </List>
        {!isEmpty(slideOptionValues) && (
          <OptionsViewer optionValues={slideOptionValues} options={options} />
        )}
        {!isEmpty(slideTypeOptionValues) && (
          <OptionsViewer
            showEdit={false}
            optionValues={slideTypeOptionValues}
            options={slideOptions}
            labelId="slideOptions"
          />
        )}
        <Actions>
          <Edit to={`/slideshow/${slideshowId}/slides/edit/${id}`} />
          <Delete className="delete-slide" onClick={e => handleModalOpen(e, id)} />
        </Actions>
        <ModalWindow handleModalConfirm={handleModalConfirm} />
      </PaperStyled>
    </Container>
  );
};

View.propTypes = {
  slide: PropTypes.shape({
    number: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    slide_data: PropTypes.shape({
      title: PropTypes.string,
      price1: PropTypes.string,
      price2: PropTypes.string,
      price1_detail: PropTypes.string,
      price2_detail: PropTypes.string,
      country: PropTypes.string,
      event: PropTypes.string,
      image_link: PropTypes.string,
      video_link: PropTypes.string,
      product: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
      }),
      labels: PropTypes.array,
    }),
  }),
  slideshowId: PropTypes.any.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  slideOptions: PropTypes.array.isRequired,
  slideOptionValues: PropTypes.any,
  slideTypeOptionValues: PropTypes.any,
  slideshow: PropTypes.object.isRequired,
};

export default View;
