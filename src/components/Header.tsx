import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function Header(props: Props) {
  return (
    <AppBar position="static" style={{ color: 'white', backgroundColor: "rgb(33, 150, 243)", boxShadow: "none" }}>
      <Toolbar>
        <Typography variant="h5" style={{ flexGrow: 1, fontWeight: 500 }}>{props.children}</Typography>
        <IconButton
          color="inherit"
          aria-label="home"
          to="/"
          component={Link}>
          <HomeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

const HeaderMemo = React.memo(Header);
export default HeaderMemo;