import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./login-form_NOT_USED/LoginForm";
import BooksList from "./books_list/BooksList";

import BookDetails from "./book_info/BookDetails";
import HomePage from "./home_page/HomePage";
import MainWindowLibrarian from "./main_window_librarian/MainWindowLibrarian";
import MainWindowReader from "./main_window_reader/MainWindowReader";
import ReadersList from "./readers_list/ReadersList";
import LoansList from "./loans_list/LoansList";
import ReviewList from "./review_list/ReviewList";
import AddLoan from "./add_loan/AddLoan";
import AddUser from "./add_user/AddUser";
import AddBook from "./add_book/AddBook";
import ApiProvider from "./api/ApiProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

function App() {
  return (
    <Router>
      <I18nextProvider i18n={i18n}>
        <ApiProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/books" element={<BooksList />} />
            <Route
              path="/mainwindowlibrarian"
              element={<MainWindowLibrarian />}
            />
            <Route path="/mainwindowreader" element={<MainWindowReader />} />
            <Route path="/readers" element={<ReadersList />} />
            <Route path="/loans" element={<LoansList />} />
            <Route path="/reviews" element={<ReviewList />} />
            <Route path="/addLoan" element={<AddLoan />} />
            {/*<Route path="" element={<BooksList />} />*/}
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/addBook" element={<AddBook />} />
            <Route path="/book/:id" element={<BookDetails />} />
            {/*<Route path="*" element={<h1>404</h1>} />*/}
          </Routes>
        </ApiProvider>
      </I18nextProvider>
    </Router>
  );
}
export default App;
