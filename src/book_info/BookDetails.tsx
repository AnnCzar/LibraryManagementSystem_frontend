import React from "react";
import { useParams, Link } from "react-router-dom";
import { books } from "../bookdData"; // Ensure your book data import is correct
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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import "./BookDetails.css"; // Import the CSS file
const BookDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const book = books.find((b) => b.id === parseInt(id || "0", 10));

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
            Library
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button sx={{ color: "#fff" }} component={Link} to="/books">
              <HomeIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Paper className="content">
        <Typography
          variant="h5"
          component="h1"
          className="title"
          color="inherit"
          gutterBottom
        >
          Informacje o książce
        </Typography>
        <Box className="table-container">
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 500, margin: "auto" }}
              aria-label="custom pagination table"
            >
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Tytuł
                  </TableCell>
                  <TableCell align="right">{book.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Autor
                  </TableCell>
                  <TableCell align="right">{book.author}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Wydawca
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
                    Rok wydania
                  </TableCell>
                  <TableCell align="right">{book.publishYear}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Dostępna ilość
                  </TableCell>
                  <TableCell align="right">{book.numberCopy}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </div>
  );
};

export default BookDetail;
