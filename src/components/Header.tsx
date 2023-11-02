import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import HomeIcon from '@material-ui/icons/Home';
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function Header(props: Props) {
  return (
    <AppBar position="static" style={{ color: 'white', backgroundColor: "rgb(255, 105, 180)", boxShadow: "none" }}>
      <Toolbar>
        <Typography variant="h5" style={{ flexGrow: 1, fontWeight: 500 }}>{props.children}</Typography>
        <IconButton
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          to="/"
          component={Link}
          aria-label="Move to Home"
        >
          <HomeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
