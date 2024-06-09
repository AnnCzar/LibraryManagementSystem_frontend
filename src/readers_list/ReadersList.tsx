import "./ReadersList.css";
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
import { TableHead, TextField, Menu, MenuItem, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
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

function createData(
  id: number,
  username: string,
  email: string,
  fullUserName: string,
) {
  return { id, username, email, fullUserName };
}

const users = [
  createData(1, "jdoe", "jdoe@example.com", "John Doe"),
  createData(2, "asmith", "asmith@example.com", "Alice Smith"),
  createData(3, "bjones", "bjones@example.com", "Bob Jones"),
  createData(4, "ksmith", "ksmith@example.com", "Kevin Smith"),
  createData(5, "hpotter", "hpotter@hogwarts.edu", "Harry Potter"),
  createData(6, "hgranger", "hgranger@hogwarts.edu", "Hermione Granger"),
  createData(7, "rweasley", "rweasley@hogwarts.edu", "Ron Weasley"),
].sort((a, b) => a.id - b.id);

const validationSchema = Yup.object().shape({
  search: Yup.string().max(255).label("Search"),
});

export default function UsersList() {
  const { t } = useTranslation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = React.useState<number | null>(null);

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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLTableRowElement>,
    userId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    // Implement user deletion logic here
    handleMenuClose();
  };

  const handleEditUser = () => {
    // Implement user editing logic here
    handleMenuClose();
  };

  const filteredRows = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <div className="users-list">
      <h1 style={{ textAlign: "center", color: "#b1a20f" }}>
        {t("listOfUsers")}
      </h1>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
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
              <TableCell>{t("username")}</TableCell>
              <TableCell>{t("email")}</TableCell>
              <TableCell>{t("fullName")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredRows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : filteredRows
            ).map((user) => (
              <TableRow
                key={user.id}
                onClick={(event) => handleMenuOpen(event, user.id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fullUserName}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={4}
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditUser}>{t("editUser")}</MenuItem>
        <MenuItem onClick={handleDeleteUser}>{t("deleteUser")}</MenuItem>
      </Menu>
    </div>
  );
}
