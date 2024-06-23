import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useApi } from "../api/ApiProvider";

interface Props {
  window?: () => Window;
}

const drawerWidth = 280;

export default function DrawerAppBar(props: Props) {
  const { t, i18n } = useTranslation();
  const apiClient = useApi();
  const tileItems = [
    { text: t("books"), path: "/bookslist" },
    { text: t("loans"), path: "/loansReader" },
    { text: t("reviews"), path: "/reviews" },
    { text: t("addReview"), path: "/addReview" },
    { text: t("changeLoginAndPassword"), path: "#" },
  ];

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [postUpdateDialogOpen, setPostUpdateDialogOpen] = React.useState(false);
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [language, setLanguage] = React.useState<string>(i18n.language);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogConfirm = async () => {
    try {
      const response = await apiClient.updateLoginAndPassword({
        username: login,
        password: password,
      });

      if (response.success) {
        setPostUpdateDialogOpen(true);
      } else {
        console.error("Failed to update login and password.");
        // Handle error scenarios as needed
      }

      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating login and password:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage
    navigate("/");
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
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
          <Select
            value={language}
            onChange={handleLanguageChange}
            className="language-select"
            variant="standard"
            sx={{ color: "white", marginLeft: "auto" }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="pl">Polski</MenuItem>
          </Select>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button sx={{ color: "#fff" }} onClick={handleLogout}>
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
              {tile.text === t("changeLoginAndPassword") ? (
                <Button
                  className="grid-button"
                  onClick={handleDialogOpen}
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
              ) : (
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
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialog after successful update */}
      <Dialog
        open={postUpdateDialogOpen}
        onClose={() => setPostUpdateDialogOpen(false)}
      >
        <DialogTitle>{t("postUpdateDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>{t("postUpdateDialogContent")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="primary">
            {t("logout")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for changing login and password */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{t("changeLoginAndPassword")}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {t("changeLoginAndPasswordDialogInfo")}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label={t("newLogin")}
            type="text"
            fullWidth
            variant="standard"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <TextField
            margin="dense"
            label={t("newPassword")}
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>{t("cancel")}</Button>
          <Button onClick={handleDialogConfirm}>{t("confirm")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
