import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
  Typography,
  Fade,
  ListItem,
  Divider,
  List as ListInfo,
  Box,
} from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/LowPriority';
import {useTable, useExpanded} from 'react-table';
import {ModalWindow} from 'ui/Modal';
import Pagination from 'ui/Pagination';
import {
  Edit,
  Create,
  Delete,
  View,
  Button,
  Actions,
  Title,
  Image,
  ListHeader,
  ListPanel,
  TableCellHeader,
  Thumbnail,
  Video,
} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {asset, URL} from 'config/api';

const List = ({
  handleModalOpen,
  handleModalConfirm,
  handleFadeChange,
  fade,
  data,
  columns,
  slideshowId,
  slideshow,
  isAdmin,
  ...props
}) => {
  const {getTableProps, headerGroups, rows, prepareRow, toggleRowExpanded, getSubRows} = useTable(
    {
      columns,
      data,
    },
    useExpanded,
  );
  const t = useMessage();
  const linkToSlideshow = `${URL}?uuid=${slideshow.shop.uuid}&slideshow_id=${slideshowId}`;

  return (
    <Container>
      <ListHeader style={{flexDirection: 'column', alignItems: 'flex-start'}}>
        <Title>
          {t('slides.slidesOfScreen')} : {slideshow.name}{' '}
          {isAdmin && <span>{`(${slideshow.shop.name})`}</span>}
        </Title>
        <Box style={{marginTop: 10}}>
          <Create size="small" to={`/slideshow/${slideshowId}/slides/create`}>
            {t('slides.create')}
          </Create>
          <Button
            size="small"
            startIcon={<ReorderIcon />}
            variant="outlined"
            to={`/slideshow/${slideshowId}/slides/reorder`}
            style={{marginLeft: 20}}>
            {t('slides.reorder')}
          </Button>
          <View
            size="small"
            to={`/slideshow/view/${slideshowId}`}
            variant="outlined"
            style={{marginLeft: 20}}>
            {t('slides.seeSlideshow')}
          </View>
          <View
            size="small"
            href={linkToSlideshow}
            variant="outlined"
            style={{marginLeft: 20}}
            target="_blank">
            {t('slideshow.preview_new_tab')}
          </View>
        </Box>
      </ListHeader>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCellHeader {...column.getHeaderProps()}>{column.render('Header')}</TableCellHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map(row => {
            const {id} = row.original;
            prepareRow(row);
            if (row.canExpand) {
              return (
                <TableRow
                  key={row.id}
                  onClick={e => {
                    handleFadeChange(e, id);
                    toggleRowExpanded(row.id, !fade[id]);
                  }}>
                  {row.cells.map(cell =>
                    cell.column.id === 'slide_data' && cell.row.values.type === 'image' ? (
                      <TableCell {...cell.getCellProps()}>
                        <Thumbnail alt="Slide image" src={asset(cell.value)} />
                      </TableCell>
                    ) : (
                      <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                    ),
                  )}
                </TableRow>
              );
            }

            prepareRow(getSubRows(row));
            return (
              <Fade in={fade[id]} key={row.id}>
                <TableRow {...row.getRowProps()}>
                  <ListPanel>
                    <CardContent>
                      {row.values.type === 'product' && (
                        <ListInfo>
                          <ListItem disableGutters>
                            <Typography gutterBottom variant="h5" component="h2">
                              {row.original.slide_data.product.title}
                            </Typography>
                          </ListItem>
                          <Divider />
                          <ListItem disableGutters>
                            {t('slides.title')} : {row.original.slide_data.title}
                          </ListItem>
                          <Divider />

                          {(row.original.slide_data.price1 || row.original.slide_data.price1_detail) && (
                            <ListItem disableGutters>
                              {t('slides.price')} :{' '}
                              <i>
                                {`${row.original.slide_data.price1}€ ${
                                  row.original.slide_data.price1_detail || ''
                                }`}
                              </i>
                            </ListItem>
                          )}
                          {(row.original.slide_data.price2 || row.original.slide_data.price2_detail) && (
                            <ListItem disableGutters>
                              {t('slides.priceSecondary')} :{' '}
                              <i>
                                {`${row.original.slide_data.price2}€ ${
                                  row.original.slide_data.price2_detail || ''
                                }`}
                              </i>
                            </ListItem>
                          )}

                          <Divider />
                          <ListItem disableGutters>
                            {t('product.label')} : {row.original.slide_data.product.title}
                          </ListItem>
                          <Divider />
                        </ListInfo>
                      )}
                      {row.values.type === 'image' && (
                        <Image src={asset(row.original.slide_data.image_link)} />
                      )}
                      {row.values.type === 'video' && (
                        <Video controls src={asset(row.original.slide_data.video_link)} />
                      )}
                      <Typography style={{marginTop: 10}} variant="body2">
                        {t(row.original.disabled ? 'disabled' : 'active')}
                      </Typography>
                    </CardContent>

                    <Actions>
                      <View to={`/slideshow/${slideshowId}/slides/view/${id}`} />
                      <Edit to={`/slideshow/${slideshowId}/slides/edit/${id}`} />
                      <Delete className="delete-slide" onClick={e => handleModalOpen(e, id)} />
                    </Actions>
                  </ListPanel>
                </TableRow>
              </Fade>
            );
          })}
        </TableBody>
      </Table>
      <Pagination {...props} />
      <ModalWindow handleModalConfirm={handleModalConfirm} />
    </Container>
  );
};

List.propTypes = {
  handleModalConfirm: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleFadeChange: PropTypes.func.isRequired,
  fade: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  slideshowId: PropTypes.any.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  slideshow: PropTypes.object.isRequired,
};

export default List;
