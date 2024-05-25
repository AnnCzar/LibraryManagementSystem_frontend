import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Autocomplete,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";

const books = [
  {
    id: 1,
    isbn: 9783161484100,
    title: "Władca Pierścieni",
    author: "J.R.R. Tolkien",
    publisher: "HarperCollins",
    year: 1954,
    rating: 5,
  },
  {
    id: 2,
    isbn: 9788376485863,
    title: "Harry Potter i Kamień Filozoficzny",
    author: "J.K. Rowling",
    publisher: "Media Rodzina",
    year: 1997,
    rating: 10,
  },
  // Dodaj więcej danych książek...
];

const users = [
  { id: 1, username: "jdoe", email: "jdoe@example.com", name: "John Doe" },
  {
    id: 2,
    username: "asmith",
    email: "asmith@example.com",
    name: "Alice Smith",
  },
  // Dodaj więcej danych użytkowników...
];

const AddLoanPage: React.FC = () => {
  const [bookTitle, setBookTitle] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleBookTitleChange = (
    event: React.ChangeEvent<{}>,
    value: string | null,
  ) => {
    setBookTitle(value || "");
  };

  const handleUserNameChange = (
    event: React.ChangeEvent<{}>,
    value: string | null,
  ) => {
    setUserName(value || "");
  };

  const handleSubmit = () => {
    // Tutaj można dodać logikę obsługi dodawania wypożyczenia
    console.log("Dodano wypożyczenie:", bookTitle, userName, endDate);
    // Czyszczenie pól formularza po zatwierdzeniu
    setBookTitle("");
    setUserName("");
    setEndDate(null);
  };

  return (
    <Paper style={{ margin: "20px", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Dodaj Wypożyczenie
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={books.map((book) => book.title)}
            value={bookTitle}
            onChange={handleBookTitleChange}
            renderInput={(params) => (
              <TextField {...params} label="Tytuł książki" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={users.map((user) => user.name)}
            value={userName}
            onChange={handleUserNameChange}
            renderInput={(params) => (
              <TextField {...params} label="Nazwa użytkownika" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          chuj nie dziala
          {/*<DesktopDatePicker*/}
          {/*  label="Data końca wypożyczenia"*/}
          {/*  value={endDate}*/}
          {/*  onChange={(date: Date | null) => setEndDate(date)}*/}
          {/*  renderInput={(params) => <TextField {...params} variant="outlined" />}*/}
          {/*/>*/}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Dodaj Wypożyczenie
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddLoanPage;
