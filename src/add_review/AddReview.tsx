import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  AppBar,
  Toolbar,
  Autocomplete,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useApi } from "../api/ApiProvider";
import { useTranslation } from "react-i18next";
import "./AddReview.css";

interface Book {
  id: number;
  title: string;
}

interface Reader {
  id: number;
  username: string;
}

const validationSchema = Yup.object({
  bookId: Yup.string().required("Wprowadź tytuł książki"),
  rate: Yup.number().required("Wprowadź ocenę").min(1).max(5),
  comment: Yup.string().required("Wprowadź komentarz"),
});

const AddReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const apiClient = useApi();
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await apiClient.getBooks();
      if (response.success) {
        setBooks(response.data);
      }
    };

    fetchBooks();
  }, [apiClient]);

  const formik = useFormik({
    initialValues: {
      bookId: "",
      rate: "",
      comment: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const selectedBook = books.find((book) => book.title === values.bookId);
      const userId = localStorage.getItem("user_id");

      if (!selectedBook || !userId) {
        console.error("Invalid book or user ID");
        return;
      }

      const createReviewDto = {
        book: selectedBook.id.toString(),
        user: userId,
        rate: parseInt(values.rate),
        comment: values.comment,
        reviewDate: new Date(),
      };

      try {
        const response = await apiClient.addReview(createReviewDto);
        if (response.success) {
          console.log("Review added successfully:", response.data);
          formik.resetForm();
        } else {
          console.error("Failed to add review:", response.statusCode);
        }
      } catch (error) {
        console.error("Error adding review:", error);
      }
    },
  });
  function back() {
    if (role === "ROLE_READER") {
      return "/mainwindowreader";
    } else if (role === "ROLE_LIBRARIAN") {
      return "/mainwindowlibrarian";
    } else {
      return "/";
    }
  }

  return (
    <Box className="add-review-container">
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
            <Button sx={{ color: "#fff" }} component={Link} to={back()}>
              <HomeIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box className="review-page">
        <Paper elevation={3} className="form-paper">
          <Typography variant="h4" className="form-title">
            {t("addReview")}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={8}>
                <Autocomplete
                  id="bookId"
                  options={books.map((book) => book.title)}
                  value={formik.values.bookId}
                  onChange={(event, value) =>
                    formik.setFieldValue("bookId", value)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("bookTitle")}
                      variant="outlined"
                      fullWidth
                      error={
                        formik.touched.bookId && Boolean(formik.errors.bookId)
                      }
                      helperText={formik.touched.bookId && formik.errors.bookId}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="rate"
                  label={t("rate")}
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formik.values.rate}
                  onChange={formik.handleChange}
                  error={formik.touched.rate && Boolean(formik.errors.rate)}
                  helperText={formik.touched.rate && formik.errors.rate}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="comment"
                  label={t("comment")}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.comment && Boolean(formik.errors.comment)
                  }
                  helperText={formik.touched.comment && formik.errors.comment}
                />
              </Grid>
              <Grid item xs={5}>
                <Button className="button-review" fullWidth type="submit">
                  {t("addReview")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddReviewPage;
