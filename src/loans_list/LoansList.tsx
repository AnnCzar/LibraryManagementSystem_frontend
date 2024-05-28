import "./LoansList.css";
import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Button, TableHead, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

function createLoanData(
  loanid: number,
  bookTitle: string,
  userName: string,
  loanDate: any,
  loanEndDate: any,
  returnDate: any,
) {
  return { loanid, bookTitle, userName, loanDate, loanEndDate, returnDate };
}

// eslint-disable-next-line react-hooks/rules-of-hooks

const validationSchema = Yup.object().shape({
  search: Yup.string().max(255).label("Search"),
});

export default function LoansList() {
  const [loansData, setLoansData] = React.useState([
    createLoanData(
      1,
      "Władca Pierścieni",
      "jdoe",
      new Date(2024, 4, 1),
      new Date(2024, 4, 29),
      null,
    ),
    createLoanData(
      2,
      "Harry Potter i Kamień Filozoficzny",
      "asmith",
      new Date(2024, 4, 3),
      new Date(2024, 4, 31),
      null,
    ),
    createLoanData(
      3,
      "Metro 2033",
      "bjones",
      new Date(2024, 4, 6),
      new Date(2024, 5, 2),
      null,
    ),
    createLoanData(
      4,
      "Zbrodnia i Kara",
      "ksmith",
      new Date(2024, 4, 10),
      new Date(2024, 5, 8),
      null,
    ),
    createLoanData(
      5,
      "1984",
      "hpotter",
      new Date(2024, 4, 14),
      new Date(2024, 5, 12),
      null,
    ),
    createLoanData(
      6,
      "Nocny Patrol",
      "hgranger",
      new Date(2024, 4, 18),
      new Date(2024, 5, 16),
      null,
    ),
    createLoanData(
      7,
      "Wzgórze Psów",
      "rweasley",
      new Date(2024, 4, 22),
      new Date(2024, 5, 20),
      null,
    ),
  ]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState("");

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

  const filteredRows = loansData.filter((loan) =>
    loan.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;
  return (
    <div className="loans-list-container">
      <h1>List of Loans</h1>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {" "}
        <AppBar className="app-bar" component="nav">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Library
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
                label="Search"
                name="search"
                error={touched.search && Boolean(errors.search)}
                helperText={touched.search && errors.search}
              />
            </Form>
          )}
        </Formik>
      </Box>

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 500, margin: "auto" }}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Loan ID</TableCell>
              <TableCell>Book Title</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Loan Date</TableCell>
              <TableCell>Loan End Date</TableCell>
              <TableCell>Return Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredRows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : filteredRows
            ).map((loan) => (
              <TableRow key={loan.loanid}>
                <TableCell>{loan.loanid}</TableCell>
                <TableCell>{loan.bookTitle}</TableCell>
                <TableCell>{loan.userName}</TableCell>
                <TableCell>{loan.loanDate.toLocaleDateString()}</TableCell>
                <TableCell>{loan.loanEndDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  {loan.returnDate ? (
                    loan.returnDate.toLocaleDateString()
                  ) : (
                    <button
                      onClick={() => {
                        const updatedLoansData = loansData.map((l) => {
                          if (l.loanid === loan.loanid) {
                            return { ...l, returnDate: new Date() }; // Aktualizuj tylko pojedynczy wiersz
                          }
                          return l;
                        });
                        setLoansData(updatedLoansData); // Aktualizuj całą listę pożyczek
                      }}
                    >
                      Return
                    </button>
                  )}
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
                count={filteredRows.length}
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
    </div>
  );
}
