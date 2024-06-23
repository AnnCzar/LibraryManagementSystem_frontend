import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { BookDto, BookResponseDto } from "./dto/book.dto";
import { LoanDto, LoanResponseDto } from "./dto/loan.dto";
import { LoginAndPassword } from "./dto/login1.dto";

import { CreateReviewDto, CreateReviewResponseDto } from "./dto/review.dto";

export type ClientResponse<T> = {
  success: boolean;
  data: T;
  statusCode: number;
};

export interface PatchUserDto {
  fullName: string;
  email: string;
}

export class LibraryClient {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:8081",
    });

    this.client.interceptors.request.use(
      (config) => {
        config.headers = config.headers || {};

        const token = localStorage.getItem("jwtToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access - redirecting to login");
        }
        return Promise.reject(error);
      },
    );
  }

  public async login(data: LoginDto): Promise<{
    role: string | undefined;
    data: LoginResponseDto | undefined;
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse<LoginResponseDto> = await this.client.post(
        "/auth/login",
        data,
      );

      // zapisanie tokena w localStorage
      localStorage.setItem("jwtToken", `${response.data.token}`);
      localStorage.setItem("role", `${response.data.role}`);
      localStorage.setItem("user_id", `${response.data.id}`);

      return {
        success: true,
        data: response.data,
        role: response.data.role,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        role: undefined,
        data: undefined,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getBooks(): Promise<ClientResponse<any | null>> {
    try {
      const response = await this.client.get("/book/getAll");

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getLoans(
    page: number = 0,
    size: number = 10,
  ): Promise<ClientResponse<any>> {
    try {
      const response = await this.client.get("/loan/getAll", {
        params: { page, size },
      });

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addBook(data: BookDto): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse<BookResponseDto> = await this.client.post(
        "/book/add",
        data,
      );

      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addUser(data: {
    password: string;
    role: string;
    username: string;
    email: string;
  }): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse<BookResponseDto> = await this.client.post(
        "/auth/register",
        data,
      );

      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addLoan(
    data: LoanDto,
  ): Promise<ClientResponse<LoanResponseDto | null>> {
    try {
      const response = await this.client.post("/loan/add", data);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteBook(id: number): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse = await this.client.delete(
        `/book/delete/${id}`,
      );

      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getBookDetails(
    id: number,
  ): Promise<ClientResponse<BookResponseDto | null>> {
    try {
      const bookUrl = `/book/getById/${id}`;
      const bookDetailsUrl = `/bookDetails/getByBookId/${id}`;

      const [bookResponse, bookDetailsResponse] = await Promise.all([
        this.client.get<BookResponseDto>(bookUrl),
        this.client.get<BookResponseDto>(bookDetailsUrl),
      ]);

      const combinedData: BookResponseDto = {
        id: bookResponse.data.id,
        isbn: bookResponse.data.isbn,
        title: bookResponse.data.title,
        author: bookResponse.data.author,
        publisher: bookResponse.data.publisher,
        publishYear: bookResponse.data.publishYear,
        numberCopy: bookResponse.data.numberCopy,
        genre: bookDetailsResponse.data.genre,
        summary: bookDetailsResponse.data.summary,
        coverImageURL: bookDetailsResponse.data.coverImageURL,
      };

      return {
        success: true,
        data: combinedData,
        statusCode: bookResponse.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async updateBook(data: {
    publishYear: number;
    author: string;
    numberCopy: number;
    isbn: string;
    publisher: string;
    id: number;
    title: string;
  }): Promise<{ success: boolean; statusCode: number }> {
    try {
      const response: AxiosResponse = await this.client.put(
        `/book/update/${data.id}`,
        {
          publishYear: data.publishYear,
          author: data.author,
          numberCopy: data.numberCopy,
          isbn: data.isbn,
          publisher: data.publisher,
          title: data.title,
        },
      );

      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("Error updating book:", error);
      return {
        success: false,
        statusCode: (error as AxiosError).response?.status || 500,
      };
    }
  }

  public async updateBookDetails(data: {
    id: number;
    genre?: string;
    summary?: string;
    coverImageURL?: string;
  }): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse = await this.client.put(
        `/bookDetails/update/${data.id}`,
        {
          book: data.id,
          genre: data.genre,
          summary: data.summary,
          coverImageURL: data.coverImageURL,
        },
      );

      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("Error updating book details:", error);
      return {
        success: false,
        statusCode: (error as AxiosError).response?.status || 500,
      };
    }
  }

  public async deleteUser(
    id: number,
  ): Promise<{ success: boolean; statusCode: number }> {
    try {
      const response = await this.client.delete(`/auth/delete/${id}`, {
        params: { id },
      });

      return {
        success: response.status === 204,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        statusCode: (error as AxiosError).response?.status || 500,
      };
    }
  }

  public async getReaders(): Promise<ClientResponse<any>> {
    try {
      const response = await this.client.get("/user/getAllReaders", {});

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  async updateUserInfo(data: {
    id: number;
    email: string;
    fullusername: string;
  }): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response = await this.client.patch(
        `user/updateUserInfo/${data.id}`,
        {
          email: data.email,
          fullusername: data.fullusername,
        },
      );
      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("Error updating user info:", error);
      return {
        success: false,
        statusCode: (error as AxiosError).response?.status || 500,
      };
    }
  }

  public async updateLoanReturnDate(
    loanId: number,
    returnDate: Date,
  ): Promise<{ success: boolean; statusCode: number }> {
    try {
      const response: AxiosResponse = await this.client.put(
        `/loan/returnBook/${loanId}`,
        { returnDate },
      );

      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async updateLoginAndPassword(
    data: LoginAndPassword,
  ): Promise<{ data: undefined; success: boolean; statusCode: number }> {
    try {
      const response: AxiosResponse = await this.client.put(
        `/auth/update`,
        data,
      );

      return {
        data: undefined,
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        data: undefined,
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addReview(review: CreateReviewDto): Promise<{
    data?: CreateReviewResponseDto;
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse<CreateReviewResponseDto> =
        await this.client.post("/review/add", review);

      return {
        data: response.data,
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        data: undefined,
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteReview(id: number): Promise<ClientResponse<void>> {
    try {
      const response = await this.client.delete(`/review/delete?id=${id}`);
      return { data: undefined, success: true, statusCode: response.status };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        data: undefined,
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getAllReviews() {
    return await this.client
      .get("/review/getAll")
      .then((response) => {
        // Assuming the response is directly the list of reviews
        if (response.status === 200) {
          return {
            success: true,
            data: response.data,
          };
        } else {
          console.error("Failed to fetch reviews:", response);
          return {
            success: false,
            message: "Failed to fetch reviews",
            data: null,
          };
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        return {
          success: false,
          message: "Error fetching reviews",
          data: null,
        };
      });
  }
}
