import "./ReadersList.css";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
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
  IconButton,
  TableHead,
  TextField,
  Menu,
  MenuItem,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApi } from "../api/ApiProvider";
import { useEffect, useState } from "react";
import { PatchUserDto } from "../api/library-client";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}
interface User {
  id: number;
  fullUserName: string;
  email: string;
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

export default function UsersList() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [readers, setReaders] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deletedUsername, setDeletedUsername] = useState<string | null>(null);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [userToEdit, setUserToEdit] = useState<PatchUserDto>({
    fullName: "",
    email: "",
  });

  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false);

  const apiClient = useApi();

  useEffect(() => {
    const fetchReaders = async () => {
      const result = await apiClient.getReaders();
      if (result.success) {
        setReaders(result.data);
      }
      setLoading(false);
    };

    fetchReaders();
  }, [apiClient]);

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

  const handleDeleteUser = async () => {
    if (selectedUser === null) return;
    const readerToDelete = readers.find((reader) => reader.id === selectedUser);
    if (!readerToDelete) return;

    const result = await apiClient.deleteUser(selectedUser);
    if (result.success) {
      setReaders(readers.filter((reader) => reader.id !== selectedUser));
      setDeletedUsername(readerToDelete.username);
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  // const handleEditUser = () => {
  //   if (selectedUser === null) return;
  //
  //   const readerToEdit = readers.find((reader) => reader.id === selectedUser);
  //   if (readerToEdit) {
  //     setUserToEdit({ ...readerToEdit, fullName: readerToEdit.fullname });
  //     setEditDialogOpen(true);
  //   }
  //   handleMenuClose();
  // };
  // const handleEditUser = () => {
  //   if (selectedUser === null) return;
  //
  //   const readerToEdit = readers.find((reader) => reader.id === selectedUser);
  //   console.log(readerToEdit);
  //   if (readerToEdit) {
  //     handleEditDialogOpen(readerToEdit);
  //   }
  //   handleMenuClose();
  // };

  const handleEditDialogOpen = (user: User) => {
    setUserToEdit({
      fullName: user.fullUserName,
      email: user.email,
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditUser = () => {
    if (selectedUser === null) return;

    const readerToEdit = readers.find((reader) => reader.id === selectedUser);
    if (readerToEdit) {
      setSelectedUserId(readerToEdit.id); // Ensure selectedUserId is set here
      setUserToEdit({
        fullName: readerToEdit.fullUserName,
        email: readerToEdit.email,
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleUpdateUser = async () => {
    if (!selectedUserId) {
      console.error("No user ID provided for update.");
      return;
    }

    try {
      const result = await apiClient.updateUserInfo({
        id: selectedUserId,
        email: userToEdit.email,
        fullusername: userToEdit.fullName,
      });

      if (result.success) {
        const updatedReaders = readers.map((reader) =>
          reader.id === selectedUserId
            ? {
                ...reader,
                fullusername: userToEdit.fullName,
                email: userToEdit.email,
              }
            : reader,
        );
        setReaders(updatedReaders);
        setUpdateSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }

    handleEditDialogClose();
  };

  const handleUserEditChange =
    (prop: keyof PatchUserDto) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUserToEdit({ ...userToEdit, [prop]: event.target.value });
    };

  const filteredRows = readers.filter((reader) =>
    reader.username.toLowerCase().includes(searchTerm.toLowerCase()),
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
            ).map((reader) => (
              <TableRow
                key={reader.id}
                onClick={(event) => handleMenuOpen(event, reader.id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {reader.id}
                </TableCell>
                <TableCell>{reader.username}</TableCell>
                <TableCell>{reader.email}</TableCell>
                <TableCell>{reader.fullusername}</TableCell>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {deletedUsername && `${deletedUsername} został usunięty`}
        </Alert>
      </Snackbar>
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={userToEdit.fullName}
            onChange={handleUserEditChange("fullName")}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={userToEdit.email}
            onChange={handleUserEditChange("email")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateUser}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={updateSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setUpdateSnackbarOpen(false)}
      >
        <Alert onClose={() => setUpdateSnackbarOpen(false)} severity="success">
          User updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
