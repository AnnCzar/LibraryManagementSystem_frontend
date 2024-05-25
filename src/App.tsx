import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./login-form_NOT_USED/LoginForm";
import BooksList from "./books_list/BooksList";

import BookDetails from "./book_info/BookDetails";
import HomePage from "./home_page/HomePage";
import MainWindowLibrarian from "./main_window_librarian/MainWindowLibrarian";
import ReadersList from "./readers_list/ReadersList";
import LoansList from "./loans_list/LoansList";
import ReviewList from "./review_list/ReviewList";
import AddLoan from "./add_loan/AddLoan";
import AddUser from "./add_user/AddUser";
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/mainwindowlibrarian" element={<MainWindowLibrarian />} />
        <Route path="/readers" element={<ReadersList />} />
        <Route path="/loans" element={<LoansList />} />
        <Route path="/reviews" element={<ReviewList />} />
        <Route path="/addLoan" element={<AddLoan />} />
        {/*<Route path="" element={<BooksList />} />*/}
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
}
export default App;
