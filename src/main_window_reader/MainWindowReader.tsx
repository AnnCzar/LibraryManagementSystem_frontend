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
import { useApi } from "../api/ApiProvider";
import { useTranslation } from "react-i18next";

interface Props {
  window?: () => Window;
}

const drawerWidth = 280;

export default function DrawerAppBar(props: Props) {
  const { t } = useTranslation();
  // const apiClient = useApi();
  // apiClient.getBooks().then((response) => {
  //   console.log(response);
  // });
  const tileItems = [
    { text: t("books"), path: "/books" },
    { text: t("loans"), path: "/loans" },
    { text: t("reviews"), path: "/reviews" },
    { text: t("addReview"), path: "/" },
  ];
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box className="home-page-container">
      <CssBaseline />
      <AppBar className="app-bar" component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            {t("library")}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button sx={{ color: "#fff" }} component={Link} to="/">
              {t("logout")}
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
            keepMounted: true,
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
                className="grid-button"
                component={Link}
                to={tile.path}
                variant="contained"
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: 150,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#a59d62",
                  color: "#fff",
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

export {};
