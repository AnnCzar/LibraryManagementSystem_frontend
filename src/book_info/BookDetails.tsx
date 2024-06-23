import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import "./BookDetails.css";
import { useApi } from "../api/ApiProvider";
import { useTranslation } from "react-i18next";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  numberCopy: number;
  genre?: string;
  summary?: string;
  coverImageURL?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

const BookDetail = () => {
  const { id } = useParams<{ id?: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedBook, setUpdatedBook] = useState<Book | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const apiClient = useApi();
  const { t } = useTranslation();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchBookData = async () => {
      if (id) {
        const result = await apiClient.getBookDetails(parseInt(id));
        if (result.success && result.data) {
          const bookData: Book = {
            id: result.data.id as number,
            isbn: result.data.isbn || "",
            title: result.data.title || "",
            author: result.data.author || "",
            publisher: result.data.publisher || "",
            publishYear: result.data.publishYear || 0,
            numberCopy: result.data.numberCopy || 0,
            genre: result.data.genre,
            summary: result.data.summary,
            coverImageURL: result.data.coverImageURL,
          };
          setBook(bookData);
          setUpdatedBook(bookData);
        } else {
          console.error("Failed to fetch book details:", result.statusCode);
          setBook(null);
        }
      }
    };

    fetchBookData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedBook((prevBook) => ({
      ...prevBook!,
      [name]: value,
    }));
  };

  const handleUpdateClick = async () => {
    if (updatedBook) {
      const updateBookData = {
        id: updatedBook.id,
        isbn: updatedBook.isbn,
        title: updatedBook.title,
        author: updatedBook.author,
        publisher: updatedBook.publisher,
        publishYear: updatedBook.publishYear,
        numberCopy: updatedBook.numberCopy,
      };

      const updateBookDetailsData = {
        id: updatedBook.id,
        genre: updatedBook.genre,
        summary: updatedBook.summary,
        coverImageURL: updatedBook.coverImageURL,
      };

      const [bookUpdateResult, bookDetailsUpdateResult] = await Promise.all([
        apiClient.updateBook(updateBookData),
        apiClient.updateBookDetails(updateBookDetailsData),
      ]);

      if (bookUpdateResult.success && bookDetailsUpdateResult.success) {
        setBook(updatedBook);
        setEditMode(false);
        setNotification({
          message: t("bookUpdateSuccess"),
          severity: "success",
        });
      } else {
        setNotification({
          message: t("bookUpdateFailure"),
          severity: "error",
        });
        console.error("Failed to update book details");
      }
    }
  };

  function back() {
    if (role === "ROLE_LIBRARIAN") {
      return "/books";
    }
    if (role === "ROLE_READER") {
      return `/bookslist`;
    }
    return "";
  }

  if (!book) {
    return (
      <Paper className="book-detail-container content">
        <Typography variant="h6" color="inherit">
          No book found!
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="book-detail-container">
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

      <Paper className="content" elevation={3}>
        <Typography
          variant="h5"
          component="h1"
          className="title"
          color="inherit"
          gutterBottom
        >
          {t("bookInfo")}
        </Typography>

        {book.coverImageURL && (
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <img
              src={book.coverImageURL}
              alt="Book Cover"
              style={{ maxWidth: "100%", maxHeight: "500px" }}
            />
          </Box>
        )}

        {editMode ? (
          <Box className="edit_mode">
            <TextField
              name="title"
              label={t("bookTitle")}
              value={updatedBook?.title || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="author"
              label={t("author")}
              value={updatedBook?.author || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="publisher"
              label={t("publisher")}
              value={updatedBook?.publisher || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="isbn"
              label="ISBN"
              value={updatedBook?.isbn || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="publishYear"
              label={t("publishYear")}
              value={updatedBook?.publishYear || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="numberCopy"
              label={t("numberCopy")}
              value={updatedBook?.numberCopy || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="genre"
              label={t("genre")}
              value={updatedBook?.genre || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="summary"
              label={t("summary")}
              value={updatedBook?.summary || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="coverImageURL"
              value={updatedBook?.coverImageURL || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            {role === "ROLE_LIBRARIAN" && (
              <Button
                className="update-button-save"
                variant="contained"
                color="primary"
                onClick={handleUpdateClick}
              >
                {t("save")}
              </Button>
            )}
          </Box>
        ) : (
          <Box className="table-container">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {t("bookTitle")}
                    </TableCell>
                    <TableCell align="right">{book.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {t("author")}
                    </TableCell>
                    <TableCell align="right">{book.author}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {t("publisher")}
                    </TableCell>
                    <TableCell align="right">{book.publisher}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      ISBN
                    </TableCell>
                    <TableCell align="right">{book.isbn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {t("publishYear")}
                    </TableCell>
                    <TableCell align="right">{book.publishYear}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {t("numberCopy")}
                    </TableCell>
                    <TableCell align="right">{book.numberCopy}</TableCell>
                  </TableRow>
                  {book.genre && (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t("genre")}
                      </TableCell>
                      <TableCell align="right">{book.genre}</TableCell>
                    </TableRow>
                  )}
                  {book.summary && (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t("summary")}
                      </TableCell>
                      <TableCell align="right">{book.summary}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {role === "ROLE_LIBRARIAN" && (
          <Box className="button-container">
            <Button
              className="update-button"
              variant="contained"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? t("cancel") : t("updateData")}
            </Button>
          </Box>
        )}
      </Paper>
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.severity}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BookDetail;
