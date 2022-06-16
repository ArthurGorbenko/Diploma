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
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import {useTable, useExpanded} from 'react-table';
import {ModalWindow} from 'ui/Modal';
import Pagination from 'ui/Pagination';
import {View, Edit, Create, Button, Actions, Title, ListHeader, ListPanel, TableCellHeader} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {URL} from 'config/api';

const List = ({
  handleModalOpen,
  handleModalConfirm,
  handleFadeChange,
  handleFilter,
  fade,
  data,
  columns,
  isAdmin,
  uuid,
  shops,
  filter: {shopId = 'root'},
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
  return (
    <Container>
      <ListHeader>
        <Title>{t('slideshow.list')}</Title>
        <Create className="create-slideshow" showif={isAdmin} to="/slideshow/create">
          {t('slideshow.create')}
        </Create>
      </ListHeader>
      {/* {isAdmin && (
        <FormControl style={{minWidth: 180, marginBottom: 10}}>
          <Select name="filter" value={shopId || 'root'} onChange={handleFilter}>
            {shops.map(({name, id}) => (
              <MenuItem key={id} value={id}>
                {name === 'shop.all' ? t(name) : name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )} */}
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
                  id={`id-${id}`}
                  className="table-row"
                  key={row.id}
                  onClick={e => {
                    handleFadeChange(e, id);
                    toggleRowExpanded(row.id, !fade[id]);
                  }}>
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            }

            prepareRow(getSubRows(row));
            const linkToSlideshow = `${URL}?uuid=${row.original.shop.uuid}&slideshow_id=${row.original.id}`;
            const categories = row.original.categories.map(({name}) => name).toString();
            return (
              <Fade in={fade[id]} key={row.id}>
                <TableRow {...row.getRowProps()} id={`id-panel-${id}`}>
                  <ListPanel>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {row.values.name}
                      </Typography>
                      {/* {isAdmin && (
                        <Typography variant="body2" color="textSecondary" component="p">
                          {t('shop.labelSingular')} : {row.original.shop.name}
                        </Typography>
                      )} */}
                      <ListInfo>
                        {/* {categories && (
                          <>
                            <Divider />
                            <ListItem disableGutters>
                              {t('category.label')} : <i>{categories}</i>
                            </ListItem>
                          </>
                        )}
                        <Divider />
                        <ListItem disableGutters>
                          {t('designs.list')} :{' '}
                          <i>{t(`designs.labels.${row.original.design.machine_name}`)}</i>
                        </ListItem>
                        <Divider /> */}
                        <ListItem disableGutters>
                          {t('slideshow.speed')} :{' '}
                          <i>
                            {row.values.speed} {t('seconds')}
                          </i>
                        </ListItem>
                      </ListInfo>
                    </CardContent>
                    <Actions>
                      <View to={`/slideshow/view/${id}`} />
                      <Edit to={`/slideshow/edit/${id}`} />
                      <Button to={`/slideshow/${id}/slides`}>{t('slides.list')}</Button>
                      <Create className="create-slide" to={`/slideshow/${id}/slides/create`}>
                        {t('slides.create')}
                      </Create>
                      <Button
                        showif={isAdmin}
                        to={`/slideshow/command/${id}`}
                        className="create-command">
                        {t('slideshow.command.configure')}
                      </Button>
                      <View
                        variant="outlined"
                        href={linkToSlideshow}
                        target="_blank"
                        style={{marginLeft: 'auto'}}>
                        {t('slideshow.preview_new_tab')}
                      </View>
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
  handleFilter: PropTypes.func.isRequired,
  fade: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  shops: PropTypes.any,
  isAdmin: PropTypes.bool.isRequired,
  uuid: PropTypes.string.isRequired,
  filter: PropTypes.object.isRequired,
  shopId: PropTypes.number,
};

export default List;
