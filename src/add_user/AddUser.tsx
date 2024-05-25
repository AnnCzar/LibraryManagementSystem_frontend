import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const AddUserPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullUserName, setFullUserName] = useState("");
  const [role, setRole] = useState("reader");

  const handleSubmit = () => {
    // Tutaj możesz dodać logikę obsługi dodawania użytkownika
    console.log("Dodano użytkownika:", {
      userName,
      password,
      email,
      fullUserName,
      role,
    });
    // Czyszczenie pól formularza po zatwierdzeniu
    setUserName("");
    setPassword("");
    setEmail("");
    setFullUserName("");
    setRole("reader");
  };

  return (
    <Paper style={{ margin: "20px", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Dodaj użytkownika
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nazwa użytkownika"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="password"
            label="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Adres email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Pełna nazwa użytkownika"
            value={fullUserName}
            onChange={(e) => setFullUserName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Rola</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="reader">Reader</MenuItem>
              <MenuItem value="librarian">Librarian</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Dodaj użytkownika
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddUserPage;
