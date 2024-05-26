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
import { Formik, FormikHelpers } from "formik";
import { TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

import "./HomePage.css"; // Importuj plik CSS
interface FormValues {
  username: string;
  password: string;
}

function HomePage() {
  // otwarte/zamkniete menu
  // anchorEl przechowuje informacje o tym, czy menu jest otwarte czy zamknięte
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // otwieranie menu
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //zamykanie menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // nawigacja do innej ścieżki
  const navigate = useNavigate();

  // Funkcja wywoływana po zatwierdzeniu formularza
  const onSubmit = useCallback(
    (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
      setSubmitting(false);
      navigate("/mainwindowlibrarian");
      console.log("/mainwindowlibrarian");
    },
    [navigate],
  );

  // walidacja formularza
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required("Pole nie może być puste"),
        password: yup
          .string()
          .required("Pole nie może być puste")
          .min(5, "Hasło nie może być krótsze niż 5 znaków"),
      }),
    [],
  );

  return (
    <Box className="home-page-container">
      <AppBar className="app-bar" position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            onClick={handleMenu}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" className="title">
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
      <Box className="form-container">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange
          validateOnBlur
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            isValid,
            dirty,
          }) => (
            <form className="login-form" noValidate onSubmit={handleSubmit}>
              <Typography variant="h4" className="form-title">
                Zaloguj się
              </Typography>
              <TextField
                id="username"
                name="username"
                label="Nazwa użytkownika"
                variant="standard"
                fullWidth
                margin="normal"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
              />
              <TextField
                id="password"
                name="password"
                label="Hasło"
                variant="standard"
                type="password"
                fullWidth
                margin="normal"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
              <Button
                className="login-button"
                variant="contained"
                startIcon={<LoginIcon />}
                type="submit"
                disabled={!(isValid && dirty)}
                fullWidth
              >
                Zaloguj się
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default HomePage;
