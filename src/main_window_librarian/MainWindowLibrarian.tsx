import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;

const tileItems = [
  { text: "Książki", path: "/books" },
  { text: "Czytlenicy", path: "/readers" },
  { text: "Wypożyczenia", path: "/loans" },
  { text: "Recenzje", path: "/reviews" },
  { text: "Nowe wypożyczenie", path: "/addLoan" },
  { text: "Dodaj nowego użytkownika", path: "/addUser" },
];

export default function DrawerAppBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Library
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button sx={{ color: "#fff" }} component={Link} to="/">
              Wyloguj
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        ></Drawer>
      </nav>

      <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
        <Toolbar />
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {tileItems.map((tile) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={tile.text}>
              <Button
                component={Link}
                to={tile.path}
                variant="contained"
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: 150,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                {tile.text}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
