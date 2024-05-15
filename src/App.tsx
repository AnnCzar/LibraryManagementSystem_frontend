import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./login-form/LoginForm";
import BooksList from "./books_list/BooksList";

import BookDetails from "./book_info/BookDetails";
function App() {
  //   return (
  //     <>
  //       <LoginForm></LoginForm>
  //       {/*<BooksList></BooksList>*/}
  //     </>
  //   );
  // }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BooksList />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
}
export default App;
