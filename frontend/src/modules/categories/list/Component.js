import React from 'react';
import PropTypes from 'prop-types';
import {Container, Table, TableBody, TableCell, TableHead, TableRow, Fade} from '@material-ui/core';
import {useTable, useExpanded} from 'react-table';
import {ModalWindow} from 'ui/Modal';
import Pagination from 'ui/Pagination';
import {
  View,
  Edit,
  Delete,
  Create,
  Labels,
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
        <Title>{t('category.label')}</Title>
        <Create className="category-create" to="/categories/create">
          {t('category.create')}
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
            prepareRow(getSubRows(row));
            return (
              <Fade in={fade[id]} key={row.id}>
                <TableRow {...row.getRowProps()}>
                  <ListPanel>
                    <Actions>
                      <View to={`/categories/view/${id}`} />
                      <Edit to={`/categories/edit/${id}`} />
                      <Labels to={`/categories/${id}/labels`} />
                      <Delete className="delete-category" onClick={e => handleModalOpen(e, id)} />
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
      <Alert messageId="category.error" />
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
};

export default List;
