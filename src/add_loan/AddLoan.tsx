import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Autocomplete,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import "./AddLoan.css";

const books = [
  {
    id: 1,
    isbn: 9783161484100,
    title: "Władca Pierścieni",
    author: "J.R.R. Tolkien",
    publisher: "HarperCollins",
    year: 1954,
    rating: 5,
  },
  {
    id: 2,
    isbn: 9788376485863,
    title: "Harry Potter i Kamień Filozoficzny",
    author: "J.K. Rowling",
    publisher: "Media Rodzina",
    year: 1997,
    rating: 10,
  },
];

const users = [
  { id: 1, username: "jdoe", email: "jdoe@example.com", name: "John Doe" },
  {
    id: 2,
    username: "asmith",
    email: "asmith@example.com",
    name: "Alice Smith",
  },
];

const validationSchema = Yup.object({
  bookTitle: Yup.string().required("Wybierz tytuł książki"),
  userName: Yup.string().required("Wybierz nazwę użytkownika"),
  endDate: Yup.date().nullable().required("Wybierz datę końcową"),
});

const AddLoanPage: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      bookTitle: "",
      userName: "",
      endDate: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Dodano wypożyczenie:", values);
      formik.resetForm();
    },
  });

  return (
    <div className="loan-page">
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
      >
        <AppBar className="app-bar" component="nav">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Library
            </Typography>
            <Button
              sx={{ color: "#fff" }}
              component={Link}
              to="/mainwindowlibrarian"
            >
              <HomeIcon />
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box className="loan-form">
        <Typography variant="h4" gutterBottom>
          Dodaj Wypożyczenie
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={books.map((book) => book.title)}
                value={formik.values.bookTitle}
                onChange={(event, value) =>
                  formik.setFieldValue("bookTitle", value || "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tytuł książki"
                    variant="outlined"
                    error={
                      formik.touched.bookTitle &&
                      Boolean(formik.errors.bookTitle)
                    }
                    helperText={
                      formik.touched.bookTitle && formik.errors.bookTitle
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={users.map((user) => user.name)}
                value={formik.values.userName}
                onChange={(event, value) =>
                  formik.setFieldValue("userName", value || "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nazwa użytkownika"
                    variant="outlined"
                    error={
                      formik.touched.userName && Boolean(formik.errors.userName)
                    }
                    helperText={
                      formik.touched.userName && formik.errors.userName
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              Add data picker
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Dodaj Wypożyczenie
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default AddLoanPage;
