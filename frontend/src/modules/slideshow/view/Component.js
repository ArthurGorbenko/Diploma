import React from 'react';
import PropTypes from 'prop-types';
import {Container} from '@material-ui/core';
import {Back, Edit, Create, Actions, PaperStyled, List, ListText, Button, View as ViewBtn} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {URL} from 'config/api';
import {OptionsViewer} from 'modules/options';

const View = ({
  slideshow: {name, speed, shop, id, disabled, categories, design},
  isAdmin,
  options,
  optionValues,
  slides,
}) => {
  const t = useMessage();
  const linkToSlideshow = `${URL}?uuid=${shop.uuid}&slideshow_id=${id}`;
  return (
    <Container>
      <Back to="/slideshow" />
      <PaperStyled>
        <List>
          <ListText variant="h4">{name}</ListText>
          {/* {isAdmin && (
            <ListText>
              {t('shop.labelSingular')} : <i>{shop.name}</i>
            </ListText>
          )} */}
          {categories.length ? (
            <ListText>
              {t('category.label')} : <i>{categories.map(({name}) => name).toString()}</i>
            </ListText>
          ) : null}
          {/* <ListText>
            {t('designs.singleLabel')} : <i>{t(`designs.labels.${design.machine_name}`)}</i>
          </ListText> */}
          <ListText>
            {t('slideshow.speed')} : 
            <i>
              {speed} {t('seconds')}
            </i>
          </ListText>
          <ListText>
            {t('disabled')} : <i>{t(disabled ? 'yes' : 'not')}</i>
          </ListText>
        </List>
        <OptionsViewer
          showEdit={false}
          showDefault={false}
          optionValues={optionValues}
          options={options}
        />

        <Actions>
          <Edit className="edit-slideshow" to={`/slideshow/edit/${id}`} />
          <Button to={`/slideshow/${id}/slides`} badge={slides.length}>
            {t('slides.list')}
          </Button>
          <Create to={`/slideshow/${id}/slides/create`}>{t('slides.create')}</Create>
          <Button showif={isAdmin} to={`/slideshow/command/${id}`}>
            {t('slideshow.command.configure')}
          </Button>
          <ViewBtn
            variant="outlined"
            href={linkToSlideshow}
            target="_blank"
            style={{marginLeft: 'auto'}}>
            {t('slideshow.preview_new_tab')}
          </ViewBtn>
        </Actions>
      </PaperStyled>
    </Container>
  );
};

View.propTypes = {
  slideshow: PropTypes.shape({
    name: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    shop: PropTypes.shape({
      name: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }),
    categories: PropTypes.array.isRequired,
    design: PropTypes.object.isRequired,
  }),
  isAdmin: PropTypes.bool.isRequired,
  uuid: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  optionValues: PropTypes.any,
  slides: PropTypes.array.isRequired,
};

export default View;
