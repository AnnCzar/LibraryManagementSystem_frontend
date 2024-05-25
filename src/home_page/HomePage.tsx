import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

function HomePage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const onSubmit = useCallback(
    (values: { username: string; password: string }, formik: any) => {
      navigate("/mainwindowlibrarian");
      console.log("/mainwindowlibrarian");
    },
    [navigate],
  );
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required("Pole nie może być puste"),
        password: yup
          .string()
          .required("Pole nie może być puste")
          .min(5, "Hasło nie może byc krótsze niż 5 znaków"),
      }),
    [],
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            onClick={handleMenu}
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library
          </Typography>
          <Button color="inherit" component={Link} to="/books">
            Książki
          </Button>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Jak założyć konto?</MenuItem>
        <MenuItem onClick={handleMenuClose}>Kontakt</MenuItem>
      </Menu>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", color: "#b1a20f", mb: 2 }}
          >
            Zaloguj się
          </Typography>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            validateOnChange
            validateOnBlur
          >
            {(formik: any) => (
              <form
                className="login-form"
                id="signForm"
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <TextField
                  id="username"
                  name="username"
                  label="Nazwa użytkownika"
                  variant="standard"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && !!formik.errors.username}
                  helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                  id="password"
                  name="password"
                  label="Hasło"
                  variant="standard"
                  type="password"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && !!formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <Button
                  variant="contained"
                  startIcon={<LoginIcon />}
                  type="submit"
                  disabled={!(formik.isValid && formik.dirty)}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Zaloguj się
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
