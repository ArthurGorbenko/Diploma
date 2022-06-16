import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
  Typography,
  Grid,
  Fade,
} from '@material-ui/core';
import {useTable, useExpanded} from 'react-table';
import {ModalWindow} from 'ui/Modal';
import Pagination from 'ui/Pagination';
import {
  Image,
  View,
  Edit,
  Create,
  Delete,
  Actions,
  Title,
  Code,
  ListHeader,
  ListPanel,
  Link,
  TableCellHeader,
  Button,
  List as ListInfo,
  ListText,
} from 'theme';
import {useMessage} from 'lib/intl/hooks';
import {asset, credentials, URL_ADMIN} from 'config/api';
import {Alert} from 'ui/Alert';
import {Airplay} from '@material-ui/icons';

const List = ({
  handleModalOpen,
  handleClose,
  modalOpen,
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
  const c = credentials.get();

  return (
    <Container>
      <ListHeader>
        <Title>{t('shop.label')}</Title>
        <Create className="create-shop" to="/shops/create">
          {t('shop.create')}
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
            const {
              logo,
              root,
              designs,
              expiration_date,
              disabled,
              uuid,
              license,
              payment_frequency,
              pin,
              categories,
              id: shopId,
              name,
              subscription_date,
              ...optionalTextFields
            } = row.original;
            const mediaUrl = asset(logo);
            const locked = c.uuid === row.original.uuid && c.role === 'admin';
            const shopAdmin = `${URL_ADMIN}auth/${row.original.uuid}/${row.original.license}`;

            prepareRow(getSubRows(row));
            return (
              <Fade in={fade[id]} key={row.id}>
                <TableRow {...row.getRowProps()}>
                  <ListPanel>
                    {logo && <Image src={mediaUrl} />}
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {name}
                      </Typography>
                      <ListInfo shrink="true">
                        {!root && (
                          <>
                            <ListText shrink="true">
                              {t('category.label')} : {categories.map(({name}) => name).toString()}
                            </ListText>
                            <ListText shrink="true">
                              {t('shop.expiration_date_label')} : <i>{expiration_date}</i>
                            </ListText>
                          </>
                        )}
                        {designs.length ? (
                          <ListText shrink="true">
                            {`${t('designs.list')} : ${designs
                              .map(({machine_name}) => t(`designs.labels.${machine_name}`))
                              .toString()}`}
                          </ListText>
                        ) : null}
                        <ListText shrink="true">{disabled ? t('disable') : t('active')}</ListText>
                        <ListText shrink="true">
                          #id : <Code>{uuid}</Code>
                        </ListText>
                        <ListText shrink="true">
                          <Grid container>
                            <Grid item xs={12}>
                              {t('license.label')} :
                            </Grid>
                            <Code>{license}</Code>
                          </Grid>
                        </ListText>
                        {payment_frequency && (
                          <ListText shrink="true">
                            {t('shop.payment_frequency')}:
                            {t(`shop.payment_frequency_types.${row.original.payment_frequency}`)}
                          </ListText>
                        )}
                        {pin && (
                          <ListText shrink="true">
                            {t('shop.pin')}:<Code>{row.original.pin}</Code>
                          </ListText>
                        )}
                        {subscription_date && (
                          <ListText shrink="true">
                            {t('shop.subscription_date_label')}: <i>{subscription_date}</i>
                          </ListText>
                        )}
                        {Object.keys(optionalTextFields).map(
                          el =>
                            optionalTextFields[el] && (
                              <ListText key={el} shrink="true">
                                {t(`shop.${el}`)} : <i>{optionalTextFields[el]}</i>
                              </ListText>
                            ),
                        )}
                        <ListText shrink="true">
                          <Grid container>
                            <Grid item xs={12}>
                              {t('shop.adminAccess')} :
                            </Grid>
                            <Link target="_blank" href={shopAdmin}>
                              {shopAdmin}
                            </Link>
                            <QRCode value={shopAdmin} size={210} fgColor="#00a99c" style={{margin: 6}} />
                          </Grid>
                        </ListText>
                      </ListInfo>
                    </CardContent>

                    <Actions>
                      <View to={`/shops/view/${id}`} />
                      <Edit className="edit-shop" showif={!locked} to={`/shops/edit/${id}`} />
                      <Delete
                        className="delete-shop"
                        showif={!locked}
                        onClick={e => handleModalOpen(e, id)}
                      />
                      <Button
                        startIcon={<Airplay />}
                        variant="outlined"
                        to={`/slideshow?shop=${row.original.id}`}
                        style={{marginLeft: 20}}>
                        {t('slideshow.list')}
                      </Button>
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
      <Alert messageId="shop.error" />
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
  modalOpen: PropTypes.array,
  handleClose: PropTypes.func,
};

export default List;
