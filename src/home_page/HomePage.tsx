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
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Formik, FormikHelpers } from "formik";
import { TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useApi } from "../api/ApiProvider";
import { useTranslation } from "react-i18next";

import "./HomePage.css";

interface FormValues {
  username: string;
  password: string;
}

function HomePage() {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const apiClient = useApi();

  const onSubmit = useCallback(
    async (values: FormValues, formik: FormikHelpers<FormValues>) => {
      apiClient.login(values).then((response) => {
        if (response.statusCode === 201 && response.role === "ROLE_LIBRARIAN") {
          navigate("/mainwindowlibrarian");
        } else if (
          response.role === "ROLE_READER" &&
          response.statusCode === 201
        ) {
          navigate("/mainwindowreader");
        } else {
          formik.setFieldError("username", "Invalid username or password");
        }
      });
    },
    [apiClient, navigate],
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required(t("Pole nie może być puste")),
        password: yup
          .string()
          .required(t("Pole nie może być puste"))
          .min(5, t("Hasło nie może być krótsze niż 5 znaków")),
      }),
    [t],
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
            {t("library")}
          </Typography>
          <Button color="inherit" component={Link} to="/books">
            {t("books")}
          </Button>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>{t("howToCreateAccount")}</MenuItem>
        <MenuItem onClick={handleMenuClose}>{t("contact")}</MenuItem>
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
                {t("login")}
              </Typography>
              <TextField
                id="username"
                name="username"
                label={t("username")}
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
                label={t("password")}
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
                {t("login")}
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default HomePage;
