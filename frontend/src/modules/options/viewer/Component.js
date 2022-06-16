import React from 'react';
import PropTypes from 'prop-types';
import {Paper, Typography, List, ListItem, styled} from '@material-ui/core';
import {useMessage} from 'lib/intl/hooks';
import {Image, Video, Title, Edit} from 'theme';
import {asset} from 'config/api';
import {getImage} from '../config';

export const Label = styled(p => <Typography variant="body1" {...p} />)({opacity: 0.9});
export const Value = styled(p => <Typography variant="body1" {...p} />)({marginLeft: 10, fontSize: 17});
export const Img = styled(Image)({marginLeft: 10, borderRadius: 5, maxWidth: 210});

export const OptionsViewer = ({
  optionsToRender,
  isPaper = false,
  withLabel = true,
  labelId = 'name',
  handleAddOption,
  showEdit = true,
}) => {
  const t = useMessage();
  return (
    optionsToRender.length > 0 && (
      <Paper elevation={isPaper ? 1 : 0}>
        {withLabel && (
          <Title style={{padding: '20px 0 0 20px'}} variant="h6">
            {t(`options.${labelId}`)}
          </Title>
        )}
        <List style={{padding: '0 20px'}}>
          {optionsToRender.map(
            ({id, translation_key, machine_name, value, renderId, isDefault, design}, index) => (
              <ListItem
                style={{
                  padding: '20px 0',
                  borderBottom:
                    index !== optionsToRender.length - 1 ? `1px solid rgba(0, 0, 0, 0.12)` : 0,
                  flexWrap: 'wrap',
                }}
                key={id}>
                <Label>{t(`options.labels.${translation_key}`)}</Label> :
                {
                  {
                    text: <Value>{value}</Value>,
                    boolean: <Value>{t(value ? 'yes' : 'no')}</Value>,
                    image:
                      value === 'ø' && design.machine_name === 'd2' && /bg_photo/.test(machine_name) ? (
                        <Img src="/design/d2/bg.png" />
                      ) : value !== 'ø' ? (
                        <Img src={getImage(design.machine_name, machine_name, value)} />
                      ) : (
                        value
                      ),
                    image_link: <Img src={asset(value)} />,
                    video_link: <Video src={asset(value)} style={{maxWidth: 200}} />,
                    textColor: (
                      <Typography
                        variant="body2"
                        style={{
                          backgroundColor: value,
                          padding: 8,
                          color: 'white',
                          borderRadius: 4,
                          marginLeft: 6,
                        }}>
                        {value}
                      </Typography>
                    ),
                  }[renderId]
                }
                {isDefault && value !== 'ø' && (
                  <Label variant="body2" style={{marginLeft: 8, opacity: 0.8}}>
                    ({t('options.default')})
                  </Label>
                )}
                {showEdit && (
                  <Edit
                    size="small"
                    variant="outlined"
                    onClick={() => handleAddOption(id)}
                    style={{marginLeft: 'auto', marginRight: 16}}
                  />
                )}
              </ListItem>
            ),
          )}
        </List>
      </Paper>
    )
  );
};

OptionsViewer.propTypes = {
  optionsToRender: PropTypes.array.isRequired,
  handleAddOption: PropTypes.func.isRequired,
  isPaper: PropTypes.bool,
  withLabel: PropTypes.bool,
  showEdit: PropTypes.bool,
  labelId: PropTypes.string,
};

export default OptionsViewer;
