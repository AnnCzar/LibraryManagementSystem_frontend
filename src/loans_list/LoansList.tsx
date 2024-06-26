import "./LoansList.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TableHead,
  TextField,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useApi } from "../api/ApiProvider";
import { useTranslation } from "react-i18next";

interface Loan {
  loanid: number;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    publishYear: number;
    numberCopy: number;
  };
  user: {
    id: number;
    username: string;
    email: string;
    fullusername?: string;
  };
  loanDate: Date;
  loanEndDate: Date;
  returnDate?: Date;
}

const validationSchema = Yup.object().shape({
  search: Yup.string().max(255).label("Search"),
});

export default function LoansList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const apiClient = useApi();

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getLoans();
        if (response.success && Array.isArray(response.data.loans)) {
          setLoans(
            response.data.loans.map(
              (loan: {
                loanDate: string | number | Date;
                loanEndDate: string | number | Date;
                returnDate: string | number | Date;
              }) => ({
                ...loan,
                loanDate: new Date(loan.loanDate),
                loanEndDate: new Date(loan.loanEndDate),
                returnDate: loan.returnDate ? new Date(loan.returnDate) : null,
              }),
            ),
          );
        } else {
          console.error("Data received is not an array:", response.data);
          setLoans([]);
        }
      } catch (error) {
        console.error("Failed to fetch loans:", error);
        setLoans([]);
      }
      setLoading(false);
    };

    fetchLoans();
  }, [apiClient]);

  const handleSearch = (values: { search: string }) => {
    setSearchTerm(values.search);
  };

  const handleReturn = async (loanId: number) => {
    try {
      const response = await apiClient.updateLoanReturnDate(loanId, new Date());
      if (response.success) {
        setLoans((prevLoans) =>
          prevLoans.map((loan) =>
            loan.loanid === loanId ? { ...loan, returnDate: new Date() } : loan,
          ),
        );
      } else {
        console.error("Failed to update return date");
      }
    } catch (error) {
      console.error("Error updating return date:", error);
    }
  };

  const filteredRows = loans.filter(
    (loan) =>
      loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="loans-list-container">
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
      <Box sx={{ flexGrow: 1, padding: 5 }} className="search-container">
        <h1 style={{ textAlign: "center", color: "#b1a20f" }}>
          {t("listOfLoans")}
        </h1>
        <Formik
          initialValues={{ search: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSearch}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                variant="outlined"
                label={t("search")}
                name="search"
                sx={{
                  "& label": {
                    color: "#808080",
                  },
                  "& input": {
                    color: "#333",
                  },
                  "& input:hover": {
                    color: "#666",
                  },
                  "& input:focus": {
                    color: "#000",
                  },
                }}
                error={touched.search && Boolean(errors.search)}
                helperText={touched.search && errors.search}
              />
            </Form>
          )}
        </Formik>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 500 }}
            aria-label="custom pagination table"
            className="loans-table"
          >
            <TableHead>
              <TableRow>
                <TableCell>{t("loanId")}</TableCell>
                <TableCell>{t("bookTitle")}</TableCell>
                <TableCell>{t("userName")}</TableCell>
                <TableCell>{t("loanDate")}</TableCell>
                <TableCell>{t("loanEndDate")}</TableCell>
                <TableCell>{t("returnDate")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((loan) => (
                <TableRow key={loan.loanid}>
                  <TableCell>{loan.loanid}</TableCell>
                  <TableCell>{loan.book.title}</TableCell>
                  <TableCell>{loan.user.username}</TableCell>
                  <TableCell>{loan.loanDate.toLocaleDateString()}</TableCell>
                  <TableCell>{loan.loanEndDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {loan.returnDate ? (
                      loan.returnDate.toLocaleDateString()
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleReturn(loan.loanid)}
                      >
                        Mark as Returned
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
