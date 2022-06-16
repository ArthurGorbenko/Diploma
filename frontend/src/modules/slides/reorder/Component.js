import React from 'react';
import PropTypes from 'prop-types';
import {Container, styled, List, ListItem, Paper, Grid, ListItemText} from '@material-ui/core';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {asset} from 'config/api';
import {PaperStyled, Back, Title as TitleTheme, Video} from 'theme';
import {useMessage} from 'lib/intl/hooks';

const Item = styled(p => <Paper {...p} />)({
  paddingLeft: 2,
  border: '1px solid #eee',
});

const Image = styled('img')({
  maxWidth: '100%',
  maxHeight: 100,
  objectFit: 'contain',
  objectPosition: 'left',
  marginTop: 5,
  marginLeft: 3,
  borderRadius: 3,
});

const Title = styled(TitleTheme)({
  margin: 16,
});

const Reorder = ({slides, slideshow, slideshowId, onDragEnd}) => {
  const t = useMessage();
  return (
    <Container>
      <Back to={`/slideshow/${slideshowId}/slides`} />
      <PaperStyled>
        <Title>
          {t('slides.slideOfScreen')} : {slideshow.name}
        </Title>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="paper">
            {provided => (
              <Grid container spacing={1} innerRef={provided.innerRef} {...provided.droppableProps}>
                {slides.map((el, i) => (
                  <Draggable key={el.id.toString()} draggableId={el.id.toString()} index={i}>
                    {provided => (
                      <Grid
                        item
                        xs={12}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}>
                        <Item style={{background: el.disabled ? 'grey' : 'white'}}>
                          {el.type === 'product' && (
                            <Grid container>
                              <Grid item xs={6}>
                                <List>
                                  <ListItem>
                                    <ListItemText>
                                      <b>{el.slide_data.title || el.slide_data.product.title}</b> –{' '}
                                      {el.slide_data.price}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </Grid>
                            </Grid>
                          )}
                          {el.type === 'image' && (
                            <Grid container>
                              <Grid item xs={7}>
                                <Image src={asset(el.slide_data.image_link)} />
                              </Grid>
                            </Grid>
                          )}
                          {el.type === 'video' && (
                            <Grid container>
                              <Grid item xs={7} style={{flexDirection: 'flex-start'}}>
                                <Video
                                  style={{width: 'auto', maxHeight: 100}}
                                  src={asset(el.slide_data.video_link)}
                                />
                              </Grid>
                            </Grid>
                          )}
                        </Item>
                      </Grid>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      </PaperStyled>
    </Container>
  );
};

Reorder.propTypes = {
  slides: PropTypes.array.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  slideshowId: PropTypes.any.isRequired,
  slideshow: PropTypes.object.isRequired,
};

export default Reorder;
