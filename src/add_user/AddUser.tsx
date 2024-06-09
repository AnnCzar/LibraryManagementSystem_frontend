import React from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
const AddUserPage = () => {
  const apiClient = useApi();
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    username: Yup.string().required("Wprowadź nazwę użytkownika"),
    password: Yup.string().required("Wprowadź hasło"),
    email: Yup.string()
      .email("Niepoprawny adres email")
      .required("Wprowadź adres email"),
    fullUserName: Yup.string().required("Wprowadź pełną nazwę użytkownika"),
    role: Yup.string().required("Wybierz rolę użytkownika"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      fullUserName: "",
      role: "ROLE_READER",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await apiClient.addUser(values);
        console.log("Response:", response);
        if (response.statusCode === 201) {
          console.log("Dodano użytkownika:", response.statusCode);
          resetForm();
        } else {
          console.error(
            "Błąd podczas dodawania użytkownika:",
            response.statusCode,
          );
        }
      } catch (error) {
        console.error("Błąd podczas dodawania użytkownika:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      className="add-user-container"
      sx={{
        backgroundColor: "#0e3a48",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
            <Button
              sx={{ color: "#fff" }}
              component={Link}
              to="/mainwindowlibrarian"
            >
              <HomeIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        className="add-user-page"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Paper
          elevation={3}
          className="form-paper"
          sx={{ width: "100%", maxWidth: 800, padding: "5rem" }}
        >
          <Typography variant="h4" className="form-title" gutterBottom>
            {t("addUser")}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={5} justifyContent="center">
              <Grid item xs={12} md={8}>
                <TextField
                  label={t("username")}
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  type="password"
                  label="Hasło"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  type="email"
                  label={t("email")}
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  label={t("fullUserName")}
                  name="fullUserName"
                  value={formik.values.fullUserName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fullUserName &&
                    Boolean(formik.errors.fullUserName)
                  }
                  helperText={
                    formik.touched.fullUserName && formik.errors.fullUserName
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <FormControl fullWidth>
                  <InputLabel>{t("role")}</InputLabel>
                  <Select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                  >
                    <MenuItem value="ROLE_READER">{t("reader")}</MenuItem>
                    <MenuItem value="ROLE_LIBRARIAN">
                      {t("librarian")}
                    </MenuItem>{" "}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8}>
                <Button
                  variant="contained"
                  className="button-loan"
                  fullWidth
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {t("submitUser")}
                </Button>
              </Grid>
            </Grid>
          </form>
          {formik.submitCount > 0 &&
            Object.keys(formik.errors).length === 0 && (
              <Typography color="error" sx={{ marginTop: "1rem" }}>
                {t("userAddedError")}
              </Typography>
            )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AddUserPage;
