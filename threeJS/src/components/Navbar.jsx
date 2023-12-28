import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import { Link as RouterLink } from 'react-router-dom';

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'transparent',
  zIndex: 1000
});

const StyledTypography = styled(Typography)({
  flexGrow: 1,
});

const StyledIconButton = styled(IconButton)({
  marginLeft: '16px',
});

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const drawerItems = [
    { text: 'Home', to: '/' },
    { text: 'Sun', to: '/sun' },
    { text: 'Mercury', to: '/mercury' },
    { text: 'Venus', to: '/venus' },
    { text: 'Earth', to: '/earth' },
    { text: 'Mars', to: '/mars' },
    { text: 'Jupiter', to: '/jupiter' },
    { text: 'Saturn', to: '/saturn' },
    { text: 'Uranus', to: '/uranus' },
    { text: 'Neptune', to: '/neptune' },
    { text: 'Pluto', to: '/pluto' },
  ];

  return (
    <div className="nav">
      <StyledAppBar position="static">
        <Toolbar >
          <StyledTypography variant="h6"></StyledTypography>
          <StyledIconButton onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </StyledIconButton>
          <Drawer anchor="top" open={isDrawerOpen} onClose={toggleDrawer(false)}>
            <List style={{ justifyContent: 'space-between' }}>
              {drawerItems.map((item, index) => (
                <ListItem button key={index} component={RouterLink} to={item.to} onClick={toggleDrawer(false)}>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Drawer>
        </Toolbar>
      </StyledAppBar>
    </div>
  );
};

export default Navbar;
