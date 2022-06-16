/* eslint-disable prefer-template,react/no-unescaped-entities */
import React, {Fragment, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Container, TextField, Grid, InputLabel, styled, Typography, List} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Title, Copy, Code, Input, ListText} from 'theme';
import {useClipboard} from 'use-clipboard-copy';
import {useMessage} from 'lib/intl/hooks';
import {URL} from 'config/api';

const SubTitle = styled(p => <Typography variant="body1" {...p} />)({
  marginTop: 9,
  marginBottom: 10,
});
// --no-default-browser-check
// --no-first-run --disable-infobars --disable-session-crashed-bubble --disable-restore-session-state --disable-plugins --noerrordialogs --force-device-scale-factor=1 --disable-popup-blocking --disable-tab-switcher --disable-translate

const Command = ({
  slideshow: {
    id,
    name,
    shop: {uuid},
  },
  slideshow2,
  setSlideshow2,
  slideshows,
  ip,
  setIp,
  resolutionWidth,
  setResolutionWidth,
}) => {
  const t = useMessage('slideshow.command');
  const urlToSlideshow = `${URL}?uuid=${uuid}&slideshow_id=${id}`;

  const cmdScreen2 = slideshow2
    ? `\\n@chromium-browser --kiosk --window-position=${resolutionWidth},0 --user-data-dir='/home/pi/Documents/Profiles/1' --disable-features=TranslateUI --check-for-update-interval=31536000 --disable-component-update --incognito ${URL}?uuid=${uuid}&slideshow_id=${slideshow2}\\n`
    : '';

  const cmdChromium = `ssh-keygen -R ${ip} && ssh ${ip} -l pi "sudo sed -i '/^@chromium/d' /etc/xdg/lxsession/LXDE-pi/autostart; printf '\\n@chromium-browser --kiosk --window-position=0,0 --user-data-dir='/home/pi/Documents/Profiles/0' --disable-features=TranslateUI  --check-for-update-interval=31536000 --disable-component-update --incognito ${urlToSlideshow}\\n${cmdScreen2}' | sudo tee -a /etc/xdg/lxsession/LXDE-pi/autostart"`;

  const cmdAll = `${cmdChromium} && ssh ${ip} -l pi "printf '\\n@xset s noblank\\n@xset s off\\n@xset s -dpms\\n@unclutter -idle 0\\n' | sudo tee -a /etc/xdg/lxsession/LXDE-pi/autostart"`;

  const clipboard = useClipboard();
  const handleCopyAll = useCallback(() => {
    clipboard.copy(cmdAll);
  }, [clipboard.copy, cmdAll]);
  const handleCopyChomium = useCallback(() => {
    clipboard.copy(cmdChromium);
  }, [clipboard.copy, cmdChromium]);

  return (
    <Container>
      <Title style={{marginTop: 30, marginBottom: 30}}>
        {t('install')} {name}
      </Title>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <List>
            <ListText>
              - Connect the SD Card to your computer and install{' '}
              <a href="https://www.raspberrypi.org/downloads/" target="_blank">
                https://www.raspberrypi.org/downloads/
              </a>
            </ListText>
            <ListText>- Create empty file named SSH at the root of your SD Card.</ListText>
            <ListText>- Put the SD Card in the Raspberry and start it with mouse & keyboard:</ListText>
            <ListText style={{paddingLeft: 25}}>
              - Check 'Use english language'
              <br />
              - Change the password (note it)
              <br />
              - If the screen has black border, check 'This screen shows a black border...'
              <br />
              - Connect the wifi
              <br />
              - Update Software : click next
              <br />- Run
              <Code style={{fontSize: 15, color: 'black'}}>sudo apt-get install unclutter</Code>
              <br />
              - Remove background image and set it to black
              <br />
              - Set the screen resolution to 1920x1080
              <br />- Open the terminal and type
              <Code style={{fontSize: 15, color: 'black'}}>hostname -I</Code> and note the IP below
              <br />
            </ListText>
            <ListText>- Write the IP, copy the command and run it from your computer:</ListText>
          </List>
        </Grid>

        <Input
          id="writeIpLabel"
          labelId="slideshow.command.ip"
          onChange={e => setIp(e.target.value)}
          value={ip}
          name="ip"
        />

        <Grid item xs={12}>
          <Autocomplete
            value={slideshows.filter(el => el.id === slideshow2)[0]}
            onChange={(e, v) => setSlideshow2(v.id)}
            options={slideshows}
            getOptionLabel={({name}) => name}
            style={{width: '100%'}}
            id="slideshow2Select"
            renderInput={params => <TextField {...params} label={t('screen2')} variant="outlined" />}
          />
        </Grid>
        {slideshow2 && (
          <Grid item xs={12}>
            <InputLabel htmlFor="resolutionWidthField">Screen width resolution</InputLabel>
            <TextField
              id="resolutionWidthField"
              type="number"
              onChange={e => setResolutionWidth(e.target.value)}
              value={resolutionWidth}
              name="name"
              fullWidth
            />
          </Grid>
        )}

        {ip.length > 6 && (
          <Fragment>
            <Grid item xs={12}>
              <Code>{cmdAll}</Code>
              <Copy onClick={handleCopyAll} />
            </Grid>
            <Grid item xs={12} style={{marginTop: 75, opacity: 0.55}}>
              <SubTitle>{t('screenOnly')}</SubTitle>
              <Code>{cmdChromium}</Code>
              <Copy onClick={handleCopyChomium} />
            </Grid>
          </Fragment>
        )}
      </Grid>
    </Container>
  );
};

Command.propTypes = {
  ip: PropTypes.string,
  slideshow2: PropTypes.any,
  setIp: PropTypes.func.isRequired,
  resolutionWidth: PropTypes.string.isRequired,
  setResolutionWidth: PropTypes.func.isRequired,
  setSlideshow2: PropTypes.func.isRequired,
  slideshow: PropTypes.object.isRequired,
  uuid: PropTypes.string.isRequired,
  slideshows: PropTypes.array.isRequired,
};

export default Command;
