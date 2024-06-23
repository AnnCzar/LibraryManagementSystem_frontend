import "./LoansList.css";

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
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

import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
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

export default function LoansListReader() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const apiClient = useApi();

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getLoans(page, rowsPerPage);
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
          setTotalRows(response.data.totalItem);
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
  }, [page, rowsPerPage, apiClient]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (values: { search: string }) => {
    setSearchTerm(values.search);
    setPage(0);
  };

  const filteredRows = loans.filter((loan) =>
    loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

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
              to="/mainwindowreader"
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
                    color: "#808080", // Szary kolor dla etykiety (label) pola
                  },
                  "& input": {
                    color: "#333", // Czarny kolor tekstu pola
                  },
                  "& input:hover": {
                    color: "#666", // Ciemnoszary kolor tekstu podczas najechania
                  },
                  "& input:focus": {
                    color: "#000", // Czarny kolor tekstu po kliknięciu
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
            sx={{ minWidth: 500, margin: "auto" }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow>
                <TableCell>{t("loanId")}</TableCell>
                <TableCell>{t("bookTitle")}</TableCell>
                <TableCell>{t("username")}</TableCell>
                <TableCell>{t("loanDate")}</TableCell>
                <TableCell>{t("loanEndDate")}</TableCell>
                <TableCell>{t("returnDate")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((loan) => (
                  <TableRow key={loan.loanid}>
                    <TableCell>{loan.loanid}</TableCell>
                    <TableCell>{loan.book.title}</TableCell>
                    <TableCell>{loan.user.username}</TableCell>
                    <TableCell>{loan.loanDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      {loan.loanEndDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {loan.returnDate
                        ? loan.returnDate.toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={6}
                  count={totalRows}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
