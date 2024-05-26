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

function createData(
  id: number,
  isbn: number,
  title: string,
  author: string,
  publisher: string,
  publishYear: number,
  numberCopy: number,
) {
  return { id, isbn, title, author, publisher, publishYear, numberCopy };
}

const books = [
  createData(
    1,
    9783161484100,
    "Władca Pierścieni",
    "J.R.R. Tolkien",
    "HarperCollins",
    1954,
    5,
  ),
  createData(
    2,
    9788376485863,
    "Harry Potter i Kamień Filozoficzny",
    "J.K. Rowling",
    "Media Rodzina",
    1997,
    10,
  ),
  createData(
    3,
    9788373191723,
    "Metro 2033",
    "Dmitry Glukhovsky",
    "Insignis",
    2005,
    7,
  ),
  createData(
    4,
    9788378398058,
    "Zbrodnia i Kara",
    "Fiodor Dostojewski",
    "Wydawnictwo Literackie",
    1866,
    3,
  ),
  createData(5, 9788377859455, "1984", "George Orwell", "Amber", 1949, 6),
  createData(
    6,
    9788377580961,
    "Nocny Patrol",
    "Sergei Lukyanenko",
    "Wydawnictwo Fabryka Słów",
    2006,
    8,
  ),
  createData(
    7,
    9788375069990,
    "Wzgórze Psów",
    "Andrzej Zimniak",
    "Iskry",
    2015,
    4,
  ),
  createData(
    8,
    9788374690035,
    "Pan Tadeusz",
    "Adam Mickiewicz",
    "Wydawnictwo Albatros",
    1834,
    12,
  ),
  createData(
    9,
    9788374951168,
    "Wiedźmin: Ostatnie Życzenie",
    "Andrzej Sapkowski",
    "SuperNOWA",
    1993,
    9,
  ),
  createData(
    10,
    9788377792684,
    "Gra o Tron",
    "George R.R. Martin",
    "Zysk i S-ka",
    1996,
    11,
  ),
  createData(
    11,
    9788373196919,
    "Duma i Uprzedzenie",
    "Jane Austen",
    "Znak",
    1813,
    5,
  ),
  createData(
    12,
    9788375470203,
    "Pan Wołodyjowski",
    "Henryk Sienkiewicz",
    "Wydawnictwo Dolnośląskie",
    1888,
    8,
  ),
  createData(
    13,
    9788379883111,
    "Dracula",
    "Bram Stoker",
    "Wydawnictwo MG",
    1897,
    7,
  ),
  createData(
    14,
    9788375342241,
    "Władca Much",
    "William Golding",
    "Zysk i S-ka",
    1954,
    6,
  ),
  createData(
    15,
    9788377690882,
    "Złodziejka Książek",
    "Markus Zusak",
    "Znak",
    2005,
    10,
  ),
  createData(
    16,
    9788375230295,
    "Niebezpieczne Związki",
    "Pierre Choderlos de Laclos",
    "Zysk i S-ka",
    1782,
    4,
  ),
  createData(
    17,
    9788379872245,
    "Czas Pogardy",
    "Andrzej Sapkowski",
    "SuperNOWA",
    1995,
    9,
  ),
  createData(
    18,
    9788379721505,
    "Podróże Guliwera",
    "Jonathan Swift",
    "Wydawnictwo Albatros",
    1726,
    6,
  ),
  createData(
    19,
    9788373194137,
    "Dziennik Bridget Jones",
    "Helen Fielding",
    "Świat Książki",
    1996,
    3,
  ),
  createData(
    20,
    9788366086570,
    "Hobbit, czyli Tam i Z Powrotem",
    "J.R.R. Tolkien",
    "Amber",
    1937,
    8,
  ),
].sort((a, b) => a.id - b.id);

const validationSchema = Yup.object().shape({
  search: Yup.string().max(255).label("Search"),
});

export default function CustomPaginationActionsTable() {
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

  const filteredRows = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <div className="books-list">
      <h1 style={{ textAlign: "center", color: "#b1a20f" }}>List of Books</h1>
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
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 500, margin: "auto" }}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Year of publication</TableCell>
              <TableCell>Number of copies</TableCell>
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
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={7}
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
