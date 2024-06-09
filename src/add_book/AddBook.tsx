import React from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useApi } from "../api/ApiProvider";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";
import "./AddBook.css";

const AddBook = () => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    isbn: Yup.string().required(t("validation.required")),
    title: Yup.string().required(t("validation.required")),
    author: Yup.string().required(t("validation.required")),
    publisher: Yup.string().required(t("validation.required")),
    publishYear: Yup.number()
      .required(t("validation.required"))
      .positive(t("validation.positive"))
      .integer(t("validation.integer")),
    numberCopy: Yup.number()
      .required(t("validation.required"))
      .positive(t("validation.positive"))
      .integer(t("validation.integer")),
  });

  const apiClient = useApi();

  const formik = useFormik({
    initialValues: {
      isbn: "",
      title: "",
      author: "",
      publisher: "",
      publishYear: "",
      numberCopy: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const bookData = {
        isbn: values.isbn,
        title: values.title,
        author: values.author,
        publisher: values.publisher,
        publishYear: parseInt(values.publishYear),
        numberCopy: parseInt(values.numberCopy),
      };

      try {
        const response = await apiClient.addBook(bookData);
        if (response.statusCode === 201) {
          console.log("Dodano książkę:", response.statusCode);
          formik.resetForm();
        } else {
          console.error("Błąd podczas dodawania książki:", response.statusCode);
        }
      } catch (error) {
        console.error("Błąd podczas dodawania książki:", error);
      }
    },
  });

  return (
    <Box
      sx={{
        backgroundColor: "#0e3a48",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "64px",
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
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <Paper className="form-paper">
          <Typography variant="h4" className="form-title">
            {t("addBook")}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={8}>
                <TextField
                  id="isbn"
                  label={t("isbn")}
                  variant="outlined"
                  fullWidth
                  value={formik.values.isbn}
                  onChange={formik.handleChange}
                  error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                  helperText={formik.touched.isbn && formik.errors.isbn}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="title"
                  label={t("title")}
                  variant="outlined"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="author"
                  label={t("author")}
                  variant="outlined"
                  fullWidth
                  value={formik.values.author}
                  onChange={formik.handleChange}
                  error={formik.touched.author && Boolean(formik.errors.author)}
                  helperText={formik.touched.author && formik.errors.author}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="publisher"
                  label={t("publisher")}
                  variant="outlined"
                  fullWidth
                  value={formik.values.publisher}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.publisher && Boolean(formik.errors.publisher)
                  }
                  helperText={
                    formik.touched.publisher && formik.errors.publisher
                  }
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="publishYear"
                  label={t("publishYear")}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={formik.values.publishYear}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.publishYear &&
                    Boolean(formik.errors.publishYear)
                  }
                  helperText={
                    formik.touched.publishYear && formik.errors.publishYear
                  }
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="numberCopy"
                  label={t("numberCopy")}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={formik.values.numberCopy}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.numberCopy &&
                    Boolean(formik.errors.numberCopy)
                  }
                  helperText={
                    formik.touched.numberCopy && formik.errors.numberCopy
                  }
                />
              </Grid>
              <Grid item xs={5}>
                <Button
                  className="button-loan"
                  fullWidth
                  variant="contained"
                  type="submit"
                >
                  {t("submit")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddBook;
