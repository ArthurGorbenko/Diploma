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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import {useTable, useExpanded} from 'react-table';
import Pagination from 'ui/Pagination';
import {Actions, Title, ListHeader, ListPanel, TableCellHeader} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {OptionsViewer} from 'modules/options';

const List = ({
  handleFadeChange,
  handleDisabled,
  disabled,
  fade,
  data,
  columns,
  designs,
  handleDesignFilter,
  entities,
  entity,
  handleEntityFilter,
  designIds,
  options,
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
        <Title>{t('options.name')}</Title>
      </ListHeader>
      <FormControl style={{minWidth: 180, marginBottom: 10, marginRight: 20}}>
        <InputLabel id="filterDesign">Design</InputLabel>
        <Select value={designIds[0] || 'all'} onChange={handleDesignFilter} id="filterDesign">
          {designs.map(({machine_name, id}) => (
            <MenuItem value={id} key={id}>
              {t(`designs.labels.${machine_name}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl style={{minWidth: 180, marginBottom: 10}}>
        <InputLabel id="filterEntity">Target entity</InputLabel>
        <Select onChange={handleEntityFilter} value={entity || 'all'} id="filterEntity">
          {entities.map(el => (
            <MenuItem value={el} key={el}>
              {t(`options.entities.${el}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
            const option_id = row.original.id;
            return (
              <Fade in={fade[id]} key={row.id}>
                <TableRow {...row.getRowProps()}>
                  <ListPanel>
                    <OptionsViewer
                      showEdit={false}
                      withLabel={false}
                      options={options.filter(({id}) => id === option_id)}
                      optionValues={{option_id}}
                    />
                    <Actions style={{padding: '0 20px 15px'}}>
                      <FormControlLabel
                        style={{padding: 0}}
                        control={
                          <Checkbox
                            checked={disabled[option_id] || false}
                            onChange={e => handleDisabled(e, option_id)}
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
  handleDesignFilter: PropTypes.func.isRequired,
  handleEntityFilter: PropTypes.func.isRequired,
  fade: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  disabled: PropTypes.object.isRequired,
  designs: PropTypes.array.isRequired,
  entities: PropTypes.array.isRequired,
  entity: PropTypes.any,
  designIds: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
};

export default List;
