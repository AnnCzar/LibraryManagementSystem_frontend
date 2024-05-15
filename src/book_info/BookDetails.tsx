import React from "react";
import { useParams } from "react-router-dom";
import { books, Book } from "../bookdData";
import { Typography, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const book = books.find((b) => b.id === parseInt(id || "0", 10));

  if (!book) {
    return (
      <Paper
        sx={{
          margin: 2,
          padding: 2,
          textAlign: "center",
          backgroundColor: "#0e3a48",
          color: "#b1a20f",
        }}
      >
        <Typography variant="h6" color="inherit">
          No book found!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        margin: 2,
        padding: 2,
        backgroundColor: "#0e3a48",
        color: "#b1a20f",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        align="center"
        color="inherit"
        gutterBottom
      >
        Informacje o książce
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
          <Table>
            <TableHead></TableHead>
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
  );
};

export default BookDetail;
