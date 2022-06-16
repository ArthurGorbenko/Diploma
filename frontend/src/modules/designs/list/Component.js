import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Fade,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import {useTable, useExpanded} from 'react-table';
import Pagination from 'ui/Pagination';
import {Actions, Title, ListHeader, ListPanel, TableCellHeader, Button} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {AddToPhotos} from '@material-ui/icons';

const List = ({handleFadeChange, handleDisabled, disabled, fade, data, columns, ...props}) => {
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
        <Title>{t('designs.list')}</Title>
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
            const designId = row.original.id;
            return (
              <Fade in={fade[id]} key={row.id}>
                <TableRow {...row.getRowProps()}>
                  <ListPanel>
                    <Actions>
                      <Button
                        startIcon={<AddToPhotos />}
                        variant="outlined"
                        to="/options"
                        style={{marginLeft: 20}}>
                        {t('options.name')}
                      </Button>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={disabled[designId] || false}
                            onChange={e => handleDisabled(e, designId)}
                            name="disabled"
                            color="primary"
                            id="designsDisableCheckbox"
                          />
                        }
                        label={t('disabled')}
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
    </Container>
  );
};

List.propTypes = {
  handleFadeChange: PropTypes.func.isRequired,
  handleDisabled: PropTypes.func.isRequired,
  fade: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  disabled: PropTypes.object.isRequired,
};

export default List;
