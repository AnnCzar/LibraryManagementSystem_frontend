import React, { useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";

interface Review {
  id: number;
  book: string;
  user: string;
  rate: number;
  comment: string;
  reviewDate: Date;
}

const sampleReviews: Review[] = [
  {
    id: 1,
    book: "Harry Potter i Kamień Filozoficzny",
    user: "asmith",
    rate: 5,
    comment: "Niesamowita książka! Zdecydowanie polecam.",
    reviewDate: new Date(2024, 4, 3),
  },
  {
    id: 2,
    book: "Władca Pierścieni: Drużyna Pierścienia",
    user: "bjones",
    rate: 4,
    comment: "Fantastyczna podróż przez Śródziemie.",
    reviewDate: new Date(2024, 4, 10),
  },
  {
    id: 3,
    book: "1984",
    user: "ckim",
    rate: 3,
    comment: "Ciekawa lektura, ale trochę zbyt mroczna dla mojego gustu.",
    reviewDate: new Date(2024, 4, 17),
  },
  {
    id: 4,
    book: "To",
    user: "dlee",
    rate: 5,
    comment: "Stephen King to geniusz! Nie mogłem oderwać się od tej książki.",
    reviewDate: new Date(2024, 4, 24),
  },
];

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);

  const handleDeleteReview = (id: number) => {
    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);
  };

  return (
    <Paper style={{ margin: "20px", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Recenzje
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Książka</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Użytkownik</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Ocena</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Komentarz</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Data recenzji</TableCell>
            <TableCell style={{ fontWeight: "bold" }}></TableCell>{" "}
            {/* Dodane puste komórki dla przycisków */}
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>{review.id}</TableCell>
              <TableCell>{review.book}</TableCell>
              <TableCell>{review.user}</TableCell>
              <TableCell>{review.rate}</TableCell>
              <TableCell>{review.comment}</TableCell>
              <TableCell>{review.reviewDate.toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Usuń
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ReviewsPage;
