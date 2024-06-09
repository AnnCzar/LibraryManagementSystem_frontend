import React from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import "./AddLoan.css";
import { LoanDto } from "../api/dto/loan.dto";
import { useApi } from "../api/ApiProvider";
import { useTranslation } from "react-i18next";

const validationSchema = Yup.object({
  bookId: Yup.number().required("Wprowadź ID książki"),
  userId: Yup.number().required("Wprowadź ID użytkownika"),
  endDate: Yup.date().nullable().required("Wybierz datę końcową"),
});

const AddLoanPage: React.FC = () => {
  const { t } = useTranslation();
  const apiClient = useApi();
  const formik = useFormik({
    initialValues: {
      bookId: "",
      userId: "",
      endDate: null as Date | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Dodano wypożyczenie:", values);

      const createLoanDto: LoanDto = {
        book: values.bookId || undefined,
        user: values.userId || undefined,
        loanDate: new Date(),
        loanEndDate: values.endDate || new Date(),
      };

      try {
        const response = await apiClient.addLoan(createLoanDto);
        if (response.statusCode == 201) {
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
                <TextField
                  id="bookId"
                  label={t("bookId")}
                  variant="outlined"
                  fullWidth
                  value={formik.values.bookId}
                  onChange={formik.handleChange}
                  error={formik.touched.bookId && Boolean(formik.errors.bookId)}
                  helperText={formik.touched.bookId && formik.errors.bookId}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="userId"
                  label={t("userId")}
                  variant="outlined"
                  fullWidth
                  value={formik.values.userId}
                  onChange={formik.handleChange}
                  error={formik.touched.userId && Boolean(formik.errors.userId)}
                  helperText={formik.touched.userId && formik.errors.userId}
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
