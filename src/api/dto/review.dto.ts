export interface CreateReviewDto {
  book: string;
  user: string;
  rate: number;
  comment: string;
  reviewDate: Date;
}

export interface CreateReviewResponseDto {
  reviewID: number;
  book: number;
  user: number;
  rate: number;
  comment: string;
  reviewDate: Date;
}
