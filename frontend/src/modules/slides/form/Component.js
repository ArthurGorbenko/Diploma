import React from 'react';
import PropTypes from 'prop-types';
import {prop, isNil, isEmpty} from 'ramda';
import {
  Container,
  Grid,
  GridListTileBar,
  IconButton,
  styled,
  Collapse,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import {FormActions, Submit, Cancel, Image, Tiles, Wrapper, Tile, Input, Select, Price} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {MediaUpload} from 'ui/MediaUpload';
import {Alert} from 'ui/Alert';
import {asset} from 'config/api';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {OptionsPicker, OptionsViewer} from 'modules/options';
import {ModalWindow} from 'ui/Modal';
import {getOptionValues} from 'modules/options/helpers';

const TileControl = styled(p => <IconButton {...p} />)({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 9,
});

const Form = ({
  values,
  handleBlur,
  handleChange,
  handleEvent,
  handleSubmit,
  handleCancel,
  handleProduct,
  handleCountry,
  handlePrice,
  handleAddLabel,
  handleCategory,
  handleMedia,
  handleType,
  types,
  products,
  errors,
  files,
  valuesForChange,
  events,
  origins,
  labels,
  resetForm,
  currentCategory,
  slideshow,
  fileId,
  options,
  slideOptions,
  currentOptions,
  currentTypeOptions,
  addOptionSlide,
  setOptionValueSlide,
  handleModalConfirm,
  loading,
  addOption,
  ...props
}) => {
  const t = useMessage();
  const isDisabled = Boolean(
    !(values.type === 'image' ? values.slide_data.image_link : values.slide_data.video_link) || loading,
  );
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          {!valuesForChange && (
            <Select
              xs={2}
              labelId="slides.type"
              value={(values.type ? types.filter(({id}) => id === values.type) : types)[0]}
              onChange={handleType}
              options={types}
              getOptionLabel={prop('label')}
              disableClearable
            />
          )}

          {/* <Collapse in={!isEmpty(options)} style={{width: '100%', padding: isEmpty(options) ? 20 : 0}}>
            <OptionsViewer
              {...props}
              isPaper
              options={options || []}
              currentOptions={currentOptions}
              optionValues={getOptionValues(currentOptions)}
              valuesForChange={valuesForChange}
              addOption={addOption}
            />
            <OptionsPicker
              {...props}
              options={options || []}
              currentOptions={currentOptions}
              values={values}
              valuesForChange={valuesForChange}
              addOption={addOption}
            />
          </Collapse> */}

          {values.type === 'product' ? (
            <>
              {slideshow.categories.length > 1 && (
                <Select
                  id="categorySelect"
                  labelId="category.name"
                  value={
                    !isNil(currentCategory)
                      ? slideshow.categories.filter(category => category.id === currentCategory.id)[0]
                      : null
                  }
                  onChange={handleCategory}
                  options={slideshow.categories}
                  getOptionLabel={prop('name')}
                />
              )}

              <Select
                id="productSelect"
                labelId={
                  slideshow.categories.length > 1 && !currentCategory
                    ? 'slides.productSelectCategory'
                    : 'slides.product'
                }
                value={
                  values.slide_data.product_id
                    ? products.filter(el => el.id === values.slide_data.product_id)[0]
                    : null
                }
                onChange={handleProduct}
                options={products}
                getOptionLabel={prop('title')}
                disabled={slideshow.categories.length > 1 && !currentCategory}
                error={errors.product_id}
                disableClearable
              />

              {values.slide_data.product_id && (
                <Grid item xs={12} style={{marginTop: -30}}>
                  <Image
                    src={asset(
                      products.filter(el => el.id === values.slide_data.product_id)[0].media_link,
                    )}
                    mode="preview"
                  />
                </Grid>
              )}

              <Input
                id="slideTitleInput"
                labelId="slides.productName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.slide_data.title || ''}
                name="slide_data.title"
              />

              {/* <Grid item xs={3}>
                <Price
                  labelId="slides.price"
                  id="price1"
                  value={values.slide_data.price1 || ''}
                  onChange={handlePrice}
                />
              </Grid>

              <Input
                xs={9}
                id="price1_detail"
                labelId="slides.priceDetails"
                onChange={handlePrice}
                value={values.slide_data.price1_detail || ''}
              />

              <Grid item xs={3}>
                <Price
                  labelId="slides.priceSecondary"
                  id="price2"
                  value={values.slide_data.price2 || ''}
                  onChange={handlePrice}
                />
              </Grid>

              <Input
                xs={9}
                id="price2_detail"
                labelId="slides.priceDetails"
                onChange={handlePrice}
                value={values.slide_data.price2_detail || ''}
              />

              <Select
                freeSolo
                xs={6}
                id="eventSelect"
                labelId="slides.event"
                value={values.slide_data.event || ''}
                onChange={handleEvent}
                options={events}
              />

              <Select
                freeSolo
                xs={6}
                id="countrySelect"
                labelId="slides.country"
                value={values.slide_data.country || ''}
                onChange={handleCountry}
                options={origins}
              /> */}
              {labels && !isEmpty(labels) && (
                <Grid item xs={12}>
                  <Tiles>
                    <Wrapper style={{width: '100%'}} cols={2}>
                      {labels.map(({name, image_link, id}) => (
                        <Tile key={name} style={{background: 'none', width: 'auto', height: 160}}>
                          <Image src={asset(image_link)} alt={name} mode="preview" />
                          <GridListTileBar title={name} />
                          <TileControl
                            onClick={e => handleAddLabel(e, id)}
                            style={{backgroundColor: 'rgba(255, 255, 255,0.8)'}}>
                            {values.slide_data.label_ids && values.slide_data.label_ids.includes(id) ? (
                              <HighlightOffIcon fontSize="large" color="error" />
                            ) : (
                              <AddCircleOutlineIcon fontSize="large" color="primary" />
                            )}
                          </TileControl>
                        </Tile>
                      ))}
                    </Wrapper>
                  </Tiles>
                </Grid>
              )}
            </>
          ) : (
            <Grid item xs={12}>
              <MediaUpload
                onFileUpload={handleMedia}
                fileId={fileId}
                accept={values.type}
                defaultValue={{
                  filename:
                    values.type === 'image'
                      ? values.slide_data.image_link
                      : values.slide_data.video_link,
                  type: values.type,
                }}
              />
            </Grid>
          )}

          <Collapse
            in={!isEmpty(slideOptions)}
            style={{width: '100%', padding: isEmpty(options) ? 20 : 0}}>
            <OptionsViewer
              isPaper
              options={slideOptions || []}
              optionValues={getOptionValues(currentTypeOptions)}
              currentOptions={currentTypeOptions}
              addOption={addOptionSlide}
              valuesForChange={valuesForChange && valuesForChange.slide_data}
            />
            <OptionsPicker
              {...props}
              currentOptions={currentTypeOptions}
              addOption={addOptionSlide}
              setOptionValue={setOptionValueSlide}
              options={slideOptions || []}
              values={values.slide_data}
              valuesForChange={valuesForChange && valuesForChange.slide_data}
            />
          </Collapse>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.disabled}
                  onChange={handleChange}
                  name="disabled"
                  color="primary"
                  id="disablingCheckbox"
                />
              }
              label={t('disable')}
            />
          </Grid>
          <FormActions>
            <Submit isDisabled={values.type !== 'product' && isDisabled} />
            <Cancel onClick={handleCancel} />
          </FormActions>
        </Grid>
      </form>
      <Alert messageId="required" />
      <ModalWindow handleModalConfirm={handleModalConfirm} />
    </Container>
  );
};

Form.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleProduct: PropTypes.func.isRequired,
  handleEvent: PropTypes.func.isRequired,
  handleCountry: PropTypes.func.isRequired,
  handlePrice: PropTypes.func.isRequired,
  handleAddLabel: PropTypes.func.isRequired,
  handleCategory: PropTypes.func.isRequired,
  handleMedia: PropTypes.func.isRequired,
  handleType: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired,
  origins: PropTypes.array.isRequired,
  labels: PropTypes.array,
  valuesForChange: PropTypes.object,
  files: PropTypes.any,
  currentCategory: PropTypes.any,
  slideshow: PropTypes.object,
  fileId: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  slideOptions: PropTypes.array.isRequired,
  currentOptions: PropTypes.array.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  loading: PropTypes.number.isRequired,
  currentTypeOptions: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
  addOption: PropTypes.func.isRequired,
  addOptionSlide: PropTypes.func.isRequired,
  setOptionValueSlide: PropTypes.func.isRequired,
};

export default Form;
