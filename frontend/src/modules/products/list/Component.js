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
  Select,
  FormControl,
  MenuItem,
  Divider,
} from '@material-ui/core';
import {useTable, useExpanded} from 'react-table';
import {ModalWindow} from 'ui/Modal';
import Pagination from 'ui/Pagination';
import {asset} from 'config/api';
import {
  Video,
  Image,
  View,
  Edit,
  Create,
  Delete,
  Actions,
  Title,
  ListHeader,
  ListPanel,
  TableCellHeader,
} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {Alert} from 'ui/Alert';

const List = ({
  handleModalOpen,
  handleModalConfirm,
  handleFadeChange,
  fade,
  data,
  columns,
  filter,
  filters,
  handleFilter,
  isClient,
  categories,
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
        <Title>{t('product.list')}</Title>
        <Create className="create-product" to="/products/create">
          {t('product.create')}
        </Create>
      </ListHeader>
      {/* <FormControl style={{minWidth: 180, marginBottom: 10}}>
        <Select name="filter" value={filter} onChange={handleFilter}>
          {isClient
            ? filters.map(f => (
                <MenuItem key={f} value={f}>
                  {t(`product.filters.${f}`)}
                </MenuItem>
              ))
            : categories.map(({name, id}) => (
                <MenuItem key={id} value={id}>
                  {name === 'category.all' ? t(name) : name}
                </MenuItem>
              ))}
        </Select>
      </FormControl> */}
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
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            }

            const mediaUrl = asset(row.original.media_link);
            prepareRow(getSubRows(row));
            return (
              <Fade in={fade[id]} key={row.id}>
                <TableRow {...row.getRowProps()}>
                  <ListPanel>
                    {row.values.media_type === 'image' ? (
                      <Image src={mediaUrl} style={{maxWidth: '60%'}} />
                    ) : (
                      <Video src={mediaUrl} controls />
                    )}
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {row.values.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {row.values.category ? row.values.category.name : ''}
                      </Typography>
                      {/* {row.original.designs.length ? (
                        <>
                          <Divider style={{marginTop: 10}} />
                          <Typography gutterBottom variant="body2" style={{marginTop: 10}}>
                            {t('designs.list')} :{' '}
                            <i>
                              {' '}
                              {row.original.designs
                                .map(({machine_name}) => t(`designs.labels.${machine_name}`))
                                .toString()}{' '}
                            </i>
                          </Typography>
                        </>
                      ) : null} */}
                    </CardContent>

                    <Actions>
                      <View to={`/products/view/${id}`} />
                      <Edit showif={!(isClient && !row.original.shop)} to={`/products/edit/${id}`} />
                      <Delete
                        className="delete-product"
                        showif={!(isClient && !row.original.shop)}
                        onClick={e => handleModalOpen(e, id)}
                      />
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
      <Alert messageId="product.error" />
    </Container>
  );
};

List.propTypes = {
  handleFilter: PropTypes.func.isRequired,
  handleModalConfirm: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleFadeChange: PropTypes.func.isRequired,
  fade: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired,
  isClient: PropTypes.bool.isRequired,
  filter: PropTypes.any,
  categories: PropTypes.any,
};

export default List;
