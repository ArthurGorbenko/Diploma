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
} from '@material-ui/core';
import {useTable, useExpanded} from 'react-table';
import {ModalWindow} from 'ui/Modal';
import Pagination from 'ui/Pagination';
import {asset} from 'config/api';
import {
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
  categoryId,
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
        <Title>{t('labels.list')}</Title>
        <Create className="create-label" to={`/categories/${categoryId}/labels/create`}>
          {t('labels.create')}
        </Create>
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
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            }

            const mediaUrl = asset(row.original.image_link);

            prepareRow(getSubRows(row));
            return (
              <Fade in={fade[id]} key={row.id}>
                <TableRow {...row.getRowProps()}>
                  <ListPanel>
                    <Image src={mediaUrl} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {row.values.name}
                      </Typography>
                    </CardContent>

                    <Actions>
                      <View to={`/categories/${categoryId}/labels/view/${id}`} />
                      <Edit to={`/categories/${categoryId}/labels/edit/${id}`} />
                      <Delete onClick={e => handleModalOpen(e, id)} />
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
  handleModalConfirm: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleFadeChange: PropTypes.func.isRequired,
  fade: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  categoryId: PropTypes.number.isRequired,
};

export default List;
