import "./BooksList.css";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
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
import { TableHead, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApi } from "../api/ApiProvider";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  const theme = useTheme();
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
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const validationSchema = Yup.object().shape({
  search: Yup.string().max(255).label("Search"),
});

export default function CustomPaginationActionsTable() {
  const { t } = useTranslation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [books, setBooks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const apiClient = useApi();

  useEffect(() => {
    const fetchBooks = async () => {
      const result = await apiClient.getBooks();
      if (result.success) {
        setBooks(result.data);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

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

  const handleDelete = async (id: number) => {
    const result = await apiClient.deleteBook(id);
    if (result.success) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const filteredRows = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <div className="books-list">
      <h1 style={{ textAlign: "center", color: "#b1a20f" }}>
        {t("listOfBooks")}
      </h1>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
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
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 500, margin: "auto" }}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow>
              <TableCell>{t("id")}</TableCell>
              <TableCell>{t("isbn")}</TableCell>
              <TableCell>{t("title")}</TableCell>
              <TableCell>{t("author")}</TableCell>
              <TableCell>{t("publisher")}</TableCell>
              <TableCell>{t("yearOfPublication")}</TableCell>
              <TableCell>{t("numberOfCopies")}</TableCell>
              <TableCell>{t("deleteBook")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredRows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : filteredRows
            ).map((book) => (
              <TableRow
                key={book.id}
                component={Link}
                to={`/book/${book.id}`}
                style={{ textDecoration: "none" }}
              >
                <TableCell component="th" scope="row">
                  {book.id}
                </TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.publishYear}</TableCell>
                <TableCell>{book.numberCopy}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(book.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={8}
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
