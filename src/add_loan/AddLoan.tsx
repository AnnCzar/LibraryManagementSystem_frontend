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
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { LoanDto } from "../api/dto/loan.dto";
import { useApi } from "../api/ApiProvider";
import { useTranslation } from "react-i18next";
import "./AddLoan.css";
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
  userId: Yup.string().required("Wprowadź nazwę użytkownika"),
  endDate: Yup.date().nullable().required("Wybierz datę końcową"),
});

const AddLoanPage: React.FC = () => {
  const { t } = useTranslation();
  const apiClient = useApi();
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await apiClient.getBooks();
      if (response.success) {
        setBooks(response.data);
      }
    };

    const fetchReaders = async () => {
      const response = await apiClient.getReaders();
      if (response.success) {
        setReaders(response.data);
      }
    };

    fetchBooks();
    fetchReaders();
  }, [apiClient]);

  const formik = useFormik({
    initialValues: {
      bookId: "",
      userId: "",
      endDate: null as Date | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const selectedBook = books.find((book) => book.title === values.bookId);
      const selectedReader = readers.find(
        (reader) => reader.username === values.userId,
      );

      if (!selectedBook || !selectedReader) {
        console.error("Invalid book or user selected");
        return;
      }

      const createLoanDto: LoanDto = {
        book: selectedBook.id.toString(), // Convert number to string
        user: selectedReader.id.toString(), // Convert number to string
        loanDate: new Date(),
        loanEndDate: values.endDate || new Date(),
      };

      try {
        const response = await apiClient.addLoan(createLoanDto);
        if (response.success) {
          console.log("Loan added successfully:", response.data);
          formik.resetForm();
        } else {
          console.error("Failed to add loan:", response.statusCode);
        }
      } catch (error) {
        console.error("Error adding loan:", error);
      }
    },
  });

  return (
    <Box className="add-loan-container">
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

      <Box className="loan-page">
        <Paper elevation={3} className="form-paper">
          <Typography variant="h4" className="form-title">
            {t("addLoan")}
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
                <Autocomplete
                  id="userId"
                  options={readers.map((reader) => reader.username)}
                  value={formik.values.userId}
                  onChange={(event, value) =>
                    formik.setFieldValue("userId", value)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("username")}
                      variant="outlined"
                      fullWidth
                      error={
                        formik.touched.userId && Boolean(formik.errors.userId)
                      }
                      helperText={formik.touched.userId && formik.errors.userId}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="endDate"
                  label={t("endDate")}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  variant="outlined"
                  value={
                    formik.values.endDate
                      ? formik.values.endDate.toISOString().substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    formik.setFieldValue("endDate", new Date(e.target.value))
                  }
                  error={
                    formik.touched.endDate && Boolean(formik.errors.endDate)
                  }
                  helperText={formik.touched.endDate && formik.errors.endDate}
                />
              </Grid>
              <Grid item xs={5}>
                <Button className="button-loan" fullWidth type="submit">
                  {t("addLoan")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddLoanPage;
