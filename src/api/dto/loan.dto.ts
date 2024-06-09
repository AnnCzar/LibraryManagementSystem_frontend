export class LoanDto {
  book: string | undefined;
  user: string | undefined;
  loanDate: Date;
  loanEndDate: Date;

  constructor(
    book?: string,
    user?: string,
    loanDate?: Date,
    loanEndDate?: Date,
  ) {
    this.book = book;
    this.user = user;
    this.loanDate = loanDate || new Date();
    this.loanEndDate = loanEndDate || new Date();
  }
}

export class LoanResponseDto {}
