import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { useApi } from "../api/ApiProvider";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Home as HomeIcon } from "@mui/icons-material";

interface Review {
  book: {
    id: number;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishYear: number;
    numberCopy: number;
  };
  user: {
    id: number;
    username: string;
    email: string;
    fullusername: string;
  };
  rate: number;
  comment: string;
  reviewDate: number;
  reviewID: number;
}

export default function ReviewList() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const apiClient = useApi();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient.getAllReviews();
        if (response.success) {
          setReviews(response.data);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [apiClient]);

  const handleDeleteReview = async (id: number) => {
    const response = await apiClient.deleteReview(id);
    if (response.success) {
      setReviews(reviews.filter((review) => review.reviewID !== id));
    } else {
      console.error("Failed to delete review");
    }
  };

  return (
    <div className="loans-list-container">
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
      <Box sx={{ flexGrow: 1, padding: 5 }} className="search-container">
        <h1 style={{ textAlign: "center", color: "#b1a20f" }}>
          {t("listOfReviews")}
        </h1>
        <TableContainer component={Paper}>
          <Table aria-label="simple table" className="reviews-table">
            <TableHead>
              <TableRow>
                <TableCell>{t("title")}</TableCell>
                <TableCell>{t("author")}</TableCell>
                <TableCell>{t("rating")}</TableCell>
                <TableCell>{t("comment")}</TableCell>
                <TableCell>{t("reviewDate")}</TableCell>
                {role !== "ROLE_READER" && (
                  <TableCell>{t("deleteReview")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.reviewID}>
                  <TableCell>{review.book.title}</TableCell>
                  <TableCell>{review.book.author}</TableCell>
                  <TableCell>{review.rate}</TableCell>
                  <TableCell>{review.comment}</TableCell>
                  <TableCell>
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </TableCell>
                  {role !== "ROLE_READER" && (
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDeleteReview(review.reviewID)}
                      >
                        {t("delete")}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
