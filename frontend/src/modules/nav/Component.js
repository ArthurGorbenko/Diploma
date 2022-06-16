import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Drawer as DrawerTheme,
  List,
  Divider,
  Typography,
  FormControl,
  Select,
  MenuItem,
  ListItem,
  ListItemIcon as ListItemIconTheme,
} from '@material-ui/core';
import {Link as LinkRouter} from 'react-router-dom';
import {useMessage} from 'lib/intl/hooks';
import Icon from 'ui/Icon';
import {colors} from 'theme';

const Drawer = styled(DrawerTheme)({
  width: 190,
  flexShrink: 0,
  zIndex: 1,
  backgroundColor: '#f6f6f6',
  '& .MuiDrawer-paper': {
    backgroundColor: '#4a4a4a',
    width: 190,
    top: 60,
    height: 'calc(100vh - 60px)',
  },
});

const Link = styled(LinkRouter)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: '#eee',
});

const ListItemIcon = styled(ListItemIconTheme)({
  minWidth: 35,
});

const Text = styled(p => <Typography variant="body1" {...p} />)(({active}) => ({
  fontWeight: active ? 'bold' : '',
  color: active ? colors.blue : '',
}));

const Text2 = styled(Text)(({active}) => ({
  fontWeight: active ? 'bold' : '',
  color: active ? '#fff' : '#eee',
}));
const Sep = styled(Divider)({
  backgroundColor: 'rgba(255, 255, 255,0.2)',
});

const SelectLang = styled(p => <FormControl {...p} />)({
  paddingLeft: 20,
  marginTop: 'auto',
  marginBottom: 20,
  alignSelf: 'flex-start',
  '& .MuiInputBase-root': {
    color: 'white',
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
  '& .MuiInput-underline::before': {
    borderBottomColor: 'white',
  },
  '&:hover': {
    borderBottomColor: 'white',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled)::before': {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
});

const Nav = ({
  tabs,
  slideshowTabs,
  isClient,
  history: {
    location: {pathname},
  },
  locales,
  locale,
  handleLocale,
}) => {
  const t = useMessage('navigation');
  return (
    <Drawer variant="permanent" anchor="left" className="navBar">
      <List>
        {tabs.map(tab => {
          const active = new RegExp(tab).test(pathname) ? 1 : 0;
          return (
            <Fragment key={tab}>
              <ListItem button component={Link} to={`/${tab}`} className={tab}>
                <ListItemIcon>
                  <Icon style={{color: active ? colors.blue : '#eee'}} name={tab} />
                </ListItemIcon>
                <Text active={active}>{t(tab)}</Text>
              </ListItem>

              {tab === 'slideshow' && isClient && (
                <List component="div" disablePadding>
                  {slideshowTabs.map(({id, name}) => (
                    <Fragment key={id}>
                      <Sep />
                      <ListItem button component={Link} to={`/slideshow/${id}/slides`}>
                        <Text2
                          active={new RegExp(`/${id}/slides`).test(pathname) ? 1 : 0}
                          variant="body2">
                          {name}
                        </Text2>
                      </ListItem>
                    </Fragment>
                  ))}
                </List>
              )}
              <Sep />
            </Fragment>
          );
        })}
      </List>
      <SelectLang>
        <Select value={locale} onChange={handleLocale}>
          {locales.map(el => (
            <MenuItem key={el} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </SelectLang>
    </Drawer>
  );
};

Nav.propTypes = {
  tabs: PropTypes.array.isRequired,
  slideshowTabs: PropTypes.array,
  isClient: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  handleLocale: PropTypes.func.isRequired,
};

export default Nav;
